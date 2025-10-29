import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getPosts, newPost } from "../services/postsService";
import type { Post } from "../services/postsService";
import noPosts from "../assets/noPostsBored.png";
// import { getTags } from "../services/tagService" // <-- cuando lo tengas hecho

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // --- Campos del nuevo post ---
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data || []);
      } catch (error) {
        console.error("Error al traer los posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Traer lista de tags desde la API (ejemplo)
    const fetchTags = async () => {
      try {
        // const data = await getTags();
        const data = ["tecnologia", "programacion", "musica", "arte"]; // temporal
        setTags(data);
      } catch (error) {
        console.error("Error al traer los tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    try {
      // Ejemplo de estructura a enviar al backend:
      const newPostData = {
        description,
        userId: 1, // temporal hasta que tengas login
        tags: selectedTags,
        images: imageUrls.filter((url) => url.trim() !== ""),
      };

      console.log("Post a enviar:", newPostData);

      // await newPost(newPostData);
      alert("¡Publicación creada con éxito!");

      // Reset
      setDescription("");
      setImageUrls([""]);
      setSelectedTags([]);
      setShowModal(false);

      // Refrescar posts
      const updatedPosts = await getPosts();
      setPosts(updatedPosts || []);
    } catch (error) {
      console.error("Error al crear el post:", error);
      alert("Error al publicar");
    }
  };

  {/* Cargando las publicaciones */}
  if (loading) {
    return (
        <>
        <Header />
        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="card p-4 text-center opacity-50" style={{ maxWidth: "700px", width: "90%", height: "100rem" }}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="fs-5 text-muted mb-0">Cargando..</p>
                </div>
            </div>
        </div>
        </>
    );
  }

  return (
    <>
      <Header />

      {/* Crear publicación */}
      <div className="d-flex flex-column justify-content-center align-items-center mt-4">
        <div className="card shadow p-4 w-100" style={{ maxWidth: "700px", width: "90%" }}>
          <h4 className="card-title mb-3 text-center">
            ¿Qué estás pensando? ¡Compartilo ahora!
          </h4>
          <div className="d-flex justify-content-center align-items-center w-100">
            <input
              type="text"
              className="form-control p-3 rounded-5 w-100"
              placeholder="Escribí lo que quieras compartir"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <div className="d-flex flex-column align-items-center justify-content-center mt-4">
        <div className="w-100" style={{ maxWidth: "700px", width: "90%" }}>
          {posts.length === 0 ? (
            <div className="card shadow p-4 text-center">
              <img
                src={noPosts}
                alt="noPostsImg"
                className="img-fluid mb-3"
                style={{ maxHeight: "250px", objectFit: "contain" }}
              />
              <p className="fs-5 text-muted mb-0">No hay publicaciones aún.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <p>{post.texto}</p>
                  {post.images &&
                    post.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="imagen del post"
                        className="img-fluid rounded mb-2 w-100"
                      />
                    ))}
                  {post.tags &&
                    post.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary me-1">
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal controlado por estado */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-dialog" style={{ maxWidth: "600px" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Crear nueva publicación</h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="¿Qué estás pensando?"
                  rows={4}
                  style={{ resize: "none" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="p-2"></div>

                {/* Campo dinámico de imágenes */}
                {imageUrls.map((url, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control mb-2"
                    placeholder="URL de imagen"
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                ))}
                <button
                  className="btn btn-outline-info rounded-5 m-1"
                  onClick={handleAddImageField}
                >
                  <i className="bi bi-images"></i> + imágenes
                </button>

                {/* Selección de tags */}
                <div className="mt-3">
                  <p className="fw-semibold mb-1">Seleccioná etiquetas:</p>
                  <div className="d-flex flex-wrap">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`btn btn-sm m-1 ${
                          selectedTags.includes(tag)
                            ? "btn-info text-white"
                            : "btn-outline-info"
                        }`}
                        onClick={() => handleToggleTag(tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
