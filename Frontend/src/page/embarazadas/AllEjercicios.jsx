import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import NavbarE from "./NavEmb";
import Footer from '../../components/Footer'
import Ejercicio_Idx from '../../assets/fit4.jpg'

export default function AllEjercicios() {
  const [ejercicios, setEjercicios] = useState([]);
  const [imagenes, setImagenes] = useState({});
  const [loading, setLoading] = useState(true);

  // filtros
  const [query, setQuery] = useState("");
  const [selectedSemana, setSelectedSemana] = useState("all");
  const [selectedNivel, setSelectedNivel] = useState("all");
  const [selectedCategoria, setSelectedCategoria] = useState("all");

  // paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const ejerciciosPorPagina = 6;

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ejercicio/");
        const data = await res.json();
        setEjercicios(data);
      } catch (err) {
        console.error("Error al cargar ejercicios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEjercicios();
  }, []);

  // Obtener imágenes
  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const nuevas = {};

        for (const ej of ejercicios) {
          if (ej.animacion && !imagenes[ej.animacion]) {
            const res = await fetch(
              `http://127.0.0.1:8000/api/imagenes/${ej.animacion}/`
            );
            const data = await res.json();
            nuevas[ej.animacion] = data.url;
          }
        }

        setImagenes((prev) => ({ ...prev, ...nuevas }));
      } catch (err) {
        console.error("Error cargando imágenes:", err);
      }
    };

    if (ejercicios.length > 0) fetchImagenes();
  }, [ejercicios]);

  // Filtros
  const categorias = useMemo(() => {
    const setCat = new Set();
    ejercicios.forEach(e => {
      if (e.categoria && e.categoria.trim() !== "") {
        setCat.add(e.categoria);
      }
    });
    return Array.from(setCat);
  }, [ejercicios]);

  const ejerciciosFiltrados = useMemo(() => {
  return ejercicios.filter((item) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!String(item.nombre).toLowerCase().includes(q)) return false;
    }

    if (selectedSemana !== "all") {
      const s = Number(item.sug_semanas);
      if (selectedSemana === "1-12" && !(s >= 1 && s <= 12)) return false;
      if (selectedSemana === "13-27" && !(s >= 13 && s <= 27)) return false;
      if (selectedSemana === "28-40" && !(s >= 28 && s <= 40)) return false;
    }

    if (selectedNivel !== "all") {
      if (Number(item.nivel_esfuerzo) !== Number(selectedNivel)) return false;
    }

    // ⭐ Filtro por categoría
    if (selectedCategoria !== "all") {
      if (item.categoria !== selectedCategoria) return false;
    }

    return true;
  });
}, [ejercicios, query, selectedSemana, selectedNivel, selectedCategoria]);

  // PAGINACIÓN
  const totalPaginas = Math.ceil(ejerciciosFiltrados.length / ejerciciosPorPagina);
  const indexUltimo = paginaActual * ejerciciosPorPagina;
  const indexPrimero = indexUltimo - ejerciciosPorPagina;
  const ejerciciosPaginados = ejerciciosFiltrados.slice(indexPrimero, indexUltimo);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>

      <NavbarE />

      {/* Fondo superior con imagen */}
      <div
        className="mt-20 w-full h-60 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${Ejercicio_Idx})` }}
      >
        {/* Capa oscura para que se lea el texto */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Frase motivadora */}
        <h2 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold drop-shadow-lg px-4 text-center">
          ¡Cada paso cuenta, y tú puedes lograrlo!
        </h2>
      </div>

      <div className="mt-28 px-6">
        {/* enlaces arriba */}
        <div className="flex items-center gap-8 mb-6">
          {/* <a
            href="/Ejercicios"
            className="text-2xl text-[#A83279] font-bold relative group"
          >
            Mis Ejercicios
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
          </a> */}

          <a
            href="/AllEjercicios"
            className="text-2xl text-gray-500 font-bold relative group"
          >
            Todos los ejercicios
            <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
          />

          <select
            value={selectedSemana}
            onChange={(e) => setSelectedSemana(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Filtrar por semanas</option>
            <option value="1-12">1 - 12 (1er trimestre)</option>
            <option value="13-27">13 - 27 (2do trimestre)</option>
            <option value="28-40">28 - 40 (3er trimestre)</option>
          </select>

          <select
            value={selectedNivel}
            onChange={(e) => setSelectedNivel(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Filtrar por nivel</option>
            <option value="1">1 - Bajo</option>
            <option value="2">2 - Moderado</option>
            <option value="3">3 - Alto</option>
          </select>

          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Filtrar por categoría</option>

            {categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setQuery("");
              setSelectedSemana("all");
              setSelectedNivel("all");
              setSelectedCategoria("all");
            }}
            className="ml-auto px-4 py-2 bg-gray-100 rounded-lg"
          >
            Limpiar
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <p>Cargando ejercicios...</p>
        ) : ejerciciosFiltrados.length === 0 ? (
          <p>No se encontraron ejercicios.</p>
        ) : (
          <motion.div
            key={paginaActual}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ejerciciosPaginados.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="p-4 bg-white shadow rounded-2xl hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-xl mb-2 text-[#F39F9F]">
                  {item.nombre}
                </h2>

                {imagenes[item.animacion] && (
                  <img
                    src={imagenes[item.animacion]}
                    alt={item.nombre}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                <p className="text-sm text-gray-600 mb-3">{item.descripcion}</p>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>
                    <strong>Nivel:</strong> {item.nivel_esfuerzo}
                  </span>
                  <span>
                    <strong>Semana:</strong> {item.sug_semanas}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8 flex-wrap">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className={`px-3 py-2 rounded-lg font-semibold ${
                paginaActual === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#F39F9F] text-white hover:bg-[#d57a7a]"
              }`}
            >
              ←
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => cambiarPagina(num)}
                className={`px-4 py-2 rounded-lg font-semibold border ${
                  paginaActual === num
                    ? "bg-[#F39F9F] text-white border-[#F39F9F]"
                    : "bg-white text-[#F39F9F] border-[#F39F9F] hover:bg-[#F39F9F] hover:text-white"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className={`px-3 py-2 rounded-lg font-semibold ${
                paginaActual === totalPaginas
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#F39F9F] text-white hover:bg-[#d57a7a]"
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </main>
  );
}