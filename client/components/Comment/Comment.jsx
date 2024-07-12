import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';

const Comment = ({ comment, onReply, onDelete, onUpdate , StarRating }) => {
    const { user } = useAuth();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [openList, setOpenList] = useState(false);
    const [likes, setLikes] = useState(comment.likes);
    const [likedBy, setLikedBy] = useState(comment.likedBy);
    const [openReply, setOpenReply] = useState(false);

    useEffect(() => {
        setLikes(comment.likes);
        setLikedBy(comment.likedBy);
    }, [comment.likes, comment.likedBy]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const response = await axios.post('http://localhost:8800/api/comments/reply', {
                user: user._id,
                hotel: comment.hotel,
                text: replyText,
                parentComment: comment._id,
            }, { withCredentials: true });
            onReply(response.data);
            setReplyText('');
            setShowReply(false);
        } catch (error) {
            console.error('Error creating reply:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8800/api/comments/${comment._id}`, { withCredentials: true });
            onDelete(); // Callback to update the comments list after deletion
        } catch (error) {
            console.error('Error deleting comment:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:8800/api/comments/${comment._id}`, {
                text: editText,
            }, { withCredentials: true });
            onUpdate(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating comment:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.put(`http://localhost:8800/api/comments/likes/${comment._id}`, { userId: user._id }, { withCredentials: true });
            setLikes(response.data.likes);
            setLikedBy(response.data.likedBy);
        } catch (error) {
            console.error('Error liking comment:', error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <div>
                    <img src={comment.user.img ? comment.user.img : '/clone.jpg'} alt={comment.user.username} className="comment-avatar" />
                    <div className="comment-user">{comment.user.username}</div>
                    <StarRating rating={comment.rating} />
                </div>
                {user && user._id === comment.user._id && (
                    <>
                        <svg onClick={() => setOpenList(!openList)} width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                        {openList && (
                            <div className="comment-options">
                                {isEditing ? (
                                    <>
                                        <button className="save-btn" onClick={handleEdit}>Save</button>
                                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Chinh sua</button>
                                        <button className="deletecmt-btn" onClick={handleDelete}>Delete</button>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="comment-text">
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                ) : (
                    comment.text
                )}
            </div>
            <div className='likes-count'><LikeIcon />{likes}</div>
            {user && <div className='likes-action' onClick={handleLike}>
                {likedBy && likedBy.includes(user._id) ? <LikeIcon /> : <UnlikeIcon />}
            </div>}
            {user && (
                <div className="comment-actions">
                    <button onClick={() => setShowReply(!showReply)}>Reply</button>
                </div>
            )}
            {showReply && (
                <form className="comment-reply-form" onSubmit={handleReplySubmit}>
                    <img src={user.img ? user.img : '/clone.jpg'} alt={user.username} className="comment-avatar" />
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button type="submit">Send</button>
                </form>
            )}
            {!openReply && <div className='open-reply' onClick={() => setOpenReply(!openReply)}>
                <p>
                    <svg
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="x19dipnz x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                        style={{ "--color": "var(--secondary-icon)" }}
                    >
                        <g fillRule="evenodd" transform="translate(-448 -592)">
                            <g fillRule="nonzero">
                                <path
                                    d="M93 52v1.5a4 4 0 0 0 4 4h7a1 1 0 1 0 0-2h-7a2 2 0 0 1-2-2V52a1 1 0 0 0-2 0z"
                                    transform="translate(357 543.5)"
                                />
                                <path
                                    d="m103.086 56.5-3.293 3.293a1 1 0 1 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 1.414l3.293 3.293z"
                                    transform="translate(357 543.5)"
                                />
                            </g>
                        </g>

                    </svg>
                    Xem tất cả phản hồi</p>
            </div>}
            {openReply && comment.replies && comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} onReply={onReply} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
        </div>
    );
};

const LikeIcon = () => (
    <span className="x3nfvp2">
        <i
            data-visualcompletion="css-img"
            className="x1b0d499 x1d69dk1"
            style={{
                backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/A9awRPbsUJ5.png')",
                backgroundPosition: "0px -718px",
                backgroundSize: "25px 1423px",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
                display: "inline-block"
            }}
        ></i>
    </span>
);

const UnlikeIcon = () => (
    <span className="x3nfvp2">
        <i
            data-visualcompletion="css-img"
            className="x1b0d499 x1d69dk1"
            style={{
                backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/A9awRPbsUJ5.png')",
                backgroundPosition: "0px -738px",
                backgroundSize: "25px 1423px",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
                display: "inline-block"
            }}
        ></i>
    </span>
);

export default Comment;