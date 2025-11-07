import axios from "axios";

const API_URL = "http://localhost:3000/user";

export interface createUser {
    mail: string;
    nickname: string;
}

export interface User {
    _id: string;
    mail: string;
    nickname: string;
}

// Registrar usuario
export const registerUser = async (userData:createUser) => {
    try {
        const response = await axios.post(API_URL, userData);
        return response.data;
    } catch (error: unknown) {
        console.error("Error al registrar usuario:", error);
        const message =
            axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error en el registro"
                : error instanceof Error
                    ? error.message
                    : String(error);
        throw message;
    }
};

// Login: busca usuario por nickname
export const loginUser = async (nickname: string) => {
    try {
        const response = await axios.get<User>(`${API_URL}/login/${encodeURIComponent(nickname)}`);
        return response.data;
    } catch (error: unknown) {
        console.error("Error al iniciar sesión:", error);
        const message =
            axios.isAxiosError(error)
                ? (error.response?.data as { message?: string })?.message ?? "Usuario no encontrado"
                : error instanceof Error
                    ? error.message
                    : String(error);
        throw message;
    }
};

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};
