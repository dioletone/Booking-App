import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
    
  },
  text: { 
    type: String, 
    required: true 
  },
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Comment', CommentSchema);