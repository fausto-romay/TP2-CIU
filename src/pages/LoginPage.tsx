import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { getUserByNickName } from "../services/userService";

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
            const users = await getUserByNickName(nickName);

            if (!users || users.length === 0) {
                setError("Usuario no encontrado");
                return;
            }

            if (password !== "123456") {
                setError("Contraseña incorrecta");
                return;
            }

            const loggedUser = users[0];
            setUser(loggedUser);
            localStorage.setItem("user", JSON.stringify(loggedUser));

            navigate("/home");
        } catch (err) {
            console.error(err);
            setError("Error al iniciar sesión");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nickName" className="form-label">NickName</label>
                        <input
                        type="text"
                        id="nickName"
                        className="form-control"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;
