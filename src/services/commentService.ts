import axios from "axios";
import type { User } from "./userService";
import type { Post } from "./postsService";

const API_URL = "http://localhost:3000/comment";

export default interface Comment  {
    _id: string;
    texto: string;
    user: User;
    post: Post; 
    createdAt: string;
} 

export interface CreateComment {
    texto: string;
    user: string;
    post: number;
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

// Crear un nuevo comentario
export const createComment = async (commentData: CreateComment) => {
    try {
        const response = await axios.post(`${API_URL}/`, commentData);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error al crear el comentario:", error.response?.data || error.message);
        throw error;
    }
};