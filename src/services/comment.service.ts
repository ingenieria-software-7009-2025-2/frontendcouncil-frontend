import { CommentDTO } from "../models/dto-comment";
import '../shared/backendcouncil-api'

export class CommentService {
    private static mockComments: CommentDTO[] = [
        {
            IDComentario: 1,
            ClienteID: 1,
            IncidenteID: 3,
            Contenido: 'Este es el primer comentario',
            Likes: 2,
            FechaCreacion: new Date(Date.now() - 3600000).toISOString(),
            isLiked: false
        },
        {
            IDComentario: 2,
            ClienteID: 1,
            IncidenteID: 2,
            Contenido: 'Otro comentario de ejemplo',
            Likes: 5,
            FechaCreacion: new Date(Date.now() - 7200000).toISOString(),
            isLiked: true
        }
    ];

    static async getByIncidente(incidenteID: number): Promise<CommentDTO[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.mockComments.filter(c => c.IncidenteID === incidenteID));
            }, 300);
        });
    }

    static async create(comment: {
        IncidenteID: number;
        Contenido: string;
        ClienteID: number;
    }): Promise<CommentDTO> {
        return new Promise(resolve => {
            setTimeout(() => {
                const newComment: CommentDTO = {
                    IDComentario: Math.floor(Math.random() * 1000000), // Genera un número aleatorio
                    ClienteID: comment.ClienteID,
                    IncidenteID: comment.IncidenteID,
                    Contenido: comment.Contenido,
                    Likes: 0,
                    FechaCreacion: new Date().toISOString(),
                    isLiked: false
                };
                this.mockComments.unshift(newComment);
                resolve(newComment);
            }, 300);
        });
    }

    static async toggleLike(commentID: number): Promise<CommentDTO> {
        return new Promise(resolve => {
            setTimeout(() => {
                const comment = this.mockComments.find(c => c.IDComentario === commentID);
                if (comment) {
                    comment.isLiked = !comment.isLiked;
                    comment.Likes += comment.isLiked ? 1 : -1;
                }
                resolve(comment!);
            }, 300);
        });
    }

    // Opcional: Método para inicializar datos mock
    static initializeMockData(newComments: CommentDTO[]) {
        this.mockComments = newComments;
    }
}