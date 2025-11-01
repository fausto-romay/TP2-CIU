import axios from "axios";

const API_URL = "http://localhost:3000/image";

export interface NewImage {
    url: string;
}

export const createImage = async (images: NewImage[]) => {
    try {
        // 👇 el back acepta arrays, así que mandamos directamente el array de objetos { url }
        const response = await axios.post(`${API_URL}/`, images);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error al crear la imagen:", error.response?.data || error.message);
        throw error;
    }
};
