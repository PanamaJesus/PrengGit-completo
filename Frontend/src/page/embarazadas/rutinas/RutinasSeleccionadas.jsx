import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function RutinasSeleccionadas() {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const navigate = useNavigate();
    const usuario = useMemo(() => {
      const userString = localStorage.getItem("usuario");
      return userString ? JSON.parse(userString) : null;
  }, []);

    // Paginación
    const [pagina, setPagina] = useState(1);
    const rutinasPorPagina = 8;

    // Control de transición
    const [isPaginating, setIsPaginating] = useState(false);

    // Cálculo correcto de rutinas visibles + total de páginas
    const { rutinasVisibles, totalPaginas } = useMemo(() => {
        const inicio = (pagina - 1) * rutinasPorPagina;
        const fin = inicio + rutinasPorPagina;
        return {
            rutinasVisibles: rutinas.slice(inicio, fin),
            totalPaginas: Math.ceil(rutinas.length / rutinasPorPagina),
        };
    }, [rutinas, pagina]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina < 1 || nuevaPagina > totalPaginas || nuevaPagina === pagina) return;

        setIsPaginating(true);
        window.scrollTo(0, 0);

        setTimeout(() => {
            setPagina(nuevaPagina);

            setTimeout(() => {
                setIsPaginating(false);
            }, 80);
        }, 120);
    };

    useEffect(() => {
      if (!usuario) return;
  
      const fetchRutinas = async () => {
          try {
              const response = await fetch(
                  "http://127.0.0.1:8000/api/rutinasguardados/guardadas-usuario/",
                  {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ usuario_id: usuario.id }),
                  }
              );
  
              const data = await response.json();
              setRutinas(data);
              setPagina(1);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchRutinas();
  }, [usuario?.id]);
  

    const abrirModal = (rutina) => {
        setRutinaSeleccionada(rutina);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setRutinaSeleccionada(null);
        setModalOpen(false);
    };

    const eliminarRutina = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/rutinasguardados/eliminar-guardada/",
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rutina_id: rutinaSeleccionada.guardado_id,
                        usuario_id: usuario.id,
                    }),
                }
            );

            if (response.ok) {
                const nuevasRutinas = rutinas.filter(
                    (r) => r.guardado_id !== rutinaSeleccionada.guardado_id
                );
                setRutinas(nuevasRutinas);

                const nuevasPaginas = Math.ceil(nuevasRutinas.length / rutinasPorPagina);
                if (pagina > nuevasPaginas && nuevasPaginas > 0) {
                    setPagina(nuevasPaginas);
                } else if (nuevasRutinas.length === 0) {
                    setPagina(1);
                }

                cerrarModal();
            } else {
                console.error("Error al eliminar:", await response.text());
                alert("Error al eliminar la rutina.");
            }
        } catch (error) {
            console.error("Error al eliminar rutina:", error);
            alert("Error de conexión.");
        }
    };

    const cuadrillaClase = `transition-opacity duration-150 ease-in ${
        isPaginating ? "opacity-0" : "opacity-100"
    }`;

    return (
        <div className="p-6">
            <div className="bg-gray-100 p-6 rounded-xl pb-14 shadow-lg relative">

                {/* TÍTULO Y BOTÓN */}
                <div className="w-full flex justify-between items-center mb-4 text-gray-500">
                    <h2 className="text-xl font-semibold">Mis rutinas guardadas</h2>
                    <button
                        className="bg-[#F39F9F] text-white px-4 py-2 rounded-lg hover:bg-[#B95E82] transition"
                        onClick={() => navigate("/Administrar-rutinas")}
                    >
                        Administrar rutinas
                    </button>
                </div>

                {/* CONTENIDO */}
                {loading ? (
                    <p className="text-center text-gray-500">Cargando rutinas...</p>
                ) : !rutinas.length ? (
                    <p className="text-center text-gray-500">No tienes rutinas guardadas.</p>
                ) : (
                    <div
                        key={`pagina_${pagina}_${rutinasVisibles.length}`}
                        className={cuadrillaClase}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {rutinasVisibles.map((rutina) => (
                                <div
                                    key={rutina.guardado_id}
                                    className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {rutina.nombre}
                                        </h3>
                                        <span
                                            className={
                                                "text-xs font-semibold px-2 py-1 rounded " +
                                                (rutina.es_publica
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-yellow-200 text-yellow-800")
                                            }
                                        >
                                            {rutina.es_publica ? "Pública" : "Privada"}
                                        </span>

                                        <p className="text-gray-600 text-sm mb-1 mt-2">
                                            Duración:{" "}
                                            <span className="font-medium">
                                                {rutina.duracion_min} min
                                            </span>
                                        </p>

                                        <p className="text-gray-600 text-sm mb-1">
                                            Semanas:{" "}
                                            <span className="font-medium">
                                                {rutina.sug_semanas_em}
                                            </span>
                                        </p>

                                        <p className="text-gray-500 text-xs mt-2">
                                            Guardada el:{" "}
                                            {new Date(rutina.fecha_guardado).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-4">
                                        <button
                                            onClick={() => {
                                                const slug = rutina.nombre
                                                    .toLowerCase()
                                                    .replace(/ /g, "-");
                                                navigate(`/Rutina/${slug}`);
                                            }}
                                            className="bg-[#F39F9F] text-white py-1 px-3 rounded hover:bg-[#d57a7a] transition-colors"
                                        >
                                            Ver Detalles
                                        </button>

                                        
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PAGINACIÓN */}
                        {totalPaginas > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    onClick={() => cambiarPagina(pagina - 1)}
                                    disabled={pagina === 1 || isPaginating}
                                    className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
                                >
                                    ← Anterior
                                </button>

                                <span className="font-medium text-gray-700">
                                    Página {pagina} de {totalPaginas}
                                </span>

                                <button
                                    onClick={() => cambiarPagina(pagina + 1)}
                                    disabled={pagina === totalPaginas || isPaginating}
                                    className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* MODAL ELIMINAR */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80">
                            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
                            <p className="text-gray-700 mb-6">
                                ¿Seguro que deseas eliminar la rutina "
                                {rutinaSeleccionada?.nombre}"?
                            </p>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cerrarModal}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={eliminarRutina}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
