import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    roomNumbers: [
      {
        number: Number,
        unavailableDates: { type: [Date], default: [] },
        booked: Boolean,
      },
    ],
    capacityCheck: {
      type: Boolean,
      default: true, // Assuming all rooms are initially available
    },
  },
  { timestamps: true }
);

// Virtual property to calculate available rooms
RoomSchema.virtual('availableRooms').get(function() {
  return this.roomNumbers.length;
});

// Ensure virtuals are included in the output
RoomSchema.set('toJSON', { virtuals: true });
RoomSchema.set('toObject', { virtuals: true });

export default mongoose.model('Room', RoomSchema);