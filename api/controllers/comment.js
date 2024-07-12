import Comment from "../models/Comment.js";
import { io } from '../index.js'; // Ensure io is accessible
import Hotel from "../models/Hotel.js";
const populateReplies = async (comment, depth) => {
  if (depth === 0) return comment;

  comment = await Comment.populate(comment, {
    path: 'replies',
    populate: {
      path: 'user',
      select: 'username img'
    }
  });

  for (let reply of comment.replies) {
    await populateReplies(reply, depth - 1);
  }

  return comment;
};

export const getCommentsByHotel = async (req, res) => {
  const { hotelId } = req.params;

  try {
    let comments = await Comment.find({ hotel: hotelId, parentComment: null })
      .populate('user', 'username img')
      .lean(); // Using lean to convert to plain JS objects

    for (let i = 0; i < comments.length; i++) {
      comments[i] = await populateReplies(comments[i], 3); // Adjust the depth as needed
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHotelRating = async (hotelId) => {
    const comments = await Comment.find({ hotel: hotelId });
  
    if (comments.length > 0) {
      const sumRatings = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
      const avgRating = sumRatings / comments.length;
      const reviewsCount = comments.length;
  
    
  
      await Hotel.findByIdAndUpdate(hotelId, { rating: avgRating, reviewsCount: reviewsCount });
    } else {
      await Hotel.findByIdAndUpdate(hotelId, { rating: 0, reviewsCount: 0 });
    }
  };
  export const createComment = async (req, res) => {
    const { hotel, user, text, rating } = req.body;
  
    try {
      const newComment = new Comment({ user, hotel, text, rating });
      const savedComment = await newComment.save();
  
      const populatedComment = await Comment.findById(savedComment._id)
        .populate('user', 'username img')
        .exec();
  
      // Update the hotel's rating and reviews count
      await updateHotelRating(hotel);
  
      // Emit the new comment to all connected clients
      io.emit('newComment', populatedComment);
  
      res.status(201).json(populatedComment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const replyComment = async (req, res) => {
  const { hotel, user, text, parentComment } = req.body;

  try {
    const parent = await Comment.findById(parentComment);
    if (!parent) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const newComment = new Comment({ user, hotel, text, parentComment });
    const savedComment = await newComment.save();

    parent.replies.push(savedComment._id);
    await parent.save();

    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'username img')
      .exec();

    io.emit('newReply', populatedComment);

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
    if (!updatedComment) return res.status(404).json({ error: 'Comment not found' });

    io.emit('updateComment', updatedComment);

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) return res.status(404).json({ error: 'Comment not found' });

    io.emit('deleteComment', commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likesComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.body.userId;

    if (comment.likedBy.includes(userId)) {
      comment.likes -= 1;
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
    } else {
      comment.likes += 1;
      comment.likedBy.push(userId);
    }

    await comment.save();

    io.emit('updateComment', comment);

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getCommentsbyUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const comments = await Comment.find({ user: userId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};