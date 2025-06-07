import { CommentDTO } from "../models/dto-comment";

export class CommentService {
  private apiBaseUrl = 'http://localhost:8080';

  // Método para obtener comentarios por incidenteid
  public async getCommentsByIncidentId(incidenteid: number): Promise<CommentDTO[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/v1/comment/incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidenteid: incidenteid
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const comments: CommentDTO[] = await response.json();
      return comments;
    } catch (error) {
      console.error('Error fetching comments by incident ID:', error);
      throw error;
    }
  }

  // Método para obtener todos los comentarios y filtrarlos por incidenteid
  public async getAllComments(): Promise<CommentDTO[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/v1/comment/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allComments: CommentDTO[] = await response.json();
      return allComments;
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  }





  // Método para crear un nuevo comentario
  public async createComment(commentData: {
    clienteid: number;
    incidenteid: number;
    contenido: string;
  }): Promise<CommentDTO> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/v1/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteid: commentData.clienteid,
          incidenteid: commentData.incidenteid,
          contenido: commentData.contenido
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

}