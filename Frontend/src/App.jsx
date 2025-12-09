import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home/Home";
import IdxEmb from "./page/embarazadas/indexemb";
import IndexAdmin2 from "./page/admin/indexadmin2"; // ← Cambio aquí
import './index.css'
import IndexEstadisticas from "./page/embarazadas/estadisticas/IndexEstadisticas.jsx";
import IndexRutinas from "./page/embarazadas/rutinas/IndexRutinas.jsx";
import Ejercicios from "./page/embarazadas/Ejercicios.jsx";
import Profile from "./page/embarazadas/perfil.jsx";
import UpdateProfile from "./page/embarazadas/UpdateProfile.jsx";
import AllEjercicios from "./page/embarazadas/AllEjercicios.jsx";
import TiposContenido from "./page/Contenido/TiposContenido.jsx";
import ContenidoPorTema from "./page/Contenido/ContenidoPorTema.jsx";
import './App.css'
import './index.css' // <== IMPORTANTE
import IdxLogin from "./page/login/IdxLogin";
import './App.css';
import './index.css';
import DetallesRutina from "./page/embarazadas/rutinas/DetallesRutina.jsx";
import CrearRutinas from "./page/embarazadas/rutinas/CrearRutinas.jsx";
import AdministrarRutinas from "./page/embarazadas/rutinas/AdministrarRutinas.jsx";
import EditarRutinas from "./page/embarazadas/rutinas/EditarRutinas.jsx";

const PublicRoute = ({ children }) => {
  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;

  // Si está logueado, lo mandamos a su pantalla según rol
  if (user) {
    if (user.rol === 1) return <Navigate to="/admin" replace />;
    if (user.rol === 2) return <Navigate to="/IdxEmb" replace />;
  }

  return children;
};

const PrivateRoute = ({ children, role }) => {
  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("accessToken");

  // ⚠️ Flag que marcamos en login
  const adminLogged = localStorage.getItem("adminLoggedIn") === "true";

  // Si es admin y ya inició sesión, NO lo volvemos a validar
  if (role === 1 && adminLogged) {
    return children; // ✔ ya no lo sacamos NUNCA
  }

  // Validación normal (para usuarios rol 2)
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (role && Number(user.rol) !== Number(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};


// lo cambie porque me daba error en una cosa para el perfil

// const PrivateRoute = ({ children, rol }) => {
//   const userString = localStorage.getItem("usuario");
//   const user = userString ? JSON.parse(userString) : null;
//   const token = localStorage.getItem("accessToken");

//   console.log("Usuario en PrivateRoute:", user);
//   console.log("user.role:", user ? user.rol : "No user");

//   if (!user || !token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (rol && Number(user.rol) !== Number(rol)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

function App() {
  return (
    <Router>
      <Routes>
        
        {/*Página principal */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />

        {/*Login y Registro */}
        <Route path="/login" element={<PublicRoute><IdxLogin /></PublicRoute>} />

        {/* ✅ Ruta protegida solo para admins - Ahora usa indexadmin2.jsx */}
        {/* Ruta protegida solo para admins */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role={1}>
              <IndexAdmin2 />
            </PrivateRoute>
          }
        />


        <Route path="/IdxAdmin" element={<IndexAdmin2/>} />
        <Route path="/IdxEmb" element={<PrivateRoute role={2}><IdxEmb /></PrivateRoute>} />
        <Route path="/Estadisticas" element={<PrivateRoute role={2}><IndexEstadisticas /></PrivateRoute>} />
        <Route path="/Rutinas" element={<PrivateRoute role={2}><IndexRutinas /></PrivateRoute>} />
        
        {/* Agregadas x chela */}
        <Route path="/TiposContenido" element={<PrivateRoute rol={2}><TiposContenido /></PrivateRoute>} />
        <Route path="/contenido/tema/:temaId" element={<ContenidoPorTema  />} />
        
        <Route path="/Ejercicios" element={<PrivateRoute role={2}><Ejercicios /></PrivateRoute>} />
        <Route path="/Profile" element={<PrivateRoute role={2}><Profile /></PrivateRoute>} />
        <Route path="/UpdProfile" element={<PrivateRoute role={2}><UpdateProfile  /></PrivateRoute>} />
        <Route path="/AllEjercicios" element={<PrivateRoute role={2}><AllEjercicios /></PrivateRoute>} />
        <Route path="/Estadisticas" element={<PrivateRoute rol={2}><IndexEstadisticas /></PrivateRoute>} />
        <Route path="/Rutinas" element={<PrivateRoute rol={2}><IndexRutinas /></PrivateRoute>} />
        <Route path="/Rutina/:slug" element={<PrivateRoute rol={2}><DetallesRutina /></PrivateRoute>}/>
        <Route path="/Crear-rutina" element={<PrivateRoute rol={2}><CrearRutinas /></PrivateRoute>} />
        <Route path="/Administrar-rutinas" element={<PrivateRoute rol={2}><AdministrarRutinas /></PrivateRoute>} />
        <Route path="/Editar-Rutina/:slug" element={<PrivateRoute rol={2}><EditarRutinas /></PrivateRoute>} />


        


      </Routes>
    </Router>
  );
}

export default App;