import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { loginUser } from "../services/userService";
import logo from "../assets/logo2.png";
import imagen from "../assets/imagenFondo.png";
import "../styles/loginPage.css";
import LoadingScreen from "../components/loadingScreen";

function LoginPage() {
    const [nickname, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // ⚠️ Contraseña simple temporal (solo para pruebas)
            if (password !== "12345") {
                setLoading(false);
                return setError("Contraseña incorrecta");
            }
            
            setLoading(true)

            // 🔹 Llamada al backend
            const userData = await loginUser(nickname.trim());

            // 🔹 Guardar usuario en contexto y localStorage
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            setTimeout(() => {
            setLoading(false);
            navigate("/home");
            }, 2000)
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setLoading(false);
            setError(typeof err === "string" ? err : "Error al iniciar sesión");
        }
    };

    if (loading) return <LoadingScreen />;

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
                                <button type="submit" className="btn btn-primary w-100">
                                    Ingresar
                                </button>
                            </form>
                            <p className="mt-2 pt-2">
                                ¿No tienes cuenta?{" "}
                                <Link to="/signup">¡Regístrate ahora!</Link>
                            </p>
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
