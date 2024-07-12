import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { io } from '../index.js'; // Ensure io is accessible
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    // Emit the new room to all connected clients
    io.emit('newRoom', savedRoom);
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    // Emit the updated room to all connected clients
    io.emit('updateRoom', updatedRoom);
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    const updatedRoom = await Room.findOne({ "roomNumbers._id": req.params.id });
    // Emit the updated room availability to all connected clients
    io.emit('updateRoomAvailability', updatedRoom);
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    // Emit the deleted room ID to all connected clients
    io.emit('deleteRoom', req.params.id);
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const searchRooms = async (req, res, next) => {
  const { city, startDate, endDate, adult, children, rooms: roomTotal } = req.params;

  try {
    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all hotels that match the city
    const hotels = await Hotel.find({ city });

    // Array to store available rooms across all hotels
    let availableRooms = [];
    // Array to store total available rooms per hotel
    let hotelTotalAvailableRooms = [];

    // Iterate over each hotel
    for (let hotel of hotels) {
      // Find rooms for the hotel and populate roomNumbers
      const rooms = await Room.find({ _id: { $in: hotel.rooms } });

      // Array to store available rooms for this hotel
      let hotelAvailableRooms = [];

      // Iterate over each room of the hotel
      for (let room of rooms) {
        // Check if at least one room number is available for the given date range and meets capacity requirements
        const availableRoomNumbers = room.roomNumbers.map(roomNumber => {
          const isAvailable = isRoomNumberAvailable(roomNumber, start, end);
          return {
            roomId: roomNumber._id,
            unavailableDates: roomNumber.unavailableDates,
            booked: !isAvailable,
            meetsCapacity: room.maxPeople >= parseInt(adult) + parseInt(children)
          };
        });

        // Filter out room numbers that are available and meet capacity requirements
        const filteredAvailableRoomNumbers = availableRoomNumbers.filter(roomNumber => !roomNumber.booked && roomNumber.meetsCapacity);

        // If there are available room numbers, push the room object with available room count to hotelAvailableRooms
        if (filteredAvailableRoomNumbers.length > 0) {
          hotelAvailableRooms.push({
            hotelId: hotel._id,
            roomId: room._id,
            title: room.title,
            price: room.price,
            maxPeople: room.maxPeople,
            desc: room.desc,
            availableRooms: filteredAvailableRoomNumbers.length,
            roomNumbers: availableRoomNumbers.map(roomNumber => ({
              roomNumberId: roomNumber.roomId,
              unavailableDates: roomNumber.unavailableDates,
              booked: roomNumber.booked
            }))
          });
        }
      }

      // Calculate total available rooms for this hotel
      const totalAvailableRooms = hotelAvailableRooms.reduce((acc, room) => acc + room.availableRooms, 0);

      // Add the hotel total available rooms to the aggregate array
      hotelTotalAvailableRooms.push({
        hotelId: hotel._id,
        total: totalAvailableRooms
      });

      // Add available rooms for this hotel to the main available rooms array
      availableRooms = [...availableRooms, ...hotelAvailableRooms];
    }

    // Filter the availableRooms array based on the total available rooms per hotel
    availableRooms = availableRooms.filter(room => {
      const hotelTotal = hotelTotalAvailableRooms.find(hotel => hotel.hotelId.toString() === room.hotelId.toString());
      return hotelTotal && hotelTotal.total >= roomTotal;
    });

    res.status(200).json(availableRooms);
  } catch (err) {
    next(err);
  }
};

// Helper function to check room number availability for given date range and capacity
const isRoomNumberAvailable = (roomNumber, startDate, endDate) => {
  // Iterate over unavailable dates for the room number
  for (let i = 0; i < roomNumber.unavailableDates.length; i += 2) {
    const unavailableStart = new Date(roomNumber.unavailableDates[i]);
    const unavailableEnd = new Date(roomNumber.unavailableDates[i + 1]);

    // Check for overlap between requested date range and unavailable dates
    if (!(endDate < unavailableStart || startDate > unavailableEnd)) {
      return false; // Overlap found, room number is not available
    }
  }
  return true; // No overlap found, room number is available
};

export const getRoomsByHotel = async (req, res, next) => {
  const { hotelId } = req.params;

  try {
    // Find the hotel by ID
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Fetch the rooms for the hotel
    const rooms = await Room.find({ _id: { $in: hotel.rooms } });

    // Send the rooms in the response
    res.status(200).json(rooms);
  } catch (error) {
    // Handle errors
    next(error); // Use next to pass the error to the error handling middleware
  }
};