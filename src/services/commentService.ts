import axios from "axios";

const API_URL = "http://localhost:3000/comment";

export interface Comment extends createComment {
    id: string;
}

export interface createComment {
    texto: string;
    user: string;
} 

export const getComments = async (): Promise<Comment[]> => {
    try {
        const response = await axios.get<Comment[]>(`${API_URL}/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los posts:", error);
        throw error;
    }
};

export const getCommentById = async (id:string): Promise<Comment> => {
    try {
        const response = await axios.get<Comment>(`${API_URL}/:${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el comentario", error);
        throw error;
    }
};
