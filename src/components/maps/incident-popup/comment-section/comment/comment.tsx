import React, { useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { CommentDTO } from '../../../../../models/dto-comment';
import './comment.css';

interface CommentProps {
    comment: CommentDTO;
    isLiked: boolean;
}

export const Comment: React.FC<CommentProps> = ({ 
    comment, 
    isLiked: initialIsLiked 
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(comment.likes || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [tempLikeCount, setTempLikeCount] = useState(comment.likes);
    
    const apiUrl = 'http://localhost:8080/v1/comment';

    const handleLikeToggle = async (comentarioid: number, isLike: boolean): Promise<number> => {
        setTempLikeCount(comment.likes);
        const endpoint = isLike ? 'dislike' : 'like';
        isLike ? setTempLikeCount(comment.likes)  : setTempLikeCount(comment.likes + 1);
        const response = await fetch(`${apiUrl}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comentarioid })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const handleLikeClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newLikeStatus = !isLiked;
            setIsLiked(newLikeStatus);
            setLikeCount(comment.likes);
            const updatedLikes = await handleLikeToggle(comment.comentarioid, isLiked);
            setLikeCount(updatedLikes);
        } catch (error) {
            setIsLiked(!isLiked);
            setLikeCount(likeCount);
            console.error('Error toggling like:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="comment-container mb-3 p-3 rounded shadow-sm">
            <div className="d-flex align-items-center mb-2">
                <div className="comment-user-info">
                    <span className="fw-bold">Usuario {comment.clienteid}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-start">
                <div className="comment-content me-3" style={{flex: '1 1 auto'}}>
                    {comment.contenido}
                </div>
                <div className="comment-actions flex-shrink-0 d-flex align-items-center">
                    <span className={`me-2 small ${isLoading ? 'text-muted' : ''}`}>
                        {tempLikeCount}
                    </span>
                    <button 
                        className={`heart-button btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={handleLikeClick}
                        disabled={isLoading}
                        aria-label={isLiked ? 'like' : 'dislike'}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                        ) : isLiked ? (
                            <HeartFill color="red" size={16} />
                        ) : (
                            <Heart size={16} className="text-danger" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};