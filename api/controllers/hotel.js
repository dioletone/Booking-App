import Hotel from "../models/Hotel.js";
import { io } from '../index.js'; // Ensure io is accessible

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    // Emit the new hotel to all connected clients
    io.emit('newHotel', savedHotel);
    res.status(200).json(savedHotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    // Emit the updated hotel to all connected clients
    io.emit('updateHotel', updatedHotel);
    res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    // Emit the deleted hotel ID to all connected clients
    io.emit('deleteHotel', req.params.id);
    res.status(200).json({ message: 'Hotel deleted successfully', deletedHotel });
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const searchHotels = async (req, res, next) => {
  try {
    const { type, facilities, distance } = req.query;

    let query = {};

    // Filter by type if provided
    if (type) {
      query.type = type.toString(); // Ensure type is treated as a string
    }

    // Filter by facilities if provided
    if (facilities && facilities.length > 0) {
      query.facilities = { $in: facilities.map(facility => facility.toString()) }; // Convert facilities to strings and match hotels with any of the listed facilities
    }

    // Filter by distance if provided
    if (distance) {
      query.distance = { $lte: parseInt(distance) }; // Convert distance to integer and match hotels within the specified distance
    }

    const hotels = await Hotel.find(query);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};