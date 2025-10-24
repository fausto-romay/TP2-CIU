import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (password != "123456") {
                setError("Contraseña incorrecta");
                return;
            }

            // Lama a la API del backend para verificar si el usuario existe:
            const res = await axios.get(`http://localhost:3000/users?nickName=${nickName}`);
            const users = res.data;

            if (users.length === 0) {
                setError("El usuario no existe.");
                return;
            }

            // Si el usuario existe, simulamos el login:
            const user = users[0];
            localStorage.setItem("loggedUser", JSON.stringify(user));
            navigate("/home");
        } catch (err) {
            console.error(err);
            setError("Error al conectar con el servidor.");
        }
    };

    return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
            <div className="card-body">
                <h3 className="card-title text-center mb-4 text-primary fw-bold">
                    UnaHur Anti-Social Net 👽
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nickName" className="form-label">
                            Nickname
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="nickName"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            placeholder="Ingresá tu nickname"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123456"
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 text-center" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-2"
                        >
                        Iniciar sesión
                    </button>
                </form>

                <p className="text-muted text-center mt-4" style={{ fontSize: "0.9rem" }}>
                    * Simulación de login (no se requiere autenticación real)
                </p>
            </div>
        </div>
    </div>
    )
}

export default LoginPage;