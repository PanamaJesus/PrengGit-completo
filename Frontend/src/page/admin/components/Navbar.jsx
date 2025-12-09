// NavbarE.jsx
import React, { useState } from "react";
import axios from "axios";
import { ChevronDown, CheckCircle } from "lucide-react";

function NavbarE() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id : null;

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    ap_pat: user?.ap_pat || "",
    ap_mat: user?.ap_mat || "",
    correo: user?.correo || "",
  });

  const openModal = () => {
    setEditMode(false);
    setShowUserMenu(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        nombre: formData.nombre,
        ap_pat: formData.ap_pat,
        ap_mat: formData.ap_mat,
        correo: formData.correo,
        semana_embarazo: null,
      };

      await axios.put(`http://127.0.0.1:8000/api/usuario/${userId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const updatedUser = { ...user, ...payload };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      setEditMode(false);
      setShowModal(false);

      // Mostrar toast elegante
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar");
    }
  };

  return (
    <>
      <nav className="w-full shadow-md p-4 flex items-center justify-between bg-white">
        <div></div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg transition"
            style={{ backgroundColor: "#FFECCC" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)",
              }}
            >
              {user ? user.nombre?.charAt(0) : "?"}
            </div>

            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold" style={{ color: "#722323" }}>
                {user ? user.nombre : "Cargando..."}
              </p>
              <p className="text-xs" style={{ color: "#BA487F" }}>
                {user?.rol === 1 ? "Administrador" : "Usuario"}
              </p>
            </div>

            <ChevronDown size={18} style={{ color: "#BA487F" }} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-3 w-40">
              <button
                onClick={openModal}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                Ver Info
              </button>

            </div>
          )}
        </div>

        {/* --------------------
              MODAL
        --------------------- */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "#722323" }}
              >
                Información del usuario
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  name="nombre"
                  disabled={!editMode}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="w-full p-2 border rounded"
                />

                <input
                  type="text"
                  name="ap_pat"
                  disabled={!editMode}
                  value={formData.ap_pat}
                  onChange={handleChange}
                  placeholder="Apellido Paterno"
                  className="w-full p-2 border rounded"
                />

                <input
                  type="text"
                  name="ap_mat"
                  disabled={!editMode}
                  value={formData.ap_mat}
                  onChange={handleChange}
                  placeholder="Apellido Materno"
                  className="w-full p-2 border rounded"
                />

                <input
                  type="email"
                  name="correo"
                  disabled={!editMode}
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-between mt-5">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: "#BA487F" }}
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: "#722323" }}
                  >
                    Guardar
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ------------------------
            TOAST BONITO
      ------------------------ */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-white shadow-xl p-4 rounded-xl flex items-center gap-3 border-l-4 border-green-600 animate-fadeIn z-50">
          <CheckCircle className="text-green-600" size={28} />
          <p className="text-green-700 font-semibold">
            ¡Datos actualizados correctamente!
          </p>
        </div>
      )}

      {/* ANIMACIÓN */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
}

export default NavbarE;
