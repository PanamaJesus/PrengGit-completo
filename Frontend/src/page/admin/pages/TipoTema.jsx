// page/admin/pages/TipoTema.jsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tipotema/";

const TipoTema = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tiposTema, setTiposTema] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [alert, setAlert] = useState(null); // success / error / confirm
  const [confirmCallback, setConfirmCallback] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: ""
  });

  // ===============================
  // Helpers: Alerts personalizados
  // ===============================

  const alertSuccess = (msg) => {
    setAlert({ type: "success", message: msg });
    setTimeout(() => setAlert(null), 2000);
  };

  const alertError = (msg) => {
    setAlert({ type: "error", message: msg });
    setTimeout(() => setAlert(null), 2500);
  };

  const alertConfirm = (msg, onConfirm) => {
    setAlert({ type: "confirm", message: msg });
    setConfirmCallback(() => onConfirm);
  };

  // ======================
  // Cargar datos del API
  // ======================
  const fetchTiposTema = async () => {
    try {
      const res = await axios.get(API_URL);
      setTiposTema(res.data);
    } catch {
      alertError("Error cargando datos");
    }
  };

  useEffect(() => {
    fetchTiposTema();
  }, []);

  // ======================
  // Abrir modal (nuevo)
  // ======================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ nombre: "", descripcion: "" });
    setModalOpen(true);
  };

  // ======================
  // Abrir modal (editar)
  // ======================
  const openEditModal = (tema) => {
    setEditingId(tema.id);
    setFormData({
      nombre: tema.nombre,
      descripcion: tema.descripcion
    });
    setModalOpen(true);
  };

  // ======================
  // Guardar (create/update)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, formData);
        alertSuccess("Tipo de tema actualizado correctamente");
      } else {
        await axios.post(API_URL, formData);
        alertSuccess("Tipo de tema creado correctamente");
      }

      fetchTiposTema();
      setModalOpen(false);
    } catch {
      alertError("Error guardando la información");
    }
  };

  // ======================
  // Eliminar
  // ======================
  const handleDelete = async (id) => {
    alertConfirm("¿Seguro que deseas eliminar este tipo de tema?", async () => {
      try {
        await axios.delete(`${API_URL}${id}/`);
        alertSuccess("Eliminado correctamente");
        fetchTiposTema();
      } catch {
        alertError("Error eliminando el registro");
      }
    });
  };

  const filteredTiposTema = tiposTema.filter((tema) =>
    tema.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tema.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: '#FFFFFF' }}>

      {/* ===================== ALERT CUSTOM ===================== */}
      {alert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">
          
          {/* SUCCESS */}
          {alert.type === "success" && (
            <div className="bg-white border-2 rounded-xl p-6 shadow-xl text-center"
              style={{ borderColor: "#BA487F" }}>
              <h2 className="text-xl font-bold" style={{ color: "#722323" }}>
                ¡Éxito!
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#722323" }}>{alert.message}</p>
            </div>
          )}

          {/* ERROR */}
          {alert.type === "error" && (
            <div className="bg-white border-2 rounded-xl p-6 shadow-xl text-center"
              style={{ borderColor: "#FF8585" }}>
              <h2 className="text-xl font-bold" style={{ color: "#722323" }}>
                Error
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#722323" }}>{alert.message}</p>
            </div>
          )}

          {/* CONFIRM */}
          {alert.type === "confirm" && (
            <div className="bg-white border-2 rounded-xl p-6 shadow-xl max-w-sm w-full text-center"
              style={{ borderColor: "#BA487F" }}>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#722323" }}>
                Confirmación
              </h2>
              <p className="mb-6 text-sm" style={{ color: "#722323" }}>
                {alert.message}
              </p>

              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "#FFECCC", color: "#722323" }}
                  onClick={() => setAlert(null)}
                >
                  Cancelar
                </button>

                <button
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)" }}
                  onClick={() => {
                    setAlert(null);
                    confirmCallback && confirmCallback();
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ===================== HEADER ===================== */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#722323' }}>
              Gestión de Tipos de Tema
            </h1>
            <p style={{ color: '#BA487F' }}>
              Administra las categorías de contenido del sistema
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:shadow-lg font-medium transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #722323 0%, #BA487F 100%)' }}
          >
            <Plus size={20} />
            Nuevo Tipo de Tema
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: '#BA487F' }} size={20} />

          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#FFECCC', '--tw-ring-color': '#BA487F' }}
          />
        </div>
      </div>

      {/* ===================== TABLA ===================== */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-xl shadow-md border-2"
          style={{ borderColor: '#BA487F' }}>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#FFECCC' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: '#722323' }}>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTiposTema.map((tema) => (
                  <tr key={tema.id}
                    className="border-b"
                    style={{ borderBottomColor: '#FFECCC' }}>

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: '#722323' }}>
                        #{tema.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: 'linear-gradient(135deg, #FF9587 0%, #BA487F 100%)' }}>
                          {tema.nombre.charAt(0)}
                        </div>

                        <span className="text-sm font-medium" style={{ color: '#722323' }}>
                          {tema.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#722323' }}>
                        {tema.descripcion}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        <button
                          className="p-2 rounded-lg"
                          style={{ color: '#BA487F' }}
                          onClick={() => openEditModal(tema)}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          className="p-2 rounded-lg"
                          style={{ color: '#FF9587' }}
                          onClick={() => handleDelete(tema.id)}
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

          <div className="px-6 py-4 border-t-2"
            style={{ borderTopColor: '#FFECCC', backgroundColor: '#FFECC0' }}>
            <p className="text-sm" style={{ color: '#722323' }}>
              Mostrando {filteredTiposTema.length} de {tiposTema.length} tipos de tema
            </p>
          </div>

        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border-2"
            style={{ borderColor: "#BA487F" }}>

            <h2 className="text-xl font-bold mb-4" style={{ color: "#722323" }}>
              {editingId ? "Editar Tipo de Tema" : "Nuevo Tipo de Tema"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="border p-2 rounded"
              />

              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                className="border p-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "#FFECCC", color: "#722323" }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #722323 0%, #BA487F 100%)' }}
                >
                  Guardar
                </button>

              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default TipoTema;
