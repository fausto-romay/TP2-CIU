import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

interface Post {
  _id: string;
  texto: string;
  comments?: { texto: string }[];
}

interface User {
  _id: string;
  nickname: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000";

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
        const response = await axios.get(`${API_URL}/post/user/${parsedUser._id}`);
        setPosts(response.data || []);
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

      <div className="container mt-5 mb-5">
        {/* Tarjeta del perfil */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body text-center p-5 bg-light rounded-3">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle bg-primary d-flex justify-content-center align-items-center mb-3"
                style={{ width: "90px", height: "90px", fontSize: "2rem", color: "white" }}
              >
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              <h2 className="fw-bold text-primary mb-1">{user.nickname}</h2>
              <p className="text-muted">Bienvenido a tu perfil personal</p>
              <button className="btn btn-outline-danger mt-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Lista de publicaciones */}
        <div>
          <h4 className="mb-4 text-center text-secondary">Tus publicaciones</h4>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted fs-5">Aún no realizaste publicaciones.</p>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-semibold text-dark mb-3">
                        {post.texto || "Sin descripción"}
                      </h5>

                      <p className="text-muted small mb-3">
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

      <Footer />
    </>
  );
};

export default Profile;