import Header from "../components/Header";

function HomePage() {

    return (
        <>
        <Header  />
            <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: "500px", width: "90%" }}>
                <div className="card-body text-center">
                <h1 className="card-title mb-3 text-primary">UnaHur Anti-Social Net</h1>
                <p className="card-text text-muted mb-4">
                    Bienvenido a la página principal de la red anti-social más exclusiva.
                </p>
                </div>
            </div>
            </div>  
        </>
    );
}

export default HomePage;


