import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService"; // usar el servicio real
import logo from "../assets/logo2.png";
import imagen from "../assets/imagenFondo.png";
import "../styles/loginPage.css";

function SignupPage() {
    const [mail, setEmail] = useState("");
    const [nickname, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [registrado, setRegistrado] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setRegistrado("");

        try {
            const newUser = { mail, nickname };

            // llamada real al backend
            await registerUser(newUser);

            setRegistrado("Usuario creado exitosamente, redirigiendo al Login")
            setTimeout(() => navigate("/"), 5000); // redirige al login
        } catch (err) {
            console.error(err);
            if (typeof err === "string") setError(err);
            else setError("Error al registrarse");
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
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Correo electrónico"
                        value={mail}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    <div className="mb-3">
                    <input
                        type="text"
                        id="nickName"
                        className="form-control"
                        placeholder="Nombre de usuario"
                        value={nickname}
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
                    {registrado && <div className="alert alert-success">{registrado}</div>}
                    <button type="submit" className="btn btn-primary w-100">
                    Registrarte
                    </button>
                </form>
                <p className="mt-2 pt-2">¿Ya tienes una cuenta? <Link to="/">¡Inicia sesión!</Link></p>
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

export default SignupPage;