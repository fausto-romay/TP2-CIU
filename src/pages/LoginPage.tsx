import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { loginUser } from "../services/userService"; // usar login del backend
import logo from "../assets/logo2.png";
import imagen from "../assets/imagenFondo.png";
import "../styles/loginPage.css";

function LoginPage() {
    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // llamada real al backend
            const userData = await loginUser(nickName, password);

            // guardar usuario en contexto y localStorage
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            navigate("/home");
        } catch (err) {
            console.error(err);
            if (typeof err === "string") setError(err);
            else setError("Error al iniciar sesión");
        }
    };

    return (
        <>
        <div className="login-page d-flex align-items-center justify-content-center vh-100">
            <div className="login-wrapper container d-flex justify-content-center align-items-center">
            <div className="image-side d-none d-md-flex justify-content-center align-items-center">
                <img src={imagen} alt="Fondo Unahur" className="login-side-image" />
            </div>
            <div className="form-side d-flex justify-content-center align-items-center">
                <div className="card shadow p-4 text-center login-card">
                <img src={logo} alt="Unahur Logo" className="login-logo mb-3" />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <input
                        type="text"
                        id="nickName"
                        className="form-control"
                        placeholder="Usuario"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                    />
                    </div>
                    <div className="mb-3">
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">
                    Ingresar
                    </button>
                </form>
                <p className="mt-2 pt-2">¿No tienes cuenta? <Link to="/signup">¡Regístrate ahora!</Link></p>
                </div>
            </div>
            </div>
        </div>
        <footer>
            <h5>©2025 Todos los derechos reservados - Grupo 10 CIU-Unahur</h5>
        </footer>
        </>
    );
}

export default LoginPage;
