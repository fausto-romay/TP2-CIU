import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";
import "../styles/signupPage.css"

export default function SignupPage() {

  return (
    // 1. Contenedor principal para centrar *todo* el contenido de la página
    <div className="signup-page d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      
      {/* Contenedor de la vista de registro */}
      <div style={{ maxWidth: "350px", width: "90%" }}> 

        {/* Formulario */}
        {/* 2. d-flex y flex-column para los hijos, y align-items-center para centrarlos horizontalmente */}
        <div className="recuadro d-flex flex-column align-items-center shadow rounded-3 p-5 mb-3"> 
          <div className="text-center">
            <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "120px" }} />
          </div>
          <div className="text-center mb-3"> 
            <p className="fs-6 fw-semibold">Regístrate para ver fotos y videos de tus amigos.</p>
          </div>

          <form className="d-flex flex-column gap-2 w-100"> {/* 3. d-flex, flex-column y w-100 para que el formulario ocupe el ancho y los inputs se apilen */}
            <input className="p-2 border rounded-1" type="text" placeholder="Correo electrónico" required />
            <input className="p-2 border rounded-1" type="text" placeholder="Nombre de usuario" required />
            <button className="btn btn-primary btn-sm mt-2" type="button">Registrarte</button>
          </form>
        </div>

        {/* Enviar al login si tiene cuenta */}
        {/* 4. justify-content-center para centrar el párrafo que contiene el texto y el enlace */}
        <div className="recuadro d-flex justify-content-center align-items-center shadow rounded-3 p-3"> 
          <p className="mb-0">¿Tienes una cuenta?
            <Link to="/" className="ms-1 fw-semibold text-decoration-none">Entrar</Link>
          </p>
        </div>
      </div>

      <footer>
        ©2025 Todos los derechos reservados - Grupo 10 CIU-Unahur
      </footer>
    </div>
  )
}