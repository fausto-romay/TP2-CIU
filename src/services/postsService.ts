import axios from "axios";

const API_URL = "http://localhost:3000/post";

export interface Post extends CreatePost {
  _id: number;
}

export interface CreatePost {
  user: string;
  texto: string;
  images?: string[]; // <-- opcional
  tags?: string[];  // <-- opcional
}



export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    throw error;
  }
};

export const newPost = async (createPost: CreatePost): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}`, createPost);
  return response.data;
};

export const getPostById = async (id:string): Promise<Post> => {
  try {
    const response = await axios.get<Post>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el posts", error);
    throw error;
  }
};