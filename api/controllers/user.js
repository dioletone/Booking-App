import User from "../models/User.js";
import { io } from '../index.js'; // Ensure io is accessible
const resetPassword = async (newPassword, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return hashedPassword;
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { password, ...otherFields } = req.body;

    // If the password is provided, hash it
    if (password) {
      otherFields.password = await resetPassword(password, next);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: otherFields },
      { new: true }
    );

    // Emit the updated user to all connected clients
    io.emit('updateUser', updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Emit the deleted user ID to all connected clients
    io.emit('deleteUser', req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserByName = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};