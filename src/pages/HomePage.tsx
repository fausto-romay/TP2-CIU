import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import noPosts from "../assets/noPostsBored.png";
import { getPosts, newPost, type Post } from "../services/postsService";
import { getTags, createTags, type Tag } from "../services/tagService";
import { createImage } from "../services/imagesService";
import type { User } from "../services/userService";

function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Campos del nuevo post
    const [description, setDescription] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");


    // Filtro por etiquetas
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Publicaciones destacadas
    const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);

    // Control del carrusel
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

    // Usuario logueado
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    // CARGAR POSTS, TAGS Y USUARIO
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setLoggedUser(JSON.parse(storedUser));

        const fetchData = async () => {
        try {
            const [postsData, tagsData] = await Promise.all([getPosts(), getTags()]);
            setPosts(postsData || []);
            setTags(tagsData || []);

            if (postsData && postsData.length > 0) {
            const shuffled = [...postsData].sort(() => 0.5 - Math.random());
            setFeaturedPosts(shuffled.slice(0, 3)); // 3 destacadas
            }
        } catch (error) {
            console.error("Error al traer los datos:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    // MANEJO DE CAMPOS
    const handleAddImageField = () => setImageUrls([...imageUrls, ""]);

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...imageUrls];
        newImages[index] = value;
        setImageUrls(newImages);
    };

    const handleToggleTag = async (tag: string) => {
        if (!tag) return; // Evita agregar vacío

        try {
            // Si el tag ya existe, solo lo selecciona o deselecciona
            const existing = tags.find((t) => t.nombre === tag);
            if (existing) {
                setSelectedTags((prev) =>
                    prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                );
                setNewTag("");
                return;
            }

            // Si el tag no existe, lo crea
            const created = await createTags([{ nombre: tag }]);

            if (created && created.length > 0) {
                // Refrescamos las etiquetas desde el backend
                const updatedTags = await getTags();
                setTags(updatedTags || []);

                // Agregamos la nueva etiqueta a las seleccionadas
                setSelectedTags((prev) => [...prev, tag]);
            }

            setNewTag("");
        } catch (error) {
            console.error("Error al crear etiqueta:", error);
            alert("Hubo un problema al crear la etiqueta");
        }
    };




    // CREAR NUEVO POST
    const handleSubmit = async () => {
        if (!description.trim()) {
        alert("La descripción es obligatoria");
        return;
        }

        if (!loggedUser) {
        alert("Debés iniciar sesión para publicar");
        return;
        }

        try {
        const validUrls = imageUrls.filter((url) => url.trim() !== "");
        const imageObjects = validUrls.map((url) => ({ url }));
        const createdImages =
            validUrls.length > 0 ? await createImage(imageObjects) : [];

        const existingTags = await getTags();
        const tagsToCreate = selectedTags.filter(
            (tag) => !existingTags.some((t) => t.nombre === tag)
        );

        let createdTags = [];
        if (tagsToCreate.length > 0) {
            createdTags = await createTags(tagsToCreate.map((nombre) => ({ nombre })));
        }

        const allTags = [
            ...existingTags.filter((t) => selectedTags.includes(t.nombre)),
            ...createdTags,
        ];

        const newPostData = {
            texto: description,
            user: loggedUser,
            tags: allTags.map((tag) => tag._id),
            images: createdImages.map((img: { _id: string }) => img._id),
        };

        await newPost(newPostData);
        alert("¡Publicación creada con éxito!");

        setDescription("");
        setImageUrls([""]);
        setSelectedTags([]);
        setShowModal(false);

        const updatedPosts = await getPosts();
        setPosts(updatedPosts || []);
        } catch (error: unknown) {
            // Obtener un mensaje seguro dependiendo del tipo de error
            let detalle = "Error desconocido";
            if (error instanceof Error) {
                detalle = error.message;
            } else if (typeof error === "object" && error !== null) {
                try {
                const maybeResp = (error as { response?: { data?: unknown } }).response?.data;
                detalle = maybeResp ? JSON.stringify(maybeResp) : JSON.stringify(error);
                } catch {
                detalle = String(error);
                }
            } else {
                detalle = String(error);
            }

            console.error("Error al crear el post:", detalle);
            alert("Error al publicar el post");
        }
    };

    // CONTROL DEL CARRUSEL
        const handlePrev = (postId: number, total: number) => {
        setCurrentImageIndex(prev => {
            const current = prev[postId] ?? 0;
            return { ...prev, [postId]: (current - 1 + total) % total };
        });
        };

        const handleNext = (postId: number, total: number) => {
        setCurrentImageIndex(prev => {
            const current = prev[postId] ?? 0;
            return { ...prev, [postId]: (current + 1) % total };
        });
        };

    // FILTRO POR TAG
    const filteredPosts = activeTag
        ? posts.filter((p) => p.tags?.some((t) => t.nombre === activeTag))
        : posts;

    // LOADING
    if (loading) {
        return (
        <>
            <Header />
            <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="card p-4 text-center opacity-50" style={{ maxWidth: "700px", width: "90%", height: "100rem" }}>
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                <p className="fs-5 text-muted mb-0">Cargando..</p>
            </div>
            </div>
        </>
        );
    }

  // RENDER PRINCIPAL
    return (
        <>
        <Header />
        <main className="pb-5">

        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <div
                className="card shadow p-4 w-100"
                style={{ maxWidth: "700px", width: "90%" }}
            >
                <h4 className="card-title mb-3 text-center">
                ¿Qué estás pensando? ¡Compartilo ahora!
                </h4>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <div
                        role="button"
                        className="form-control p-3 rounded-5 w-100 text-muted"
                        style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        textAlign: "left",
                        }}
                        onClick={() => {
                        if (!loggedUser) {
                            alert("Iniciá sesión para publicar");
                            return;
                        }
                        setShowModal(true);
                        }}
                    >
                        Escribí lo que quieras compartir...
                    </div>
                </div>
            </div>
        </div>

    

            {featuredPosts.length > 0 && (
            <section className="container mt-4">
                <h5 className="text-center text-primary mb-3">✨ Publicaciones destacadas</h5>
                <div className="row justify-content-center">
                {featuredPosts.map((post) => (
                    <div key={post._id} className="col-md-4 mb-3">
                    <div className="card shadow-sm h-100">
                        {post.images?.[0] && (
                        <img
                            src={post.images[0].url}
                            className="card-img-top"
                            alt="destacada"
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        )}
                        <div className="card-body">
                        <h6 className="card-title text-secondary">{post.user?.nickname ?? "Usuario eliminado"}</h6>
                        <p className="card-text small">{post.texto.slice(0, 100)}...</p>
                        <Link to={`/post/${post._id}`} className="btn btn-outline-primary btn-sm">
                            Ver más
                        </Link>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            <section className="container mt-4">
            <div className="text-center mb-3">
                <button
                className={`btn btn-sm me-2 ${!activeTag ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setActiveTag(null)}
                >
                Todos
                </button>
                {tags.map((tag) => (
                <button
                    key={tag.nombre}
                    className={`btn btn-sm m-1 ${activeTag === tag.nombre ? "btn-primary text-white" : "btn-outline-primary"}`}
                    onClick={() => setActiveTag(tag.nombre)}
                    >
                    #{tag.nombre}
                </button>
                ))}
            </div>
            </section>

            <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <div className="w-100" style={{ maxWidth: "700px", width: "90%" }}>
                {filteredPosts.length === 0 ? (
                <div className="card shadow p-4 text-center">
                    <img src={noPosts} alt="noPostsImg" className="img-fluid mb-3" style={{ maxHeight: "250px", objectFit: "contain" }} />
                    <p className="fs-5 text-muted mb-0">No hay publicaciones con ese filtro.</p>
                </div>
                ) : (
                filteredPosts.map((post) => {
                    const totalImages = post.images?.length || 0;
                    const currentIndex = currentImageIndex[post._id] || 0;

                    return (
                    <div key={post._id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                        <p className="fs-5 border-bottom p-2">
                            {post.user?.nickname ?? "Usuario eliminado"}:
                        </p>
                        <p className="text-left p-2">{post.texto}</p>

                        {totalImages > 0 && (
                            <div
                            className="position-relative d-flex justify-content-center align-items-center bg-light rounded-4 overflow-hidden mb-2"
                            style={{ width: "100%", height: "400px", maxHeight: "60vh" }}
                            >
                            {post.images?.[currentIndex] && (
                                <img
                                src={post.images[currentIndex].url}
                                alt={`imagen ${currentIndex + 1}`}
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: "cover", transition: "opacity 0.3s ease-in-out" }}
                                />
                            )}

                            {totalImages > 1 && (
                                <>
                                <button
                                    onClick={() => handlePrev(post._id, totalImages)}
                                    className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow"
                                    style={{ opacity: 0.8, width: "40px", height: "40px" }}
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={() => handleNext(post._id, totalImages)}
                                    className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow"
                                    style={{ opacity: 0.8, width: "40px", height: "40px" }}
                                >
                                    ❯
                                </button>
                                </>
                            )}
                            </div>
                        )}

                        {post.tags &&
                            post.tags.map((tag, index) => (
                            <span key={index} className="badge bg-secondary me-1 my-2">
                                #{tag.nombre}
                            </span>
                            ))}

                        <div className="my-2 border-top pt-2">
                            <div className="d-flex justify-content-start align-items-center">
                            <p className="mb-0 opacity-50">
                                Comentarios: {post.comments?.length ?? 0}
                            </p>
                            <div className="mx-2 opacity-50">|</div>
                            <Link
                                className="link-secondary link-offset-2 link-opacity-50-hover"
                                style={{ textDecoration: "none" }}
                                to={`/post/${post._id}`}
                            >
                                Ver más
                            </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })
                )}
            </div>
            </div>
            
            {/* nuevo post */}

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
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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
                    <button className="btn btn-outline-info rounded-5 m-1" onClick={handleAddImageField}>
                        <i className="bi bi-images"></i> + imágenes
                    </button>

                    <div className="mt-3">
                        <p className="fw-semibold text-center mb-2">Seleccioná etiquetas:</p>
                        <div className="d-flex flex-wrap justify-content-center">
                        {tags.map((tag: Tag) => (
                            <button
                            key={tag.nombre}
                            type="button"
                            className={`btn btn-sm m-1 ${
                                selectedTags.includes(tag.nombre)
                                ? "btn-info text-white"
                                : "btn-outline-info"
                            }`}
                            onClick={() => handleToggleTag(tag.nombre)}
                            >
                            #{tag.nombre}
                            </button>
                        ))}
                        </div>

                        <p className="fw-semibold text-center my-2 mb-2">Crea etiquetas:</p>

                    <div className="d-flex justify-content-center align-items-center my-2">
                        <div className="input-group my-3" style={{ maxWidth: "400px" }}>
                            <span className="input-group-text" id="basic-addon1">#</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Escribe un tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                aria-label="tag"
                                aria-describedby="basic-addon1"
                            />
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={() => handleToggleTag(newTag.trim())}
                            >
                                Crear tag
                            </button>
                        </div>
                    </div>

                    </div>
                    </div>

                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
        </main>
        <Footer />
        </>
    );
}

export default HomePage;
