import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import authRoute from './routes/auth.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import usersRoute from './routes/users.js';
import bookingsRoute from './routes/booking.js';
import commentRoute from './routes/comment.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to mongoDB.');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/comments', commentRoute);

app.use(async (err, req, res, next) => {
  const statusError = err.status || 500;
  const messageError = err.message || 'Something is wrong';
  return res.status(statusError).json({
    success: false,
    status: statusError,
    message: messageError,
    stack: err.stack,
  });
});

// Socket.IO connection
io.on('connection', (socket) => {

  // Emit hotel data updates to all connected clients
  const emitHotelUpdates = (hotels) => {
    socket.emit('hotelUpdates', hotels);
  };

  // Simulate hotel data updates (replace with your actual logic)
  setInterval(async () => {
    const updatedHotels = await getUpdatedHotels(); // Replace with your actual function to fetch updated hotels
    emitHotelUpdates(updatedHotels);
  }, 5000); // Every 5 seconds

  socket.on('disconnect', () => {
  });
});

const getUpdatedHotels = async () => {
  // Mock data, replace with your actual logic to fetch updated hotels
  const hotels = await mongoose.model('Hotel').find(); // Assuming you have a Hotel model
  return hotels;
};

server.listen(8800, () => {
  connect();
  console.log('Listening on port 8800');
});