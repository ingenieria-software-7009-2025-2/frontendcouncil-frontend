import React from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { CommentDTO } from '../../../../../models/dto-comment';
import './comment.css';

interface CommentProps {
    comment: CommentDTO;
    onLikeToggle: (commentID: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, onLikeToggle }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`;
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`;
        return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
    };

    return (
        <div className="comment-container mb-3 p-3 rounded shadow-sm">
            <div className="d-flex align-items-center mb-2">
                <div className="comment-user-info">
                    <span className="fw-bold">Usuario {comment.ClienteID}</span>
                    <span className="text-muted ms-2 small">
                        {formatDate(comment.FechaCreacion)}
                    </span>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-start">
                <div className="comment-content me-3" style={{flex: '1 1 auto'}}>
                    {comment.Contenido}
                </div>
                <div className="comment-actions flex-shrink-0 d-flex align-items-center">
                    <span className="text-muted me-2 small">{comment.Likes}</span>
                    <button 
                        className={`heart-button btn btn-sm ${comment.isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => onLikeToggle(comment.IDComentario)}
                    >
                        {comment.isLiked ? (
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