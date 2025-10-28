import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getPosts } from "../services/postsService";
import type { Post } from "../services/postsService"

function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error("Error al traer los posts:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Cargando posts...</p>;

    return (
        <>
        <Header  />

            <div className="d-flex flex-column justify-content-center align-items-center"> {/* crear publicaciones */}
                <div className="cardshadow p-4" style={{ maxWidth: "500px", width: "90%" }}>
                    <h4 className="card-title">¿Que estás pensando? ¡Compartilo ahora!</h4>
                    <button className="btn btn-dark">Crear una publicación</button>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
                <div className="p-4" style={{ maxWidth: "500px", width: "90%" }}>
                {posts.map((post) => (
                    <>
                        <div className="card" key={post.id}>
                            <div className="card-body">
                                <p>{post.texto}</p>
                                {post.images?.map( i => i)}
                                {post.tags?.map( t => <p>{t}</p>)}
                            </div>
                        </div>
                        <div className="p-2"></div>
                    </>
                ))}
                </div>
            </div>

        </>
    );
}

export default HomePage;


