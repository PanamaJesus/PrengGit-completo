
import { useEffect, useState } from "react";
import NavbarE from "../NavEmb";
import Footer from "../../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";

function EditarRutinas() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const nombreOriginal = slug.replace(/-/g, " ");

  const [rutina, setRutina] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [iconos, setIconos] = useState([]);
  const [iconoSeleccionado, setIconoSeleccionado] = useState(null);

  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [rangoSemanas, setRangoSemanas] = useState("");

  const [nombreRutina, setNombreRutina] = useState("");
  const [esPublica, setEsPublica] = useState(false);

  const [seleccionados, setSeleccionados] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("error");

  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // 🔥 Necesario porque lo usas en la UI
  const [detallesAbiertos, setDetallesAbiertos] = useState({});
  const toggleDetalles = (id) => {
    setDetallesAbiertos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // -----------------------------------------------------
  // 🔥 Cargar ejercicios + iconos
  // -----------------------------------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ejercicio/vista_basica/")
      .then(res => res.json())
      .then(setEjercicios);

    fetch("http://127.0.0.1:8000/api/imagenes/por-proposito/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposito: "rutina" }),
    })
      .then(res => res.json())
        .then(data => setIconos(data || []));

    }, []);

  // -----------------------------------------------------
  // 🔥 Cargar rutina por nombre
  // -----------------------------------------------------
useEffect(() => {
  const cargarRutina = async () => {
    try {
      setLoading(true); // 🔥 iniciar loading

      const res = await fetch(
        "http://127.0.0.1:8000/api/rutina/buscar-por-nombre/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nombreOriginal }),
        }
      );

      const data = await res.json();

      console.log("Rutina cargada:", data); // 🔍 depuración

      if (!data || !data.ejercicios) {
        throw new Error("La API no devolvió la estructura correcta");
      }

      // Guardar info básica
      setRutina(data);
      setNombreRutina(data.nombre);
      setEsPublica(data.es_publica);
      setIconoSeleccionado(data.icono || null);

      // Mapear los ejercicios seleccionados para previsualización
      const ejerciciosAdaptados = data.ejercicios.map(e => ({
        crear_id: e.id,                     // ID de CrearRutina (para eliminar)
        ejercicio_id: e.ejercicio.id,       // ID del ejercicio real
        nombre: e.ejercicio.nombre,
        series_default: e.series ?? e.ejercicio.series_default ?? 3,
        repeticiones_default: e.repeticiones ?? e.ejercicio.repeticiones_default ?? 10,
        tiempo_seg_default: e.tiempo_seg ?? e.ejercicio.tiempo_seg_default ?? 0,
      }));

      console.log("Ejercicios adaptados:", ejerciciosAdaptados); // 🔍 depuración

      setSeleccionados(ejerciciosAdaptados);
        setOriginal(ejerciciosAdaptados);
      setLoading(false); // 🔥 loading terminado
    } catch (error) {
      console.error("Error cargando rutina:", error);
      setAlerta("No se pudo cargar la rutina.");
      setAlertaTipo("error");
      setLoading(false); // 🔥 aunque falle, dejar loading en false
    }
  };

  cargarRutina();
}, [slug]);

const ejercicios_eliminar = original
  .filter(o => !seleccionados.some(s => s.ejercicio_id === o.ejercicio_id))
  .map(e => e.crear_id); // el backend quiere IDs de CrearRutina

  const ejercicios_agregar = seleccionados
  .filter(s => !original.some(o => o.ejercicio_id === s.ejercicio_id))
  .map(e => ({
    ejercicio_id: e.ejercicio_id ?? e.id,
    series: e.series,
    repeticiones: e.repeticiones,
    tiempo_seg: e.tiempo_seg,
  }));


  // -----------------------------------------
  // 3) AGREGAR O QUITAR EJERCICIO
  // -----------------------------------------
