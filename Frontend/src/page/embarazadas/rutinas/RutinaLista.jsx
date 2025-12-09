import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RutinaLista() {
  const [rutinas, setRutinas] = useState([]);
  const [rutinasRecomendadas, setRutinasRecomendadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecomendacion, setLoadingRecomendacion] = useState(false);
  const [modoRecomendacion, setModoRecomendacion] = useState(false);

  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [rangoSemanas, setRangoSemanas] = useState("");
  const [rangoEjercicios, setRangoEjercicios] = useState("");
  const [duracionMax, setDuracionMax] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rutinasPorPagina = 12;

  const intervalosSemanas = [
    "0-3", "4-8", "8-12", "12-16", "16-20",
    "20-24", "24-28", "28-32", "32-36", "36-40", "38-42"
  ];

  const intervalosEjercicios = ["0-4", "4-8", "8-12"];
  const intervalosDuracion = ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30"];

  // Cargar rutinas + obtener usuario
  useEffect(() => {
    const userString = localStorage.getItem("usuario");
    const user = userString ? JSON.parse(userString) : null;
    if (user) setUserId(user.id);

    const fetchRutinas = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/rutina/vista_basica/");
        const data = await res.json();
        setRutinas(data);
      } catch (error) {
        console.error("Error cargando rutinas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, []);

  // Activar recomendación ML
  const manejarRecomendacion = async () => {
    if (modoRecomendacion) {
      setModoRecomendacion(false);
      setRutinasRecomendadas([]);
      setBusqueda("");
      setRangoSemanas("");
      setRangoEjercicios("");
      setDuracionMax("");
      return;
    }

    if (!userId) {
      alert("Necesitas iniciar sesión para obtener recomendaciones.");
      return;
    }

    setLoadingRecomendacion(true);
    setModoRecomendacion(true);

    try {
      const url = `http://127.0.0.1:8000/api/recomendacion/lista/${userId}/`;
      const res = await fetch(url);
      const data = await res.json();
      setRutinasRecomendadas(data);
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
      setModoRecomendacion(false);
    } finally {
      setLoadingRecomendacion(false);
    }
  };

  // Lista activa
  const listaActiva = modoRecomendacion ? rutinasRecomendadas : rutinas;

  // FILTROS
  const rutinasFiltradas = listaActiva.filter((r) => {
    const matchNombre = r.nombre.toLowerCase().includes(busqueda.toLowerCase());

    let matchSemanas = true;
    if (rangoSemanas && !modoRecomendacion) {
      const [minS, maxS] = rangoSemanas.split("-").map(Number);
      matchSemanas = r.sug_semanas_em >= minS && r.sug_semanas_em <= maxS;
    }

    let matchEjercicios = true;
    if (rangoEjercicios) {
      const [minE, maxE] = rangoEjercicios.split("-").map(Number);
      matchEjercicios = r.total_ejercicios >= minE && r.total_ejercicios <= maxE;
    }

    let matchDuracion = true;
    if (duracionMax) {
      const [minD, maxD] = duracionMax.split("-").map(Number);
      matchDuracion = r.duracion_total_minutos >= minD && r.duracion_total_minutos <= maxD;
    }

    return matchNombre && matchSemanas && matchEjercicios && matchDuracion;
  });

  // PAGINACIÓN
  const totalPaginas = Math.ceil(rutinasFiltradas.length / rutinasPorPagina);
  const indexInicio = (currentPage - 1) * rutinasPorPagina;
  const indexFin = indexInicio + rutinasPorPagina;
  const rutinasPagina = rutinasFiltradas.slice(indexInicio, indexFin);

  const cambiarPagina = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || loadingRecomendacion)
    return <p className="text-center text-lg font-semibold">Cargando rutinas...</p>;

  return (
    <div className="w-full mb-16 px-4">

      {/* BOTÓN ML */}
      <div className="flex justify-end mb-6">
        <button
          onClick={manejarRecomendacion}
          disabled={loadingRecomendacion || !userId}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            modoRecomendacion ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {modoRecomendacion ? "Ver todas las rutinas" : "Recomendación Personalizada (ML)"}
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white px-4 py-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="border rounded-lg p-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={rangoSemanas}
          onChange={(e) => setRangoSemanas(e.target.value)}
          disabled={modoRecomendacion}
        >
          <option value="">Filtrar por semanas</option>
          {intervalosSemanas.map((s, i) => (
            <option key={i} value={s}>{s} semanas</option>
          ))}
        </select>

        <select
          className="border rounded-lg p-2"
          value={rangoEjercicios}
          onChange={(e) => setRangoEjercicios(e.target.value)}
        >
          <option value="">Ejercicios</option>
          {intervalosEjercicios.map((e, i) => (
            <option key={i} value={e}>{e} ejercicios</option>
          ))}
        </select>

        <select
          className="border rounded-lg p-2"
          value={duracionMax}
          onChange={(e) => setDuracionMax(e.target.value)}
        >
          <option value="">Duración</option>
          {intervalosDuracion.map((d, i) => (
            <option key={i} value={d}>{d} min</option>
          ))}
        </select>
      </div>

      {/* SIN RESULTADOS */}
      {rutinasFiltradas.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          {modoRecomendacion
            ? "El modelo no encontró rutinas adecuadas para ti."
            : "No se encontraron rutinas con estos filtros."}
        </p>
      )}

      {/* TARJETAS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rutinasPagina.map((r) => (
          <div key={r.id} className="p-5 bg-white shadow rounded-xl hover:shadow-lg transition border relative">

            {modoRecomendacion && r.score_ml && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                ML Score: {r.score_ml}
              </span>
            )}

            {r.icono_url && (
              <img
                src={`http://127.0.0.1:8000${r.icono_url}`}
                className="w-14 h-14 mx-auto mb-3"
                alt="icono"
              />
            )}

            <h3 className="text-xl font-bold text-center mb-2">{r.nombre}</h3>

            <p className="text-xs text-center mt-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              {r.creado_por ? `Creado por: ${r.creado_por}` : "Creador desconocido"}
            </p>

            <p className="text-gray-600 text-sm text-center h-12 overflow-hidden">{r.descripcion}</p>

            <div className="mt-4 text-sm">
              <p><strong>Semanas sugeridas:</strong> {r.sug_semanas_em}</p>
              <p><strong>Ejercicios:</strong> {r.total_ejercicios}</p>
              <p><strong>Duración:</strong> {r.duracion_total_minutos} min</p>
            </div>

            <button
              onClick={() => navigate(`/Rutina/${r.nombre.toLowerCase().replace(/ /g, "-")}`)}
              className="mt-4 w-full bg-[#F39F9F] text-white py-2 rounded-lg hover:bg-[#d57a7a]"
            >
              Ver detalles
            </button>

          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-8 space-x-2">

        <button
          disabled={currentPage === 1}
          onClick={() => cambiarPagina(currentPage - 1)}
          className={`px-3 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-[#F39F9F] text-white hover:bg-[#d57a7a]"
          }`}
        >
          ←
        </button>

        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => cambiarPagina(i + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === i + 1
                ? "bg-[#F39F9F] text-white"
                : "bg-white text-[#F39F9F] hover:bg-[#F39F9F] hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPaginas}
          onClick={() => cambiarPagina(currentPage + 1)}
          className={`px-3 py-2 rounded-lg ${
            currentPage === totalPaginas
              ? "bg-gray-300 text-gray-500"
              : "bg-[#F39F9F] text-white hover:bg-[#d57a7a]"
          }`}
        >
          →
        </button>
      </div>

    </div>
  );
}
