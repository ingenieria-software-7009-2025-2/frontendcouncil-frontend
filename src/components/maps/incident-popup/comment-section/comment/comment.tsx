import React from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { CommentDTO } from '../../../../../models/dto-comment';
import './comment.css';

interface CommentProps {
    comment: CommentDTO;
    isLiked: boolean;
    onLikeToggle: (commentId: number, isLike: boolean) => void;
}

export const Comment: React.FC<CommentProps> = ({ 
    comment, 
    isLiked, 
    onLikeToggle 
}) => {

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
                    <span className="text-muted me-2 small">{comment.likes}</span>
                    <button 
                        className={`heart-button btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => onLikeToggle(comment.comentarioid, !isLiked)}
                    >
                        {isLiked ? (
                            <HeartFill color="red" size={16} className="text-white" />
                        ) : (
                            <Heart size={16} className="text-danger" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};