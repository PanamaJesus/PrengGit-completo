import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ContenidoForm from "./ContenidoForm";

function ContenidoList() {
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTema, setSelectedTema] = useState("");
  const [tiposTema, setTiposTema] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchContenidos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contenido/");
      setContenidos(res.data);
    } catch (error) {
      toast.error("Error al cargar contenidos");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContenidos();
    api.get("/tipotema/").then((res) => setTiposTema(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este contenido?")) return;
    try {
      await api.delete(`/contenido/${id}/`);
      toast.success("Contenido eliminado con éxito");
      fetchContenidos();
    } catch (error) {
      toast.error("Error al eliminar contenido");
      console.error(error);
    }
  };

  const filtered = contenidos.filter(
    (c) =>
      c.titulo.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTema ? c.tema === Number(selectedTema) : true)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Contenido Educativo</h1>

      {/* Buscador y filtro */}
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Buscar por título"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={selectedTema}
          onChange={(e) => setSelectedTema(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los temas</option>
          {tiposTema.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear contenido
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Título</th>
              <th className="border p-2 text-left">Tipo de tema</th>
              <th className="border p-2 text-left">URL</th>
              <th className="border p-2 text-left">Texto breve</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.titulo}</td>
                <td className="border p-2">
                  {tiposTema.find((t) => t.id === c.tema)?.nombre || "-"}
                </td>
                <td className="border p-2 text-blue-600">
                  <a href={c.urls_img} target="_blank" rel="noopener noreferrer">
                    Ver sitio
                  </a>
                </td>
                <td className="border p-2">{c.texto}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditData(c);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
                  >
                    Eliminar
                  </button>
                  <a
                    href={c.urls_img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-white"
                  >
                    Ver más
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      <ContenidoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchContenidos}
        editData={editData}
      />
    </div>
  );
}

export default ContenidoList;
