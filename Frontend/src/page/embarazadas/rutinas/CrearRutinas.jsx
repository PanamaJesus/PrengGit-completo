import { useEffect, useState } from "react";
import NavbarE from "../NavEmb";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom"; 


function CrearRutinas() {
  const [ejercicios, setEjercicios] = useState([]);
  const [search, setSearch] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [detallesAbiertos, setDetallesAbiertos] = useState({});
  const [rangoSemanas, setRangoSemanas] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [nombreRutina, setNombreRutina] = useState("");
    const [cantidadEjercicios, setCantidadEjercicios] = useState(0);
    const [iconos, setIconos] = useState([]);
const [iconoSeleccionado, setIconoSeleccionado] = useState(null);

// pública / privada
const [esPublica, setEsPublica] = useState(false);

// Paginación
const [paginaActual, setPaginaActual] = useState(1);
const ejerciciosPorPagina = 9;


    // Agrega estos estados al inicio del componente:
const [alerta, setAlerta] = useState(""); // mensaje de alerta
const [alertaTipo, setAlertaTipo] = useState("error"); // "success" o "error"

    const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");
      const navigate = useNavigate(); 




  // Obtener ejercicios desde backend
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ejercicio/vista_basica/");
        const data = await res.json();

        // la API devuelve un array directamente
        setEjercicios(data);
      } catch (error) {
        console.error("Error cargando ejercicios:", error);
      }
    };
    const fetchIconos = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/imagenes/por-proposito/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposito: "rutina" })
      });

      const data = await res.json();
      setIconos(data);
    } catch (error) {
      console.log("Error cargando iconos:", error);
    }
  };

  fetchIconos();

    fetchEjercicios();
  }, []);

  // Seleccionar / deseleccionar ejercicio
  const toggleEjercicio = (ejercicio) => {
    if (seleccionados.some(e => e.id === ejercicio.id)) {
      setSeleccionados(seleccionados.filter(e => e.id !== ejercicio.id));
    } else {
      setSeleccionados([...seleccionados, ejercicio]);
    }
  };

  // Guardar rutina
  const guardarRutina = async () => {
    

  if (seleccionados.length < 3) {
    alert("Debes agregar al menos 3 ejercicios para guardar la rutina.");
    return;
  }

  if (seleccionados.length > 10) {
    alert("No puedes agregar más de 10 ejercicios a una rutina.");
    return;
  }
  // Validaciones
    if (!nombreRutina.trim()) {
      setAlerta("El nombre de la rutina no puede estar vacío.");
      return;}

  // ------ si pasa las validaciones, ya procede a guardar ------
  try {
    const response = await fetch("http://127.0.0.1:8000/api/rutina/crear-con-ejercicios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombreRutina,
        descripcion : "Rutina creada por usuario embarazada",
        usuario: usuarioData.id,
        sug_semanas_em: usuarioData.semana_embarazo, 
        es_publica: esPublica,
        icono_id: iconoSeleccionado,
        ejercicios: seleccionados.map(e => ({
          ejercicio: e.id,
          series: e.series_default,
          repeticiones: e.repeticiones_default,
          tiempo_seg: e.tiempo_seg_default
        }))
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      setAlertaTipo("error");
      setAlerta(errorData.detail || "Ocurrió un error al crear la rutina.");
      return;
    }

    const rutinaCreada = await response.json();
    console.log("Rutina creada:", rutinaCreada);
    const rutinaId = rutinaCreada.rutina_id; // asumimos que el backend devuelve el ID

    // 2️⃣ Guardar automáticamente la rutina creada en RutinasGuardados
    await fetch("http://127.0.0.1:8000/api/rutinasguardados/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: usuarioData.id,
        rutina: rutinaId
      })
    });

    console.log("Rutina creada con ID:", rutinaId);
    console.log("body mandado" , JSON.stringify({
        usuario: usuarioData.id,
        rutina: rutinaId
      }))

    // ✅ Éxito
    setAlertaTipo("success");
    setAlerta("✅ Rutina creada y guardada exitosamente!");
    setTimeout(() => navigate("/rutinas"), 1500);

  } catch (error) {
    console.error("Error:", error);
    setAlertaTipo("error");
    setAlerta("Error de conexión, intenta de nuevo.");
  }
        
};


  const toggleDetalles = (id) => {
  setDetallesAbiertos(prev => ({
    ...prev,
    [id]: !prev[id],
  }));
};


  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <NavbarE />

      <div className="pt-24 px-6 max-w-7xl mx-auto pb-16">
  <h1 className="text-3xl font-bold mb-6">Crear Rutina Personalizada</h1>

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
  .slice((paginaActual - 1) * ejerciciosPorPagina, paginaActual * ejerciciosPorPagina)
  .map((ejercicio) =>  {
          const isSelected = seleccionados.some(e => e.id === ejercicio.id);
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
                  <img src={`http://127.0.0.1:8000${ejercicio.icono_url}`} alt="" className="h-full object-contain" />
                ) : (
                  <div className="text-gray-400">Sin imagen</div>
                )}
              </div>

              {/* Nombre */}
              <h3 className="text-lg font-bold text-center">{ejercicio.nombre}</h3>

              {/* Categoría */}
              <p className="text-[#B95E82] text-sm text-center font-medium">{ejercicio.categoria}</p>

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
                      : "bg-[#F39F9F] text-white hover:bg-[#B95E82]"
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
        <li key={e.id} className="p-3 border rounded-lg flex justify-between">
          <span>{e.nombre}</span>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() =>
              setSeleccionados(seleccionados.filter(x => x.id !== e.id))
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
        guardarRutina();
      }}
      className={`w-full text-white py-2 rounded-lg transition ${
        seleccionados.length < 3 || seleccionados.length > 10
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#F39F9F] hover:bg-[#B95E82]"
      }`}
    >
      Guardar rutina
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
  {/* PAGINACIÓN */}
<div className="col-span-full flex justify-center mt-6">
  {Array.from({
    length: Math.ceil(
      ejercicios.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()))
      .filter(e => {
        if (!rangoSemanas) return true;
        const [min, max] = rangoSemanas.split("-").map(Number);
        return e.sug_semanas >= min && e.sug_semanas <= max;
      })
      .filter(e => !categoriaFiltro || e.categoria === categoriaFiltro).length 
      / ejerciciosPorPagina
    )
  }).map((_, i) => {
    const num = i + 1;
    return (
      <button
        key={num}
        onClick={() => setPaginaActual(num)}
        className={`
          mx-1 px-4 py-2 rounded-lg border transition
          ${paginaActual === num
            ? "bg-[#F39F9F] text-white border-[#F39F9F]"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
        `}
      >
        {num}
      </button>
    );
  })}
</div>

</div>


      <Footer />
    </main>
  );
}

export default CrearRutinas;
