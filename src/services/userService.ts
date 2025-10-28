import axios from "axios";

// URL base de tu API (esto no esta bien) "https://github.com/EP-UnaHur-2025C2/anti-social-documental-grupo1"
const API_URL = "http://localhost:3000"; 
export interface User {
    id: string;
    nickName: string;   
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_URL}/user`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};

export const getUserByNickName = async (nickName: string): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_URL}/user?nickName=${nickName}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener usuario ${nickName}:`, error);
        return [];
    }
};