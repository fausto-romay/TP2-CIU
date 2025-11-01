import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";

import App from './App'
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
        <App/>
    </UserProvider>
  </StrictMode>,
)
