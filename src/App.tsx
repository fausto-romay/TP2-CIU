import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import PostDetailed from "./pages/PostDetailed"
import ProtectorRuta from "./components/ProtectorRuta";

// Abria que pobrar algo para que HomePage solo sea accesible si hay un usuario logueado...
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/home"/>}></Route>
        <Route path="/home" element={
          <ProtectorRuta>
            <HomePage/>
          </ProtectorRuta>
          }
          />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetailed />} />
      </Routes>
    </Router>
  );
}

export default App;
