import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import { Home, UserRound, Menu } from "lucide-react";
import "../styles/header.css";

export default function Header() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.nickname || "Usuario");
            } catch (error) {
                console.error("Error al leer el usuario:", error);
                setUserName("Usuario");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <header className="header">
            <nav className="navBar d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <button
                        className="botonDesplegable d-lg-none"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <Menu size={28} />
                    </button>
                    <img
                        className="logoNav"
                        src={logo}
                        alt="Unahur net"
                        onClick={() => navigate("/HomePage")}
                    />
                </div>

                {/* Menú derecho */}
                <div className={`navRight ${menuOpen ? "show" : ""}`}>
                    <ul className="navIcons mb-0">
                        <li>
                            <Home
                                className="icon"
                                onClick={() => navigate("/HomePage")}
                            />
                        </li>
                        <li>
                            <UserRound
                                className="icon"
                                onClick={() => navigate("/Profile")}
                            />
                        </li>
                    </ul>

                    <div className="dropdown" ref={dropdownRef}>
                        <button
                            className="userButton"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            ¡Hola, {userName}!
                        </button>
                        {dropdownOpen && (
                            <ul className="dropdownMenu">
                                <li>
                                    <button onClick={handleLogout}>Cerrar sesión</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
