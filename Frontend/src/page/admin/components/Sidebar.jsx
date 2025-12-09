// components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, FileText, Tag, Calendar, User, Star, Clock, Settings, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/admin/' },
    { name: 'Ejercicio', icon: Dumbbell, path: '/admin/ejercicio' },
    { name: 'Contenido', icon: FileText, path: '/admin/contenido' },
    { name: 'Tipo Tema', icon: Tag, path: '/admin/tipotema' },
    { name: 'Rutina', icon: Calendar, path: '/admin/rutina' },
    { name: 'Usuario', icon: User, path: '/admin/usuario' },
    { name: 'Reseña', icon: Star, path: '/admin/resena' },
    { name: 'Historial', icon: Clock, path: '/admin/historial' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // ✅ FUNCIÓN DE CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");

    navigate("/"); // volver al login

    // Limpia el estado completo
    window.location.reload();
  };

  return (
    <aside 
      className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-2xl`}
      style={{ background: 'linear-gradient(180deg, #722323 0%, #BA487F 100%)' }}
    >
      {/* Logo y Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white backdrop-blur-sm">
              A
            </div>
            <h1 className="text-xl font-bold text-white">Panel Admin</h1>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Menú de navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white ${
              location.pathname === item.path
                ? 'shadow-lg transform scale-105' 
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
            style={location.pathname === item.path ? { backgroundColor: '#FF9587' } : {}}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Footer con configuración y salir */}
      <div className="p-4 border-t border-white/10 space-y-2">

        {/* 🔥 AQUI LA ACCIÓN DEL LOGOUT */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/50 transition-colors text-[#FFECCC]"
        >
          <LogOut size={20} />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
