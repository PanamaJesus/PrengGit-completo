import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../App.css";
import NavbarE from "./NavEmb";
import Footer from '../../components/Footer'
import Ejercicio_Idx from '../../assets/fit4.jpg'

function Ejercicios() {
  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id : null;

  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [semanaUsuario, setSemanaUsuario] = useState(null);
  const [imagenes, setImagenes] = useState({});

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ejercicio/");
        const data = await response.json();
        setEjercicios(data);
      } catch (error) {
        console.error("Error al cargar ejercicios:", error);
      }
    };

    fetchEjercicios();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/usuario/${userId}/`
        );
        const data = await response.json();
        setSemanaUsuario(data.semana_embarazo);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const nuevasImagenes = {};

        for (const ej of ejercicios) {
          if (ej.animacion && !imagenes[ej.animacion]) {
            const res = await fetch(
              `http://127.0.0.1:8000/api/imagenes/${ej.animacion}/`
            );
            const data = await res.json();

            nuevasImagenes[ej.animacion] = data.url;
          }
        }

        setImagenes((prev) => ({ ...prev, ...nuevasImagenes }));
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      }
    };

    if (ejercicios.length > 0) fetchImagenes();
  }, [ejercicios]);

  const ejerciciosDelUsuario = ejercicios.filter(
    (item) => String(item.usuario) === String(userId)
  );

  let ejerciciosPorSemana = [];

  if (semanaUsuario >= 1 && semanaUsuario <= 12) {
    ejerciciosPorSemana = ejerciciosDelUsuario.filter(
      (item) => item.sug_semanas >= 1 && item.sug_semanas <= 12
    );
  } else if (semanaUsuario >= 13 && semanaUsuario <= 27) {
    ejerciciosPorSemana = ejerciciosDelUsuario.filter(
      (item) => item.sug_semanas >= 13 && item.sug_semanas <= 27
    );
  } else if (semanaUsuario >= 28 && semanaUsuario <= 40) {
    ejerciciosPorSemana = ejerciciosDelUsuario.filter(
      (item) => item.sug_semanas >= 28 && item.sug_semanas <= 40
    );
  }

  // 🔥 PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const ejerciciosPorPagina = 6;

  const totalPaginas = Math.ceil(
    ejerciciosPorSemana.length / ejerciciosPorPagina
  );

  const indexUltimo = paginaActual * ejerciciosPorPagina;
  const indexPrimero = indexUltimo - ejerciciosPorPagina;
  const ejerciciosPaginados = ejerciciosPorSemana.slice(
    indexPrimero,
    indexUltimo
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-screen bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
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

        <div className="mt-20 px-6 center">
          <div className="flex items-center gap-8 mb-6">
            <a
              href="#mis-ejercicios"
              className="text-2xl text-gray-500 font-bold relative group"
            >
              Mis Ejercicios
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="/AllEjercicios"
              className="text-2xl text-[#A83279]  font-bold relative group"
            >
              Todos los ejercicios
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F]  transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {loading && <p>Cargando ejercicios...</p>}

          {!loading && ejerciciosPorSemana.length === 0 && (
            <p>No tienes ejercicios disponibles para tu semana de embarazo.</p>
          )}

          {/*⭐ GRID CON ANIMACIÓN SMOOTH (fade + slide)*/}
          <motion.div
            key={paginaActual} // clave para animación al cambiar de página
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
                  delay: index * 0.1, // pequeño delay para efecto cascada
                }}
                className="p-4 bg-white/40 backdrop-blur-lg rounded-xl shadow-md"
              >
                <h2 className="text-[#F39F9F] font-semibold text-xl">
                  {item.nombre}
                </h2>

                {imagenes[item.animacion] && (
                  <img
                    src={imagenes[item.animacion]}
                    alt={item.nombre}
                    className="w-full h-48 object-cover rounded-lg mt-3"
                  />
                )}

                <p className="mt-2 text-sm">{item.descripcion}</p>

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

          {/* 🔥 PAGINACIÓN CON BOTONES */}
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

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => cambiarPagina(num)}
                    className={`px-4 py-2 rounded-lg font-semibold border ${
                      paginaActual === num
                        ? "bg-[#F39F9F] text-white border-[#F39F9F]"
                        : "bg-white/40 text-[#F39F9F] border-[#F39F9F] hover:bg-[#F39F9F] hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

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
      </div>
       <Footer />
    </main>
  );
}

export default Ejercicios;