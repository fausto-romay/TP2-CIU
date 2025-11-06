import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useContext, useState } from "react";
import { Home, UserRound, LogOut} from "lucide-react";
import "../styles/header.css"
import { UserContext } from "../context/UserContext";
import TemaBoton from "./TemaBoton";

export default function Header() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };


    return (
        <header className="header">
            <div className="nav-container">
                <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            <img
                src={logo}
                alt="Logo"
                className="nav-logo"
                onClick={() => navigate("/home")}
            />

            <div className="nav-right">

                <h1 className="nav-text">Hola, <i className="nav-text-nickname">
                {user?.nickname}
                </i>!</h1>
            <nav className={`nav-icons ${menuOpen ? "open" : ""}`}>
                <TemaBoton
                />
                <Home
                className="nav-icon"
                onClick={() => navigate("/home")}
                size={26}
                />
                <UserRound
                className="nav-icon"
                onClick={() => navigate("/profile")}
                size={26}
                />
                <LogOut
                className="nav-icon logout"
                onClick={handleLogout}
                size={26}
                />
            </nav>
                </div>
            </div>
        </header>
    );
}