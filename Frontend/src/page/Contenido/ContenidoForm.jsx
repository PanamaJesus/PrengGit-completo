import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function ContenidoForm({ isOpen, onClose, onSaved, editData }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [urls_img, setUrlsImg] = useState("");
  const [tema, setTema] = useState("");
  const [tiposTema, setTiposTema] = useState([]);

  useEffect(() => {
    // Traer tipos de tema
    api.get("/tipotema/").then((res) => setTiposTema(res.data));
  }, []);

  useEffect(() => {
    // Si hay editData, llenar campos
    if (editData) {
      setTitulo(editData.titulo);
      setTexto(editData.texto);
      setUrlsImg(editData.urls_img);
      setTema(editData.tema);
    } else {
      setTitulo("");
      setTexto("");
      setUrlsImg("");
      setTema("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !texto || !tema || !urls_img) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      if (editData) {
        await api.put(`/contenido/${editData.id}/`, {
          titulo,
          texto,
          urls_img,
          tema,
        });
        toast.success("Contenido actualizado con éxito");
      } else {
        await api.post("/contenido/", {
          titulo,
          texto,
          urls_img,
          tema,
        });
        toast.success("Contenido creado con éxito");
      }
      onSaved(); // refrescar lista
      onClose();
    } catch (error) {
      toast.error("Error al guardar contenido");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Editar Contenido" : "Crear Contenido"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="URL del sitio"
            value={urls_img}
            onChange={(e) => setUrlsImg(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecciona un tipo de tema</option>
            {tiposTema.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
              {editData ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContenidoForm;
