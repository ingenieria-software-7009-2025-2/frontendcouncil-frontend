export interface CommentDTO {
    IDComentario: number;
    ClienteID: number;
    IncidenteID: number;
    Contenido: string;
    Likes: number;
    FechaCreacion: string;
    isLiked?: boolean;
}