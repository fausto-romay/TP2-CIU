import axios from "axios";

// URL base de tu API: "https://github.com/EP-UnaHur-2025C2/anti-social-documental-grupo1"
const API_URL = "http://localhost:3000/user"; 
export interface User {
    id: string;
    email: string;
    nickName: string;
    password?: string;   
}

// Registro:
export const registerUser = async (userData: Omit<User, "id">) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
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
}

// Login:
export const loginUser = async (nickName: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { nickName, password });
        return response.data;
    } catch (error: unknown) {
        console.error("Error al iniciar sesión:", error);
        const message =
            axios.isAxiosError(error)
                ? (error.response?.data as { message?: string })?.message ?? "Error en el login"
                : error instanceof Error
                    ? error.message
                    : String(error);
        throw message;
    }
}

// Obtener usuarios:
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_URL}/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};