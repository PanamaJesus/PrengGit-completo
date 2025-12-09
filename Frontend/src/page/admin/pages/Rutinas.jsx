import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search, X } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/rutina/";
const API_EJERCICIOS = "http://127.0.0.1:8000/api/ejercicio/";
const API_RUTINA_EJERCICIO = "http://127.0.0.1:8000/api/rutinaejercicio/";

const Rutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSemana, setFiltroSemana] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingRutina, setEditingRutina] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    sug_semanas_em: "",
  });

  const semanasDisponibles = Array.from({ length: 40 }, (_, i) => i + 1);

  // ------------------------ GET DATA ------------------------
  const obtenerRutinas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRutinas(data);
    } catch (error) {
      console.error("Error al obtener rutinas:", error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/usuario/");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  const obtenerEjercicios = async () => {
    try {
      const res = await fetch(API_EJERCICIOS);
      const data = await res.json();
      setEjercicios(data);
    } catch (error) {
      console.error("Error al obtener ejercicios:", error);
    }
  };

  // ------------------------ CARGAR EJERCICIOS DE RUTINA ------------------------
  const obtenerEjerciciosRutina = async (rutinaId) => {
    try {
      const res = await fetch(API_RUTINA_EJERCICIO);
      const data = await res.json();
      const ejerciciosRutina = data
        .filter((re) => re.rutina === rutinaId)
        .map((re) => ({
          ejercicioId: re.ejercicio,
          series: re.series,
          repeticiones: re.repeticiones,
          tiempo_seg: re.tiempo_seg,
        }));
      setSelectedEjercicios(ejerciciosRutina);
    } catch (err) {
      console.error("Error al obtener ejercicios de la rutina:", err);
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.id) setUsuarioId(usuario.id);

    obtenerRutinas();
    obtenerUsuarios();
    obtenerEjercicios();
  }, []);

  // ------------------------ CREAR / EDITAR ------------------------
  const manejarSubmit = async (e) => {
    e.preventDefault();
    const esEdicion = Boolean(editingRutina);

    if (!usuarioId) {
      alert("No se encontró el usuario logueado.");
      return;
    }

    const payload = { ...formData, usuario: usuarioId, icono: null };

    try {
      const res = await fetch(
        esEdicion ? `${API_URL}${editingRutina.id}/` : API_URL,
        {
          method: esEdicion ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error backend:", errorData);
        alert("Error al guardar la rutina");
        return;
      }

      const rutinaCreada = await res.json();

      // ------------------------ AGREGAR EJERCICIOS ------------------------
      for (const sel of selectedEjercicios) {
        await fetch(API_RUTINA_EJERCICIO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rutina: rutinaCreada.id,
            ejercicio: sel.ejercicioId,
            series: sel.series,
            repeticiones: sel.repeticiones,
            tiempo_seg: sel.tiempo_seg,
          }),
        });
      }

      setOpenModal(false);
      setEditingRutina(null);
      setFormData({ nombre: "", descripcion: "", sug_semanas_em: "" });
      setSelectedEjercicios([]);
      obtenerRutinas();
    } catch (error) {
      console.error("Error al guardar rutina:", error);
    }
  };

  // ------------------------ ELIMINAR ------------------------
  const eliminarRutina = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta rutina?")) return;

    try {
      await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      obtenerRutinas();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // ------------------------ FILTRO DE ADMIN ------------------------
  const esAdmin = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? usuario.rol === 1 : false;
  };

  // ------------------------ FILTRADO FINAL ------------------------
  const filteredRutinas = rutinas
    .filter((rutina) => esAdmin(rutina.usuario))
    .filter(
      (rutina) =>
        rutina.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rutina.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((rutina) =>
      filtroSemana === ""
        ? true
        : rutina.sug_semanas_em == parseInt(filtroSemana)
    );

  // ------------------------ MODALES ------------------------
  const abrirModalCrear = () => {
    setEditingRutina(null);
    setFormData({ nombre: "", descripcion: "", sug_semanas_em: "" });
    setSelectedEjercicios([]);
    setOpenModal(true);
  };

  const abrirModalEditar = (rutina) => {
    setEditingRutina(rutina);
    setFormData({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion,
      sug_semanas_em: rutina.sug_semanas_em,
    });
    obtenerEjerciciosRutina(rutina.id); // carga los ejercicios seleccionados
    setOpenModal(true);
  };

  // ------------------------ RENDER ------------------------
  return (
    <div className="p-0 m-0 min-h-full w-full bg-white">
      {/* --- HEADER --- */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#722323" }}>
              Gestión de Rutinas
            </h1>
            <p style={{ color: "#BA487F" }}>
              Administra las rutinas de ejercicios del sistema
            </p>
          </div>

          <button
            onClick={abrirModalCrear}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all font-medium hover:shadow-lg transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)" }}
          >
            <Plus size={20} />
            Nueva Rutina
          </button>
        </div>

        {/* --- BÚSQUEDA --- */}
        <div className="flex flex-row gap-2 max-w-md mb-4">
          <div className="relative w-2/3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "#BA487F" }}
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-2 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm"
              style={{ borderColor: "#FFECCC", "--tw-ring-color": "#BA487F" }}
              onFocus={(e) => (e.target.style.borderColor = "#BA487F")}
              onBlur={(e) => (e.target.style.borderColor = "#FFECCC")}
            />
          </div>

          <select
            value={filtroSemana}
            onChange={(e) => setFiltroSemana(e.target.value)}
            className="w-1/3 pl-2 pr-2 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm"
            style={{ borderColor: "#FFECCC", "--tw-ring-color": "#BA487F" }}
            onFocus={(e) => (e.target.style.borderColor = "#BA487F")}
            onBlur={(e) => (e.target.style.borderColor = "#FFECCC")}
          >
            <option value="">Semana</option>
            {semanasDisponibles.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- TABLA DE RUTINAS --- */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-xl shadow-md border-2" style={{ borderColor: "#BA487F" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#FFECCC" }}>
                <tr>
                  {["ID", "Nombre", "Descripción", "Semanas sugeridas", "Acciones"].map((t) => (
                    <th
                      key={t}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#722323" }}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRutinas.map((rutina) => (
                  <tr
                    key={rutina.id}
                    className="border-b transition-colors"
                    style={{ borderBottomColor: "#FFECCC" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFECC0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    <td className="px-6 py-4">#{rutina.id}</td>
                    <td className="px-6 py-4">{rutina.nombre}</td>
                    <td className="px-6 py-4">{rutina.descripcion}</td>
                    <td className="px-6 py-4">{rutina.sug_semanas_em} semanas</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirModalEditar(rutina)} title="Editar">
                          <Edit size={18} style={{ color: "#BA487F" }} />
                        </button>
                        <button onClick={() => eliminarRutina(rutina.id)} title="Eliminar">
                          <Trash2 size={18} style={{ color: "#FF9587" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t-2" style={{ borderTopColor: "#FFECCC", backgroundColor: "#FFECC0", color: "#722323" }}>
            Mostrando {filteredRutinas.length} de {rutinas.length} rutinas
          </div>
        </div>
      </div>

      {/* --- MODAL CREAR/EDITAR RUTINA --- */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg border-2" style={{ borderColor: "#BA487F" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: "#722323" }}>
                {editingRutina ? "Editar Rutina" : "Nueva Rutina"}
              </h2>
              <button onClick={() => setOpenModal(false)} className="p-2 rounded-lg">
                <X size={20} style={{ color: "#FF9587" }} />
              </button>
            </div>

            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="border p-2 rounded-lg"
                style={{ borderColor: "#FFC29B" }}
              />
              <textarea
                placeholder="Descripción"
                required
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="border p-2 rounded-lg"
                style={{ borderColor: "#FFC29B" }}
              />
              <input
                type="number"
                placeholder="Semanas sugeridas"
                required
                value={formData.sug_semanas_em}
                onChange={(e) => setFormData({ ...formData, sug_semanas_em: e.target.value })}
                className="border p-2 rounded-lg"
                style={{ borderColor: "#FFC29B" }}
              />

              {/* --- SELECCIÓN DE EJERCICIOS --- */}
              <div className="flex flex-col gap-2 mt-2">
                <h3 className="font-semibold text-sm" style={{ color: "#722323" }}>Seleccionar Ejercicios</h3>
                {ejercicios.map((ej) => {
                  const sel = selectedEjercicios.find((s) => s.ejercicioId === ej.id) || {};
                  return (
                    <div key={ej.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!sel.ejercicioId}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEjercicios([
                              ...selectedEjercicios,
                              { ejercicioId: ej.id, series: ej.series_default || 3, repeticiones: ej.repeticiones_default || 10, tiempo_seg: ej.tiempo_seg_default || 60 }
                            ]);
                          } else {
                            setSelectedEjercicios(selectedEjercicios.filter(s => s.ejercicioId !== ej.id));
                          }
                        }}
                      />
                      <span className="text-sm" style={{ color: "#722323" }}>{ej.nombre}</span>
                      <input
                        type="number"
                        value={sel.series || ""}
                        placeholder="Series"
                        className="border rounded px-2 py-1 w-16 text-sm"
                        onChange={(e) => setSelectedEjercicios(selectedEjercicios.map(s => s.ejercicioId === ej.id ? { ...s, series: parseInt(e.target.value) } : s))}
                      />
                      <input
                        type="number"
                        value={sel.repeticiones || ""}
                        placeholder="Repeticiones"
                        className="border rounded px-2 py-1 w-20 text-sm"
                        onChange={(e) => setSelectedEjercicios(selectedEjercicios.map(s => s.ejercicioId === ej.id ? { ...s, repeticiones: parseInt(e.target.value) } : s))}
                      />
                      <input
                        type="number"
                        value={sel.tiempo_seg || ""}
                        placeholder="Tiempo(s)"
                        className="border rounded px-2 py-1 w-20 text-sm"
                        onChange={(e) => setSelectedEjercicios(selectedEjercicios.map(s => s.ejercicioId === ej.id ? { ...s, tiempo_seg: parseInt(e.target.value) } : s))}
                      />
                    </div>
                  )
                })}
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white rounded-lg mt-2 font-semibold"
                style={{ background: "linear-gradient(135deg, #722323 0%, #BA487F 100%)" }}
              >
                {editingRutina ? "Guardar cambios" : "Crear Rutina"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutinas;
