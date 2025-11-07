import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Post } from "../services/postsService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/home.css"


const Profile = () => {
  const navigate = useNavigate();
  const { user, initialized, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000";

    useEffect(() => {
    if (!initialized) return; // Esperar el contexto
    if (!user) {
      navigate("/");
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/post/user/${user._id}`);
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [initialized, user, navigate]);

  if (!initialized || !user) return null;
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <Header />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg mb-4 textoHome">
          <div className="card-body text-center p-5 rounded-3 textoHome">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle bg-primary d-flex justify-content-center align-items-center mb-3"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "2rem",
                  color: "white",
                }}
              >
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              <h2 className="fw-bold text-primary mb-1">{user.nickname}</h2>
              <p className="text-muted" >Bienvenido a tu perfil personal</p>
              <button className="btn btn-outline-danger mt-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-center text-secondary" style={{color:"var(--text-color)!important"}}>Tus publicaciones</h4>

          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted" style={{color:"var(--text-color)!important"}}>Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted fs-5" style={{color:"var(--text-color)!important"}}>Aún no realizaste publicaciones.</p>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body d-flex flex-column textoHome">
                      <h5 className="card-title fw-semibold mb-3">
                        {post.texto || "Sin descripción"}
                      </h5>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag._id}
                              className="badge bg-secondary me-2"
                            >
                              #{tag.nombre}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {
                        post.images && post.images?.length > 0 
                        ? <p className="text-muted small mb-3">Este post contiene imagenes</p>
                        : <p className="text-muted small mb-3">Este post no contiene imagenes</p>
                      }

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
