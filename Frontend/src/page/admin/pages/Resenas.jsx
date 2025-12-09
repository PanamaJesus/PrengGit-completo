import React, { useState, useEffect } from 'react';
import { Trash2, Search, X } from 'lucide-react';

const Resenas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resenas, setResenas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);

  // Modal eliminar
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Cargar datos
  const fetchTodo = async () => {
    try {
      const r = await fetch("http://127.0.0.1:8000/api/resena/");
      const u = await fetch("http://127.0.0.1:8000/api/usuario/");
      const e = await fetch("http://127.0.0.1:8000/api/ejercicio/");

      setResenas(await r.json());
      setUsuarios(await u.json());
      setEjercicios(await e.json());
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  // obtener nombre
  const getUsuarioNombre = (id) => {
    const u = usuarios.find((x) => x.id === id);
    return u ? u.username || u.nombre || `Usuario #${id}` : `Usuario #${id}`;
  };

  const getEjercicioNombre = (id) => {
    const e = ejercicios.find((x) => x.id === id);
    return e ? e.nombre || `Ejercicio #${id}` : `Ejercicio #${id}`;
  };

  // Confirmar delete y abrir modal
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalDelete(true);
  };

  // eliminar reseña
  const eliminarResena = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/resena/${selectedId}/`, {
        method: "DELETE"
      });

      setModalDelete(false);
      fetchTodo();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  // Filtrar reseñas
  const filteredResenas = resenas.filter(resena =>
    resena.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // formatear fecha
  const formatFecha = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: '#FFFFFF' }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#722323' }}>
              Gestión de Reseñas
            </h1>
            <p style={{ color: '#BA487F' }}>
              Administra las reseñas creadas por los usuarios
            </p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" 
            style={{ color: '#BA487F' }} size={20} 
          />
          <input
            type="text"
            placeholder="Buscar reseñas por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ 
              borderColor: '#FFECCC',
              '--tw-ring-color': '#BA487F'
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-xl shadow-md border-2" style={{ borderColor: '#BA487F' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#FFECCC' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>Descripción</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>Ejercicio</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredResenas.map(resena => (
                  <tr key={resena.id}
                    className="border-b transition-colors"
                    style={{ borderBottomColor: '#FFECCC' }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        #{resena.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#722323' }}>
                        {resena.descripcion}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: '#722323' }}>
                        {formatFecha(resena.fecha)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        {getUsuarioNombre(resena.usuario)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        {getEjercicioNombre(resena.ejercicio_id)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-lg"
                          style={{ color: '#FF9587' }}
                          onClick={() => openDeleteModal(resena.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t-2" style={{ borderTopColor: '#FFECCC', backgroundColor: '#FFECC0' }}>
            <p className="text-sm" style={{ color: '#722323' }}>
              Mostrando <span className="font-semibold">{filteredResenas.length}</span> de <span className="font-semibold">{resenas.length}</span> reseñas
            </p>
          </div>
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border-2 relative"
            style={{ borderColor: "#BA487F" }}
          >
            <button className="absolute top-4 right-4" onClick={() => setModalDelete(false)}>
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-3" style={{ color: "#722323" }}>
              ¿Eliminar reseña?
            </h2>

            <p className="mb-6">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg"
                onClick={() => setModalDelete(false)}
                style={{ backgroundColor: "#FFECCC" }}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 text-white rounded-lg"
                onClick={eliminarResena}
                style={{
                  background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Resenas;