const toggleEjercicio = (ej) => {
  const existe = seleccionados.some(s => s.ejercicio_id === ej.id);

  if (existe) {
    // Quitar
    setSeleccionados(seleccionados.filter(s => s.ejercicio_id !== ej.id));
  } else {
    // Agregar
    setSeleccionados([
      ...seleccionados,
      {
        crear_id: null,              // porque aún no existe en la BD
        ejercicio_id: ej.id,
        nombre: ej.nombre,
        series: ej.series_default ?? 3,
        repeticiones: ej.repeticiones_default ?? 10,
        tiempo_seg: ej.tiempo_seg_default ?? 0
      }
    ]);
  }
};


  // -----------------------------------------
  // 4) ACTUALIZAR RUTINA
  // -----------------------------------------
  const actualizarRutina = async () => {
  if (seleccionados.length < 3 || seleccionados.length > 10) {
    setAlerta("Debes seleccionar mínimo 3 ejercicios y máximo 10.");
    return;
  }

  try {
    // IDs originales y nuevos
const originalesIDs = original.map(e => e.ejercicio_id);
const nuevosIDs = seleccionados.map(e => e.ejercicio_id);

// 🔥 ELIMINADOS → los que estaban antes y ya no están ahora
const ejercicios_eliminar = original
  .filter(e => !nuevosIDs.includes(e.ejercicio_id))
  .map(e => e.crear_id);

// 🔥 AGREGADOS → los que no existían antes
const ejercicios_agregar = seleccionados
  .filter(e => !originalesIDs.includes(e.ejercicio_id))
  .map(e => ({
    ejercicio_id: e.ejercicio_id,
    series: e.series,
    repeticiones: e.repeticiones,
    tiempo_seg: e.tiempo_seg
  }));

    // 🔥 3. Construir body final
    const body = {
      rutina_id: rutina.id,
      usuario_id: usuario.id,
      nombre: nombreRutina,
      es_publica: esPublica,
      icono_id: iconoSeleccionado,
      ejercicios_eliminar,
      ejercicios_agregar
    };

    console.log("BODY FINAL ENVIADO:", body);

    // 🔥 4. Enviar al backend
    const res = await fetch(
      "http://127.0.0.1:8000/api/rutina/actualizar-rutina/",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error();

    setAlertaTipo("success");
    setAlerta("Rutina actualizada correctamente");

    setTimeout(() => navigate("/rutinas"), 1200);

  } catch (err) {
    console.error(err);
    setAlertaTipo("error");
    setAlerta("Error al actualizar rutina.");
  }
};


  if (loading) return <p className="p-10 text-center">Cargando rutina...</p>;

  // -----------------------------------------
  // UI COMPLETA (igual que CrearRutinas)
  // -----------------------------------------
  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <NavbarE />

      <div className="pt-24 px-6 max-w-7xl mx-auto pb-16">
        <h1 className="text-3xl font-bold mb-6">Editar Rutina</h1>

         {/* 🔍 FILTROS ARRIBA — FUERA DEL GRID */}
  <div className="bg-white px-4 py-4 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Buscar */}
    <input
      type="text"
      placeholder="Buscar por nombre..."
      className="border rounded-lg p-2"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Semanas */}
    <select
      className="border rounded-lg p-2"
      value={rangoSemanas}
      onChange={(e) => setRangoSemanas(e.target.value)}
    >
      <option value="">Filtrar por semanas</option>
      <option value="0-4">0–4 semanas</option>
      <option value="4-8">4–8 semanas</option>
      <option value="8-12">8–12 semanas</option>
      <option value="12-20">12–20 semanas</option>
    </select>

    {/* Categoría */}
    <select
      className="border rounded-lg p-2"
      value={categoriaFiltro}
      onChange={(e) => setCategoriaFiltro(e.target.value)}
    >
      <option value="">Categorías</option>
      {[...new Set(ejercicios.map(e => e.categoria))].map((cat, idx) => (
        <option key={idx} value={cat}>{cat}</option>
      ))}
    </select>

  </div>

  {/* 🔥 GRID + PREVISUALIZACIÓN */}
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

    {/* 🔥 GRID DE EJERCICIOS */}
    <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {ejercicios
        .filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()))
        .filter(e => {
          if (!rangoSemanas) return true;
          const [min, max] = rangoSemanas.split("-").map(Number);
          return e.sug_semanas >= min && e.sug_semanas <= max;
        })
        .filter(e => !categoriaFiltro || e.categoria === categoriaFiltro)
        .map((ejercicio) => {
          const isSelected = seleccionados.some(e => e.ejercicio_id === ejercicio.id);
          const isOpen = detallesAbiertos[ejercicio.id] || false;

          return (
            <div
              key={ejercicio.id}
              className={`
                relative bg-white shadow rounded-xl border 
                hover:shadow-lg transition p-5
                ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200"}
              `}
            >

              {/* ✓ Palomita */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow">
                  ✓
                </div>
              )}

              {/* Imagen */}
              <div className="w-full h-32 flex items-center justify-center mb-3">
                {ejercicio.icono_url ? (
                  <img src={"http://127.0.0.1:8000/"+ejercicio.icono_url} alt="" className="h-full object-contain" />
                ) : (
                  <div className="text-gray-400">Sin imagen</div>
                )}
              </div>

              {/* Nombre */}
              <h3 className="text-lg font-bold text-center">{ejercicio.nombre}</h3>

              {/* Categoría */}
              <p className="text-indigo-600 text-sm text-center font-medium">{ejercicio.categoria}</p>

              {/* Semanas */}
              <p className="text-gray-600 text-sm text-center">
                Semanas sugeridas: <strong>{ejercicio.sug_semanas}</strong>
              </p>

              {/* Botones */}
              <div className="flex flex-col mt-3 space-y-2">

                <button
                  disabled={isSelected}
                  onClick={() => toggleEjercicio(ejercicio)}
                  className={`
                    py-2 rounded-lg text-sm font-medium transition
                    ${isSelected
                      ? "bg-green-500 text-white opacity-90 cursor-not-allowed"
                      : "btn-rosa text-white "
                    }
                  `}
                >
                  {isSelected ? "Seleccionado" : "Agregar"}
                </button>

                <button
                  onClick={() => toggleDetalles(ejercicio.id)}
                  className="text-[#B95E82] text-sm hover:underline"
                >
                  {isOpen ? "Ocultar detalles" : "Ver detalles"}
                </button>

              </div>

              {isOpen && (
                <div className="mt-3 p-3 bg-gray-50 border rounded-lg text-sm">
                  <p><strong>Descripción:</strong> {ejercicio.descripcion}</p>
                  <p className="mt-1"><strong>Nivel:</strong> {ejercicio.nivel_esfuerzo}</p>
                </div>
              )}

            </div>
          );
        })}
    </div>

    {/* 🟦 PREVISUALIZACIÓN */}
{/* 🟦 PREVISUALIZACIÓN CON NOMBRE Y ALERTA */}
<div className="bg-white shadow p-6 rounded-xl">

  {/* Contador */}
  <p className="text-sm text-gray-600">
    Ejercicios agregados: <span className="font-bold">{seleccionados.length}</span> / 10
  </p>

  {/* Nombre de la rutina */}
  <div className="mb-5 mt-3">
    <label className="font-semibold text-sm">Nombre de la rutina</label>
    <input
      type="text"
      placeholder="Ejemplo: Rutina de movilidad suave"
      className="w-full mt-1 p-2 border rounded-lg"
        required={true} 
      value={nombreRutina}
      onChange={(e) => setNombreRutina(e.target.value)
       
      }
    />
  </div>
  <div className="mb-5">
  <label className="font-semibold text-sm">Ícono de la rutina</label>

  <div className="grid grid-cols-3 gap-3 mt-2">
    {iconos.length === 0 && (
      <p className="text-gray-500 text-sm col-span-3">No hay iconos disponibles.</p>
    )}

    {iconos.map((ic) => (
      <div
        key={ic.id}
        onClick={() => setIconoSeleccionado(ic.id)}
        className={`
          border rounded-lg p-2 cursor-pointer transition
          ${iconoSeleccionado === ic.id ? "border-green-600 bg-green-50" : "border-gray-300"}
        `}
      >
        <img
          src={ic.url}
          alt="icono"
          className="w-full h-20 object-contain"
        />
      </div>
    ))}
  </div>

