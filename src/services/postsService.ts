import axios from "axios";

const API_URL = "http://localhost:3000";

export interface Post extends CreatePost {
  id: number;
}

export interface CreatePost {
  texto: string;
  images?: string[]; // <-- opcional
  tags?: string[];  // <-- opcional
}



export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>(`${API_URL}/post`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    throw error;
  }
};

export const newPost = async (createPost: CreatePost): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/post`, createPost);
  return response.data;
};
