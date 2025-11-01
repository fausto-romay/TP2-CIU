import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPostById, type Post } from "../services/postsService";
import { createComment } from "../services/commentService";
import type Comment from "../services/commentService";
import Footer from "../components/Footer";
import "../styles/postDetailed.css";
import "../styles/footer.css";


export default function PostDetailed() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  // usuario
  const storedUser = localStorage.getItem("user")
  const userId = storedUser ? JSON.parse(storedUser)._id : "671edc82c71b28efc915db72" // ID Temporal

  // Traer post
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

useEffect(() => {
  if (post?.comments && post.comments.length > 0) {
    setComments(post.comments);
  }
}, [post]);

  const images = post?.images || [];
  const totalImages = images.length;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));

  // Crear comentario
  const handleAddComment = async () => {
  if (!newComment.trim()) return alert("El comentario no puede estar vacío");
  if (!post) return;
  setLoadingComment(true);

  try {
    const newCommentData = await createComment({
      user: userId,
      post: post._id,
      texto: newComment,
    });

    // Actualiza tanto el estado local de comments como el post
    setComments((prev) => [...prev, newCommentData]);
    setPost((prev) =>
      prev ? { ...prev, comments: [...prev.comments, newCommentData] } : prev
    );

    setNewComment("");
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    alert("Error al enviar el comentario");
  } finally {
    setLoadingComment(false);
  }
};


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
      <main className="pb-5">
        {/* Publicación */}
        <div className="card shadow post-container mt-4 p-4">
          <h3 className="mb-3">{post.user?.nickname}</h3>
          <p className="fs-5">{post.texto}</p>

          {/* Carrusel */}
          {totalImages > 0 ? (
            <div className="carousel-wrapper position-relative mb-4">
              <img
                src={images[currentIndex].url}
                alt={`imagen ${currentIndex + 1}`}
                className="carousel-img img-fluid rounded-4"
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

        {/* Comentarios */}
        <div className="card shadow post-container p-4">
          <div className="mt-4">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loadingComment}
            />
            <button
              className="btn btn-primary rounded-5"
              onClick={handleAddComment}
              disabled={loadingComment}
            >
              {loadingComment ? "Comentando..." : "Comentar"}
            </button>
          </div>

          <div className="border-bottom m-4"></div>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-bottom mb-3 pb-2">
                <strong>{comment.user.nickname ?? "Usuario desconocido"}</strong>
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
      </main>
      <Footer />
    </>
  );
}
