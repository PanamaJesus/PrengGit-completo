import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarE from '../embarazadas/NavEmb';
import Footer from '../../components/Footer';

function ContenidoPorTema() {
  const { temaId } = useParams();
  const [temaNombre, setTemaNombre] = useState("");
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Estado para búsqueda
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Obtener nombre del tema
    fetch(`http://localhost:8000/api/tipotema/${temaId}/`)
      .then((res) => res.json())
      .then((data) => setTemaNombre(data.nombre))
      .catch((err) => console.error("Error obteniendo tema:", err));

    // Obtener contenido y filtrar por tema
    fetch("http://127.0.0.1:8000/api/contenido/")
      .then((response) => response.json())
      .then((data) => {
        const filtrados = data.filter(
          (item) => item.tema === parseInt(temaId)
        );
        setContenidos(filtrados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando el contenido:", error);
        setLoading(false);
      });
  }, [temaId]);

  // 🔍 Filtro por texto
  const contenidosFiltrados = contenidos.filter((c) =>
    c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.texto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>

      <div className="overflow-hidden">
        <NavbarE />

        <div className="mt-28 px-6 max-w-7xl mx-auto">

          {/* Enlaces arriba */}
          <div className="flex items-center gap-8 mb-6">
            <a
              href="/TiposContenido"
              className="text-2xl text-gray-500 font-bold relative group"
            >
              Tema
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="#"
              className="text-2xl text-[#A83279] font-bold relative group"
            >
              {temaNombre || "Cargando..."}
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* 🔍 Barra de búsqueda (solo buscar + limpiar) */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row gap-3 items-center">

            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
            />

            <button
              onClick={() => setBusqueda("")}
              className="ml-auto px-4 py-2 bg-gray-100 rounded-lg"
            >
              Limpiar
            </button>
          </div>

          {loading ? (
            <p>Cargando contenido...</p>
          ) : contenidosFiltrados.length === 0 ? (
            <p>No hay contenido para este tema.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {contenidosFiltrados.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <img
                    src={c.urls_img}
                    alt={c.titulo}
                    className="rounded-lg w-full h-48 object-cover mb-3"
                  />

                  <h2 className="text-xl font-semibold text-[#BA487F] mb-2">
                    {c.titulo}
                  </h2>

                  <p className="text-gray-700 text-justify">{c.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default ContenidoPorTema;