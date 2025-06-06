import { CommentDTO } from "../models/dto-comment";

export class CommentService {
  private apiBaseUrl = 'http://localhost:8080';

  // Método para obtener todos los comentarios y filtrarlos por incidenteid
  public async getCommentsByIncidentId(incidenteid: number): Promise<CommentDTO[]> {
    try {
        const response = await fetch(`${this.apiBaseUrl}/v1/comment/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allComments: CommentDTO[] = await response.json();

        // Verificación exhaustiva
        console.log("Todos los comentarios recibidos:", allComments);

        // Retornar todos los comentarios sin filtro
        return allComments;
    } catch (error) {
        console.error('Error fetching comments:', error);
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

  // Método para dar like a un comentario
  public async likeComment(comentarioid: number): Promise<number> {
    try {
        const response = await fetch(`${this.apiBaseUrl}/v1/comment/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comentarioid: comentarioid }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json(); // Devuelve el nuevo conteo de likes
    } catch (error) {
        console.error('Error liking comment:', error);
        throw error;
    }
}

public async dislikeComment(comentarioid: number): Promise<number> {
    try {
        const response = await fetch(`${this.apiBaseUrl}/v1/comment/dislike`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comentarioid: comentarioid }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json(); // Devuelve el nuevo conteo de likes
    } catch (error) {
        console.error('Error disliking comment:', error);
        throw error;
    }
}
}