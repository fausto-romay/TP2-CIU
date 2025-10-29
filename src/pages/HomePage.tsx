import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getPosts, newPost } from "../services/postsService";
import type { Post/* CreatePost */} from "../services/postsService";
import noPosts from "../assets/noPostsBored.png"

function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Control del modal
    // const [postNuevo, setPostNuevo] = useState<CreatePost>()

    useEffect(() => {
        const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data || []); // Evita que sea undefined
        } catch (error) {
            console.error("Error al traer los posts:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
        <div className="text-center mt-5">
            <p>Cargando posts...</p>
        </div>
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

                    {/* Render de imágenes */}
                    {post.images &&
                    post.images.map((img, index) => (
                        <img
                        key={index}
                        src={img}
                        alt="imagen del post"
                        className="img-fluid rounded mb-2 w-100"
                        />
                    ))}

                    {/* Render de tags */}
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
                    ></textarea>
                    <div className="p-2"></div>
                    { /* TODO ESTO SIGUE EN PROCESO */}
                    <button className="btn btn-outline-info rounded-5 m-1" >
                        <i className="bi bi-images"></i> + imagenes
                    </button>
                    <button className="btn btn-outline-info rounded-5 m-1" >
                        <i className="bi bi-tags"></i> + tags
                    </button>
                </div>
                <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                >
                    Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => newPost}>
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
