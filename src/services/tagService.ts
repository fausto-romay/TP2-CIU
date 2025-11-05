import axios from "axios";

const API_URL = "http://localhost:3000/tag";

export interface Tag {
  _id: string;
  nombre: string;
}

export interface CreateTag {
  nombre: string[];
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

export const createTags = async (tagsData: { nombre: string }[]) => {
    try {
        const response = await axios.post(`${API_URL}/`, tagsData);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error al crear los tags:", error.response?.data || error.message);
        throw error;
    }
};
