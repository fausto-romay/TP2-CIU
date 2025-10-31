import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPostById } from "../services/postsService";
import { getCommentById } from "../services/commentService";

// Tipos de datos
interface Comment {
  _id: string;
  user: { nickname: string };
  post: string;
  texto: string;
  createdAt: string;
}

interface Image {
  url: string;
}

interface User {
  nickname: string;
}

interface Post {
  _id: string;
  texto: string;
  user: User;
  images: Image[];
  comments: string[]; // IDs de comentarios
}

export default function PostDetailed() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newComment, setNewComment] = useState("");

  // 🔹 Traer el post
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error al traer el post:", error);
      }
    };
    fetchPost();
  }, [id]);

  // 🔹 Traer los comentarios asociados al post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentPromises = post.comments.map((cid: string) =>
          getCommentById(cid)
        );
        const data = await Promise.all(commentPromises);
        setComments(data);
      } catch (error) {
        console.error("Error al traer los comentarios:", error);
      }
    };
    fetchComments();
  }, [post]);

  // 🔹 Carrusel de imágenes
  const images = post?.images || [];
  const totalImages = images.length;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));

  // 🔹 Placeholder mientras carga
  if (!post) {
    return (
      <>
        <Header />
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <div
            className="card p-4 text-center opacity-50"
            style={{ maxWidth: "700px", width: "90%", height: "100rem" }}
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="fs-5 text-muted mb-0 mt-2">Cargando publicación...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="card shadow container mt-4 p-4">
        {/* Autor y texto */}
        <h3 className="mb-3">{post.user?.nickname}</h3>
        <p className="fs-5">{post.texto}</p>

        {/* Carrusel de imágenes */}
        {totalImages > 0 ? (
          <div className="position-relative d-flex justify-content-center align-items-center mb-4">
            <img
              src={images[currentIndex].url}
              alt={`imagen ${currentIndex + 1}`}
              className="img-fluid rounded-4"
              style={{ maxHeight: "600px", objectFit: "cover" }}
            />

            {totalImages > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow"
                  style={{ opacity: 0.8 }}
                >
                  ❮
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow"
                  style={{ opacity: 0.8 }}
                >
                  ❯
                </button>
              </>
            )}

            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-dark text-white px-3 py-1 rounded-pill mb-2 small opacity-75">
              {currentIndex + 1} / {totalImages}
            </div>
          </div>
        ) : (
          <p className="text-muted">Este post no contiene imágenes.</p>
        )}
      </div>

      {/* Sección de comentarios */}
      <div
        className="card shadow container mt-4 p-4"
        style={{ maxWidth: "700px" }}
      >
        {/* Input para agregar comentario  NO FUNCIONAL*/}
        <div className="mt-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary rounded-5">Comentar</button>
        </div>
        <div className="border-bottom m-4"></div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="border-bottom mb-3 pb-2">
              <strong>{comment.user?.nickname ?? "Usuario desconocido"}</strong>
              <p className="mb-1">{comment.texto}</p>
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay comentarios aún.</p>
        )}

      </div>
    </>
  );
}
