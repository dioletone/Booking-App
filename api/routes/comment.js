import express from 'express';
import { createComment, updateComment, deleteComment, getCommentsByHotel, replyComment, likesComment, getCommentsbyUser } from '../controllers/comment.js';

const router = express.Router();

// Create a new comment
router.post('/', createComment);
//reply
router.post('/reply', replyComment); // Add this line for replying to comments
// Update a comment by ID
router.put('/:commentId', updateComment);

// Delete a comment by ID
router.delete('/:commentId',  deleteComment);

// Get comments by hotel ID
router.get('/hotel/:hotelId', getCommentsByHotel);
//Like
router.put('/likes/:id', likesComment);
router.get("/user/:userId", getCommentsbyUser);
export default router;