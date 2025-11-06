import "../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <h2 className="footer-logo">Unahur Anti-Social Net</h2>
                <ul className="footer-links">
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Explorar</a></li>
                <li><a href="#">Soporte</a></li>
                <li><a href="#">Contacto</a></li>
                </ul>
                <p className="footer-copy">
                © 2025 Anti-Social — Grupo 10 CIU/Unahur
                </p>
            </div>
        </div>
        </footer>
    );
}
