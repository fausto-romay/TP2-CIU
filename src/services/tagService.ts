import axios from "axios";

const API_URL = "http://localhost:3000/tag";

export interface Tag {
  id: string;
  nombre: string;
}

export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await axios.get<Tag[]>(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tags:", error);
    throw error;
  }
};

