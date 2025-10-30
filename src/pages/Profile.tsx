import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

interface Post {
  _id: string;
  description: string;
  comments: { text: string }[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // URL Base del backend:
  const API_URL = "http://localhost:3000";

  // Cargar datos del usuario logueado y sus publicaciones:
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/post/user/${parsedUser.id}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;
  return (
    <>
      <Header />

      <div className="container mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-body text-center p-4 bg-light rounded-3">
            <h2 className="mb-3 text-primary">Perfil de {user.nickname}</h2>
            <p className="text-muted mb-4">Bienvenido a tu perfil personal</p>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="mb-4">Tus publicaciones</h4>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted text-center">
              Aún no realizaste publicaciones.
            </p>
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-dark">
                        {post.description || "Sin descripción"}
                      </h5>
                      <p className="text-muted mt-2">
                        💬 {post.comments?.length || 0} comentarios
                      </p>
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="btn btn-primary mt-auto"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;