import React, { useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { CommentDTO } from '../../../../../models/dto-comment';
import './comment.css';

interface CommentProps {
    comment: CommentDTO;
    isLiked: boolean;
    onLikeToggle: (comentarioid: number, isLike: boolean) => Promise<void>;
}

export const Comment: React.FC<CommentProps> = ({ 
    comment, 
    isLiked: initialIsLiked, 
    onLikeToggle 
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(comment.likes || 0);
    const [isLoading, setIsLoading] = useState(false);

    const handleLikeClick = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
             setIsLiked(!isLiked);
            
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
            
            // Call the parent handler which communicates with backend
            await onLikeToggle(comment.comentarioid, isLiked);
        } catch (error) {
            // Revert changes if there's an error
            setIsLiked(!isLiked);
            setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
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
                        {likeCount}
                    </span>
                    <button 
                        className={`heart-button btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={handleLikeClick}
                        disabled={isLoading}
                        aria-label={isLiked ? 'Quitar like' : 'Dar like'}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                        ) : isLiked ? (
                            <HeartFill color="white" size={16} />
                        ) : (
                            <Heart size={16} className="text-danger" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};