</div>

<div className="mb-5">
  <label className="font-semibold text-sm">Visibilidad</label>

  <div className="flex items-center mt-2 gap-3">
    <input
      type="checkbox"
      checked={esPublica}
      onChange={() => setEsPublica(!esPublica)}
      className="w-5 h-5"
    />
    <span className="text-gray-700 text-sm">
      Hacer rutina pública (si no la seleccionas será privada)
    </span>
  </div>
</div>



  {/* Alerta informativa */}
  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded mb-4 text-sm text-gray-700">
    ⚠️ <strong>Nota:</strong> Esta rutina se mostrará como creada por un usuario
    por seguridad de las demás embarazadas.
  </div>

  <h2 className="text-xl font-bold mb-4">Previsualización</h2>

  {seleccionados.length === 0 ? (
    <p className="text-gray-500">Aún no has seleccionado ejercicios.</p>
  ) : (
    <ul className="space-y-3">
      {seleccionados.map((e) => (
        <li key={e.crear_id || e.ejercicio_id} className="p-3 border rounded-lg flex justify-between">
          <span>{e.nombre}</span>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() =>
                  setSeleccionados(seleccionados.filter(x => x.ejercicio_id !== e.ejercicio_id))
            }
          >
            Quitar
          </button>
        </li>
      ))}
    </ul>
  )}

  {/* BOTÓN + ALERTA */}
  <div className="mt-6">
    <button
      onClick={() => {
        if (seleccionados.length < 3 || seleccionados.length > 10) {
          setAlerta("Debes seleccionar mínimo 3 ejercicios y máximo 10.");
          return;
        }
        setAlerta("");
        actualizarRutina();

      }}
      className={`w-full text-white py-2 rounded-lg transition ${
        seleccionados.length < 3 || seleccionados.length > 10
          ? "bg-gray-400 cursor-not-allowed"
          : "btn-rosa"
      }`}
    >
       Actualizar rutina
    </button>

    {/* ALERTA DE VALIDACIÓN */}
    {alerta && (
  <p
    className={`text-sm mt-2 font-semibold ${
      alertaTipo === "success" ? "text-green-600" : "text-red-500"
    }`}
  >
    {alerta}
  </p>
)}


  </div>

</div>



  </div>


        

        {alerta && (
          <p
            className={`text-sm mt-2 font-semibold ${
              alertaTipo === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {alerta}
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default EditarRutinas;
