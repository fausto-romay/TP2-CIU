import { Link } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
        const navigate = useNavigate();

    // Por ahora solo simula un logout: (agregar en cerrar sesion de header
    const handleLogout = () => {
        localStorage.removeItem("loggedUser");
        navigate("/");
    }

    return (
        <header className="p-2 border-bottom w-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="#">
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
                <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/profile">Mi perfil</Link>
                </li>
            </ul>

            {/* Ítem de la derecha */}
            <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    ¡Hola, (usuario)!
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li><Link className="dropdown-item" to="#">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar sesión
                    </Link></li>
                </ul>
                </li>
            </ul>
            </div>
        </nav>
        </header>
    );
}
