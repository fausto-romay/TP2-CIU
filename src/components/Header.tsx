import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useState, useEffect } from "react";

export default function Header() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // Leer el usuario guardado en localStorage:
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.nickName || "Usuario");
            } catch (error) {
                console.error("Error al leer el usuario:", error);
                setUserName("Usuario");
            }
        }
    }, []);

    // Por ahora solo simula un logout: (agregar en cerrar sesion de header
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <header className="p-2 border-bottom w-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/home">
            <img src={logo} alt="Unahur net" style={{ maxHeight: "70px" }} />
            </Link>

            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
            {/* Ítems de la izquierda */}
            <ul className="navbar-nav">
                <li className="nav-item active">
                <Link className="nav-link" to="/home">
                    Home
                </Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/profile">
                    Mi perfil
                </Link>
                </li>
            </ul>

            {/* Ítem de la derecha */}
            <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="navbarDropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ textDecoration: "none" }}
                >
                    ¡Hola, {userName}!
                </button>
                <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                >
                    <li>
                    <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar sesión
                    </button>
                    </li>
                </ul>
                </li>
            </ul>
            </div>
        </nav>
        </header>
    );
}
