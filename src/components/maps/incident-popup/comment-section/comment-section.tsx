import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { Send, SendFill } from 'react-bootstrap-icons';
import { Comment } from './comment/comment';
import { CommentService } from '../../../../services/comment.service';
import { CommentDTO } from '../../../../models/dto-comment';
import './comment-section.css';

interface CommentSectionProps {
    show: boolean;
    onHide: () => void;
    incidenteID: number;
    currentUserID: number;
    onCommentAdded?: (newCount: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
    show, 
    onHide, 
    incidenteID, 
    currentUserID,
    onCommentAdded 
}) => {
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadComments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const commentsData = await CommentService.getByIncidente(incidenteID);
            setComments(commentsData);
        } catch (err) {
            console.error('Error cargando comentarios:', err);
            setError('Error al cargar comentarios');
        } finally {
            setIsLoading(false);
        }
    }, [incidenteID]);

    useEffect(() => {
        if (show) {
            loadComments();
        }
    }, [show, incidenteID, loadComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const createdComment = await CommentService.create({
                IncidenteID: incidenteID,
                Contenido: newComment,
                ClienteID: currentUserID
            });
            
            setComments(prev => [createdComment, ...prev]);
            setNewComment('');
            onCommentAdded?.(comments.length + 1);
        } catch (err) {
            console.error('Error agregando comentario:', err);
            setError('Error al agregar comentario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLikeToggle = async (commentID: number) => {
        try {
            const updatedComment = await CommentService.toggleLike(commentID);
            setComments(prev => 
                prev.map(c => c.IDComentario === updatedComment.IDComentario ? updatedComment : c)
            );
        } catch (err) {
            console.error('Error al actualizar like:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            className="custom-modal" 
            size="lg"
            backdrop="static"
        >
            <Modal.Header closeButton>
            </Modal.Header>
            
            <Modal.Body className="pt-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <span className="comments-title mb-2 fw-bold">COMENTARIOS {comments.length > 0 && `(${comments.length})`}</span>
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : isLoading && comments.length === 0 ? (
                    <div className="text-center py-4">Cargando comentarios...</div>
                ) : comments.length === 0 ? (
                    <div className="text-muted text-center py-4">
                        No hay comentarios aún, inicia la conversación
                    </div>
                ) : (
                    comments.map(comment => (
                        <Comment 
                            key={comment.IDComentario} 
                            comment={comment}
                            onLikeToggle={handleLikeToggle}
                        />
                    ))
                )}
            </Modal.Body>
            
            <Modal.Footer className="border-0 pt-0">
                <div className="add-comment position-relative w-100">
                    <input
                        type="text"
                        className={`add-comment-input form-control rounded-pill ps-3 pe-5 py-2 ${error ? 'is-invalid' : ''}`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu comentario..."
                        disabled={isLoading}
                    />
                    <button 
                        className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 me-3"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isLoading}
                        style={{ 
                            color: newComment.trim() ? '#0095f6' : '#c7c7c7',
                            cursor: isLoading ? 'wait' : 'pointer'
                        }}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : newComment.trim() ? (
                            <SendFill size={18} />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};