import express from 'express';
const router = express.Router();
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';
import { updateUser, deleteUser, getUser,  getUsers, getUserByName } from '../controllers/user.js';

// Update user
router.put("/:id", verifyUser, updateUser);

// Delete user
router.delete("/:id", verifyUser, deleteUser);

// Get single user
router.get("/:id", verifyUser, getUser);
// Get all users (only accessible by admin)
router.get("/", verifyAdmin, getUsers);
router.get("/name/:username", getUserByName)
export default router;
