import React, { useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import { useAuth } from '../../context/AuthProvider';
import useFetch from '../../hooks/useFetch';
import '../../styles/CommentsSection.css';

const CommentsSection = ({ hotelId , setShowLogin}) => {
  const { user } = useAuth();
  const { data: comments, loading, error, reFetch } = useFetch(`http://localhost:8800/api/comments/hotel/${hotelId}`);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
    
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:8800/api/comments', {
        user: user._id,
        hotel: hotelId,
        rating: rating,
        text: newComment
      }, { withCredentials: true });
      reFetch(); 
      setNewComment('');
      setRating(5);
    } catch (error) {
      console.error('Error creating comment:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleReply = () => {
    reFetch(); 
  };
  const handleDelete = () => {
    reFetch(); 
  };
  const handleUpdate = () => {
    reFetch(); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="comments-section">
       <h2>Comments</h2>
    
      <div className="comments-list">
        {comments && comments.map(comment => (
          <Comment key={comment._id} comment={comment} onReply={handleReply} onDelete={handleDelete} onUpdate={handleUpdate} StarRating={StarRating} />
        ))}
      </div>
      <form className="new-comment-form" onSubmit={handleCommentSubmit}>
        <div className='rating-comment'>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          Rate Hotel
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
};

const StarRating = ({ rating, onRatingChange }) => {
  const handleStarClick = (starIndex) => {
    onRatingChange(starIndex);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'filled-star' : 'empty-star'}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default CommentsSection;