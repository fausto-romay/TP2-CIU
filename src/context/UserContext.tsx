import { createContext, useState, useEffect, useMemo, type ReactNode } from "react";

export interface User {
    _id: string;
    mail: string;
    nickname: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    initialized: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    initialized: false
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }   
        } catch (error) {
            console.error("Error en el localStorage", error)
        }
        finally{
            setInitialized(true);
        }
    }, []);

    useEffect(() => {
        if(user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");;
    }, [user])

    const value = useMemo(() => ({ user, setUser, initialized}), [user, initialized])

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}