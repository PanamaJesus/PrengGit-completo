// page/admin/pages/Contenido.jsx
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, X } from "lucide-react";

const Contenido = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contenidos, setContenidos] = useState([]);

  // Modales
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // ID para eliminar
  const [selectedId, setSelectedId] = useState(null);

  // Datos creación
  const emptyForm = { titulo: "", texto: "", urls_img: "", tema: 1 };
  const [formData, setFormData] = useState(emptyForm);

  // Datos edición
  const [editData, setEditData] = useState(emptyForm);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/contenido/")
      .then((res) => res.json())
      .then((data) => setContenidos(data))
      .catch((err) => console.error("Error cargando contenidos:", err));
  }, []);

  const getTemaLabel = (tema) => {
    const temas = {
      1: "Nutrición",
      2: "Ejercicio",
      3: "Parto",
      4: "Relajación",
      5: "Postparto",
    };
    return temas[tema] || `Tema ${tema}`;
  };

  const getTemaStyle = (tema) => {
    const styles = {
      1: { backgroundColor: "#FFECCC", color: "#722323", borderColor: "#FFC29B" },
      2: { backgroundColor: "#FFC29B", color: "#722323", borderColor: "#F39F9F" },
      3: { backgroundColor: "#F39F9F", color: "#722323", borderColor: "#B95E82" },
      4: { backgroundColor: "#BA487F", color: "#FFFFFF", borderColor: "#722323" },
      5: { backgroundColor: "#FF9587", color: "#722323", borderColor: "#BA487F" },
    };
    return styles[tema] || styles[1];
  };

  const filteredContenidos = contenidos.filter(
    (contenido) =>
      contenido.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contenido.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Crear contenido
  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/contenido/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setContenidos([...contenidos, newItem]);
        setModalCreate(false);
        setFormData(emptyForm); // limpiar después de agregar
      })
      .catch((err) => console.error("Error creando contenido:", err));
  };

  // Abrir modal editar + cargar datos
  const openEditModal = (item) => {
    setEditData({
      titulo: item.titulo,
      texto: item.texto,
      urls_img: item.urls_img,
      tema: item.tema,
      id: item.id,
    });
    setModalEdit(true);
  };

  // Guardar edición
  const handleEdit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/contenido/${editData.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setContenidos(
          contenidos.map((c) => (c.id === updatedItem.id ? updatedItem : c))
        );
        setModalEdit(false);
      })
      .catch((err) => console.error("Error actualizando contenido:", err));
  };

  // Eliminar
  const deleteContent = () => {
    fetch(`http://127.0.0.1:8000/api/contenido/${selectedId}/`, {
      method: "DELETE",
    })
      .then(() => {
        setContenidos(contenidos.filter((c) => c.id !== selectedId));
        setModalDelete(false);
      })
      .catch((err) => console.error("Error eliminando contenido:", err));
  };

  return (
    <div className="p-0 m-0 min-h-full w-full" style={{ backgroundColor: "#FFFFFF" }}>

      {/* HEADER */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#722323" }}>
              Gestión de Contenidos
            </h1>
            <p style={{ color: "#BA487F" }}>
              Administra los contenidos educativos del sistema
            </p>
          </div>

          <button
            onClick={() => {
              setFormData(emptyForm);
              setModalCreate(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all font-medium hover:shadow-lg transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)" }}
          >
            <Plus size={20} />
            Nuevo Contenido
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: "#BA487F" }}
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar por título o texto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: "#FFECCC", "--tw-ring-color": "#BA487F" }}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-xl shadow-md border-2" style={{ borderColor: "#BA487F" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#FFECCC" }}>
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Texto</th>
                  <th className="px-6 py-4">URL</th>
                  <th className="px-6 py-4">Tema</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredContenidos.map((contenido) => (
                  <tr key={contenido.id} className="border-b">
                    <td className="px-6 py-4">#{contenido.id}</td>
                    <td className="px-6 py-4">{contenido.titulo}</td>
                    <td className="px-6 py-4 truncate">{contenido.texto}</td>
                    <td className="px-6 py-4">
                      <a
                        href={contenido.urls_img}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 underline"
                      >
                        Ver enlace
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold border"
                        style={getTemaStyle(contenido.tema)}
                      >
                        {getTemaLabel(contenido.tema)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(contenido)}
                        className="p-2 rounded"
                        style={{ color: "#BA487F" }}
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedId(contenido.id);
                          setModalDelete(true);
                        }}
                        className="p-2 rounded"
                        style={{ color: "#FF9587" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* MODAL CREAR */}
      {modalCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border-2 relative"
            style={{ borderColor: "#BA487F" }}
          >
            <button className="absolute top-4 right-4" onClick={() => setModalCreate(false)}>
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-4" style={{ color: "#722323" }}>
              Agregar Nuevo Contenido
            </h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Título"
                className="border p-2 rounded-lg"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />

              <textarea
                placeholder="Texto"
                className="border p-2 rounded-lg"
                value={formData.texto}
                onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="URL de la imagen"
                className="border p-2 rounded-lg"
                value={formData.urls_img}
                onChange={(e) => setFormData({ ...formData, urls_img: e.target.value })}
              />

              <select
                className="border p-2 rounded-lg"
                value={formData.tema}
                onChange={(e) => setFormData({ ...formData, tema: parseInt(e.target.value) })}
              >
                <option value="1">Nutrición</option>
                <option value="2">Ejercicio</option>
                <option value="3">Parto</option>
                <option value="4">Relajación</option>
                <option value="5">Postparto</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 text-white rounded-lg"
                style={{ background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)" }}
              >
                Guardar Contenido
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border-2 relative"
            style={{ borderColor: "#BA487F" }}
          >
            <button className="absolute top-4 right-4" onClick={() => setModalEdit(false)}>
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-4" style={{ color: "#722323" }}>
              Editar Contenido
            </h2>

            <form onSubmit={handleEdit} className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Título"
                className="border p-2 rounded-lg"
                value={editData.titulo}
                onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                required
              />

              <textarea
                placeholder="Texto"
                className="border p-2 rounded-lg"
                value={editData.texto}
                onChange={(e) => setEditData({ ...editData, texto: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="URL de la imagen"
                className="border p-2 rounded-lg"
                value={editData.urls_img}
                onChange={(e) => setEditData({ ...editData, urls_img: e.target.value })}
              />

              <select
                className="border p-2 rounded-lg"
                value={editData.tema}
                onChange={(e) =>
                  setEditData({ ...editData, tema: parseInt(e.target.value) })
                }
              >
                <option value="1">Nutrición</option>
                <option value="2">Ejercicio</option>
                <option value="3">Parto</option>
                <option value="4">Relajación</option>
                <option value="5">Postparto</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 text-white rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)",
                }}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border-2"
            style={{ borderColor: "#BA487F" }}
          >
            <h2 className="text-xl font-bold mb-3" style={{ color: "#722323" }}>
              ¿Eliminar contenido?
            </h2>
            <p className="mb-6">Esta acción no se puede deshacer.</p>

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
                onClick={deleteContent}
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

export default Contenido;
