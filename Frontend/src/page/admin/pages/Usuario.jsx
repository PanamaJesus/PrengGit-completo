// page/admin/pages/Usuario.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Search, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';


const Usuario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("activos"); // activos | inactivos | todos

  // Cargar usuarios reales
  const fetchUsuarios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/usuario/");
      const data = await res.json();

      const dataConEstado = data.map(u => ({
        ...u,
        activo: u.estado
      }));

      setUsuarios(dataConEstado);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Rol
  const getRolLabel = (rol) => {
    return rol === 1 ? 'Administrador' : 'Usuario';
  };

  const getRolStyle = (rol) => {
    return rol === 1 
      ? { backgroundColor: '#BA487F', color: '#FFFFFF', borderColor: '#722323' }
      : { backgroundColor: '#FFECCC', color: '#722323', borderColor: '#FFC29B' };
  };

  // 🔥 Función para actualizar en BD
  const actualizarEstadoBD = async (id, nuevoEstado) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/usuario/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      fetchUsuarios(); // Recargar tabla
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  // 🧁 Alerta bonita antes de desactivar/activar
  const confirmarCambioEstado = (usuario) => {
    
    Swal.fire({
      title: usuario.activo ? "¿Desactivar usuario?" : "¿Activar usuario?",
      text: usuario.activo 
        ? "El usuario ya no podrá acceder a su cuenta."
        : "El usuario podrá acceder nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: usuario.activo ? "Sí, desactivar" : "Sí, activar",
      cancelButtonText: "Cancelar",
      background: "#FFF7F9",
      color: "#722323",
      confirmButtonColor: "#BA487F",
      cancelButtonColor: "#FF9587",
      customClass: {
        popup: "rounded-2xl shadow-lg",
        confirmButton: "rounded-lg px-4 py-2",
        cancelButton: "rounded-lg px-4 py-2",
      }
    }).then((result) => {

      if (result.isConfirmed) {
        const nuevoEstado = !usuario.activo;

        actualizarEstadoBD(usuario.id, nuevoEstado);

        Swal.fire({
          title: "Listo",
          text: usuario.activo 
            ? "Usuario desactivado correctamente."
            : "Usuario activado correctamente.",
          icon: "success",
          background: "#FFF7F9",
          color: "#722323",
          confirmButtonColor: "#BA487F",
          customClass: {
            popup: "rounded-2xl shadow-lg",
          }
        });
      }
    });
  };

  // FILTRO
  const usuariosFiltradosPorEstado = usuarios.filter(u => {
    if (filtroEstado === "activos") return u.activo === true;
    if (filtroEstado === "inactivos") return u.activo === false;
    return true;
  });

  // BÚSQUEDA
  const filteredUsuarios = usuariosFiltradosPorEstado.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ap_pat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: '#FFFFFF' }}>
      
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#722323' }}>
              Gestión de Usuarios
            </h1>
            <p style={{ color: '#BA487F' }}>Administra los usuarios del sistema</p>
          </div>
        </div>

        {/* Filtros + Busqueda */}
        <div className="flex flex-col md:flex-row gap-4 items-center">

          {/* Select */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 rounded-lg border-2"
            style={{
              borderColor: '#FFECCC',
              color: '#722323'
            }}
            onFocus={(e) => e.target.style.borderColor = '#BA487F'}
            onBlur={(e) => e.target.style.borderColor = '#FFECCC'}
          >
            <option value="activos">Usuarios Activos</option>
            <option value="inactivos">Usuarios Desactivados</option>
            <option value="todos">Todos</option>
          </select>

          {/* Buscador */}
          <div className="relative max-w-md w-full">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: '#BA487F' }} 
              size={20} 
            />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ 
                borderColor: '#FFECCC',
                '--tw-ring-color': '#BA487F'
              }}
              onFocus={(e) => e.target.style.borderColor = '#BA487F'}
              onBlur={(e) => e.target.style.borderColor = '#FFECCC'}
            />
          </div>

        </div>
      </div>

      {/* TABLA */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-xl shadow-md border-2" style={{ borderColor: '#BA487F' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              
              <thead style={{ backgroundColor: '#FFECCC' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Apellido Paterno</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Apellido Materno</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Correo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Semana Embarazo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#722323' }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr 
                    key={usuario.id} 
                    className="border-b transition-colors" 
                    style={{ borderBottomColor: '#FFECCC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFECC0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        #{usuario.id}
                      </span>
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #FF9587 0%, #BA487F 100%)' }}
                        >
                          {usuario.nombre.charAt(0)}{usuario.ap_pat.charAt(0)}
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#722323' }}>
                          {usuario.nombre}
                        </span>
                      </div>
                    </td>

                    {/* Apellidos */}
                    <td className="px-6 py-4"><span className="text-sm" style={{ color: '#722323' }}>{usuario.ap_pat}</span></td>
                    <td className="px-6 py-4"><span className="text-sm" style={{ color: '#722323' }}>{usuario.ap_mat}</span></td>

                    {/* Correo */}
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#BA487F' }}>
                        {usuario.correo}
                      </span>
                    </td>

                    {/* Semana embarazo */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        {usuario.semana_embarazo} semanas
                      </span>
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold border"
                        style={getRolStyle(usuario.rol)}
                      >
                        {getRolLabel(usuario.rol)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: usuario.activo ? "#DFFFE1" : "#FFE0E0",
                          color: usuario.activo ? "#1F7A31" : "#A33131",
                          borderColor: usuario.activo ? "#A5E3B0" : "#FFB5B5"
                        }}
                      >
                        {usuario.activo ? "Activo" : "Desactivado"}
                      </span>
                    </td>

                    {/* Botón acciones */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => confirmarCambioEstado(usuario)}
                          className="p-2 rounded-lg"
                          style={{ color: usuario.activo ? '#FF9587' : '#1F7A31' }}
                        >
                          {usuario.activo ? (
                            <Trash2 size={18} />   // Icono rojo para DESACTIVAR
                          ) : (
                            <CheckCircle size={18} />  // Icono verde para ACTIVAR
                          )}
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Footer */}
          <div 
            className="px-6 py-4 border-t-2" 
            style={{ borderTopColor: '#FFECCC', backgroundColor: '#FFECC0' }}
          >
            <p className="text-sm" style={{ color: '#722323' }}>
              Mostrando <span className="font-semibold">{filteredUsuarios.length}</span> de{" "}
              <span className="font-semibold">{usuarios.length}</span> usuarios
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Usuario;
