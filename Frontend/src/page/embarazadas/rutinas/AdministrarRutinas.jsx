import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarE from '../NavEmb'
import Footer from '../../../components/Footer'

export default function AdministrarRutinas() {
  const [activeTab, setActiveTab] = useState("creadas");
  const [rutinasCreadas, setRutinasCreadas] = useState([]);
  const [rutinasGuardadas, setRutinasGuardadas] = useState([]);
  const [loading, setLoading] = useState(true);


  const [modalOpen, setModalOpen] = useState(false);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

  const esGuardada = rutinaSeleccionada?.guardado_id !== undefined;


  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  // 🔵 Abrir y cerrar modal
  const abrirModal = (rutina) => {
    console.log("rutina seleccionada:", rutina);
    setRutinaSeleccionada(rutina);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setRutinaSeleccionada(null);
    setModalOpen(false);
  };

  // 🔥 Eliminar rutina guardada
const eliminarRutina = async () => {
  if (!rutinaSeleccionada) return;

  try {
    // Saber si es guardada
    const esGuardada = rutinaSeleccionada.guardado_id !== undefined;

    if (esGuardada) {
      // 🟢 Eliminar rutina guardada
      await fetch(`http://127.0.0.1:8000/api/rutinasguardados/eliminar-guardada/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rutina_id: rutinaSeleccionada.guardado_id,
          usuario_id: usuario.id
        }),
      });

      setRutinasGuardadas(
        rutinasGuardadas.filter(r => r.guardado_id !== rutinaSeleccionada.guardado_id)
      );

    } else {
      // 🔴 Eliminar rutina creada
      await fetch(`http://127.0.0.1:8000/api/rutina/eliminar-rutina/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rutina_id: rutinaSeleccionada.id,
          usuario_id: usuario.id
        }),
      });

      setRutinasCreadas(
        rutinasCreadas.filter(r => r.id !== rutinaSeleccionada.id)
      );
    }

    cerrarModal();

  } catch (error) {
    console.error("Error al eliminar rutina:", error);
  }
};


  // 🔵 Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario || !usuario.id) return;

        // Rutinas creadas
        const resCreadas = await fetch(
          "http://127.0.0.1:8000/api/rutina/de-usuario/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuario.id }),
          }
        );
        const Data = await resCreadas.json();
        const creadasData = Data.creadas;
        const guardadasData = Data.guardadas;

        setRutinasCreadas(creadasData);
        setRutinasGuardadas(guardadasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">Cargando...</p>
    );

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <NavbarE />
      <div className="pt-24 p-6">

      {/* TABS */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("creadas")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "creadas"
              ? "bg-indigo-600 text-white shadow"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Rutinas creadas
        </button>

        <button
          onClick={() => setActiveTab("guardadas")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "guardadas"
              ? "bg-indigo-600 text-white shadow"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Rutinas guardadas
        </button>
      </div>

      <div className="mt-4">

        {/* =============================================== */}
        {/* 🔵 RUTINAS CREADAS (YA ESTÁN DE VUELTA AQUI WE) */}
        {/* =============================================== */}
        {activeTab === "creadas" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rutinasCreadas.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No has creado ninguna rutina.
              </p>
            ) : (
              rutinasCreadas.map((r) => (
                <div
                  key={r.id}
                  className="p-5 bg-white shadow rounded-xl border hover:shadow-lg transition flex flex-col"
                >
                  {r.icono_url && (
                    <img
                      src={`http://127.0.0.1:8000${r.icono_url}`}
                      alt="Icono rutina"
                      className="w-14 h-14 mx-auto mb-3"
                    />
                  )}

                  <h3 className="text-xl font-bold text-center">{r.nombre}</h3>

                  <p className="text-xs mt-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-center font-semibold">
                    Creada por ti
                  </p>

                  <p className="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-center">
                    {r.descripcion}
                  </p>

                  <p className="text-sm mt-2"><strong>Total ejercicios:</strong> {r.total_ejercicios}</p>
                  <p className="text-sm"><strong>Duración:</strong> {r.duracion_total_minutos} min</p>

                  <button
                    onClick={() => {
                      const slug = r.nombre.toLowerCase().replace(/ /g, "-");
                      navigate(`/Rutina/${slug}`);
                    }}
                    className="mt-4 w-full btn-rosa text-white py-2 rounded-lg  transition"
                  >
                    Ver detalles
                  </button>
                  <button
  onClick={() => {
    const slug = r.nombre.toLowerCase().replace(/ /g, "-");
    navigate(`/Editar-rutina/${slug}`);
  }}
  className="mt-2 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
>
  Editar
</button>
<button
  onClick={() => abrirModal(r)}     // 🔥 mismo modal que ya usas
  className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
>
  Eliminar
</button>



                </div>
              ))
            )}
          </div>
        )}
{modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Seguro que deseas eliminar la rutina "{rutinaSeleccionada.nombre}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarRutina}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
        {/* =============================================== */}
        {/* 🔴 RUTINAS GUARDADAS (CON BOTÓN ELIMINAR)       */}
        {/* =============================================== */}
        {activeTab === "guardadas" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rutinasGuardadas.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No tienes rutinas guardadas.
              </p>
            ) : (
              rutinasGuardadas.map((r) => (
                <div
                  key={r.id}
                  className="p-5 bg-white shadow rounded-xl border hover:shadow-lg transition flex flex-col"
                >
                  {r.icono_url && (
                    <img
                      src={`http://127.0.0.1:8000${r.icono_url}`}
                      alt="Icono rutina"
                      className="w-14 h-14 mx-auto mb-3"
                    />
                  )}

                  <h3 className="text-xl font-bold text-center">{r.nombre}</h3>

                  <p className="text-xs mt-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-center font-semibold">
                    Guardada
                  </p>

                  <p className="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-center">
                    {r.descripcion}
                  </p>

                  <p className="text-sm mt-2"><strong>Total ejercicios:</strong> {r.total_ejercicios}</p>
                  <p className="text-sm"><strong>Duración:</strong> {r.duracion_total_minutos} min</p>

                  <button
                    onClick={() => {
                      const slug = r.nombre.toLowerCase().replace(/ /g, "-");
                      navigate(`/Rutina/${slug}`);
                    }}
                    className="mt-4 w-full btn-rosa text-white py-2 rounded-lg  transition"
                  >
                    Ver detalles
                  </button>

                  {/* 🔴 Botón eliminar solo en GUARDADAS */}
                  <button
                    onClick={() => abrirModal(r)}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ======================= */}
      {/* 🔥 MODAL ELIMINAR */}
      {/* ======================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Seguro que deseas eliminar la rutina "{rutinaSeleccionada.nombre}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarRutina}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
      <Footer />
    </main>
  );
}
