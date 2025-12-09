import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import NavbarE from '../embarazadas/NavEmb';
import Footer from '../../components/Footer';
import infografia from '../../assets/infografia_idx.png';

function TiposContenido() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tipotema/")
      .then((response) => response.json())
      .then((data) => {
        setTipos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando los tipos de contenido:", error);
        setLoading(false);
      });
  }, []);

  const filtrados = tipos.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Fondo decorativo */}
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>

      <div className="overflow-hidden">
        <NavbarE />

        <div className="mt-28 px-6 max-w-7xl mx-auto">

          {/* Enlace superior */}
          <div className="flex items-center gap-8 mb-6">
            <a
              href="/TiposContenido"
              className="text-2xl text-[#A83279] font-bold relative group"
            >
              Temas
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* GRID: Texto + imagen (1/3) y barra + cards (2/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* IZQUIERDA 1/3 */}
            <div className="md:col-span-1">
              <p className="mb-4 text-justify">
                Este espacio ha sido creado pensando en ti y en tu bienestar durante el embarazo.
                Aquí encontrarás información sencilla, ejercicios seguros y recomendaciones que te ayudarán
                a moverte con confianza y cuidar tu cuerpo en cada etapa.
              </p>

              {/* Imagen */}
              <img
                src={infografia}
                alt="Infografía"
                className="rounded-lg shadow-md w-full"
              />
            </div>

            {/* DERECHA 2/3 */}
            <div className="md:col-span-2">

              {/* Barra de búsqueda */}
              <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-3 items-center mb-6">

                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
                />

                <button
                  onClick={() => setBusqueda("")}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Limpiar
                </button>
              </div>

              {/* GRID DE CARDS */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <p>Cargando contenido...</p>
                ) : (
                  filtrados.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
                    >
                      <h2 className="text-lg font-semibold text-[#BA487F]">
                        {item.nombre}
                      </h2>

                      <p className="text-gray-600 mb-3 text-justify">
                        {item.descripcion}
                      </p>

                      {/* BOTÓN QUE REDIRIGE AL CONTENIDO POR TEMA */}
                      <button
                        onClick={() => navigate(`/contenido/tema/${item.id}`)}
                        className="mt-2 inline-block px-4 py-2 bg-[#F39F9F] text-white rounded hover:bg-[#FFC29B] transition"
                      >
                        Ver contenido
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

        </div>

        <Footer />
      </div>
    </main>
  );
}

export default TiposContenido;

// import { useEffect, useState } from "react";
// import NavbarE from '../embarazadas/NavEmb';
// import Footer from '../../components/Footer';
// import infografia from '../../assets/infografia_idx.png';

// function TiposContenido() {
//   const [tipos, setTipos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/tipotema/")
//       .then((response) => response.json())
//       .then((data) => {
//         setTipos(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error cargando los tipos de contenido:", error);
//         setLoading(false);
//       });
//   }, []);

//   const filtrados = tipos.filter((t) =>
//     t.nombre.toLowerCase().includes(busqueda.toLowerCase())
//   );

//   return (
//     <main className="relative min-h-screen overflow-x-hidden">
//       <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>

//       <div className="overflow-hidden">
//         <NavbarE />

//         <div className="mt-28 px-6">
//              {/* enlaces arriba */}
//             <div className="flex items-center gap-8 mb-6">
//             <a
//                 href="/TiposContenido"
//                 className="text-2xl text-[#A83279] font-bold relative group"
//             >
//                 Contenido Educativo
//                 <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#F39F9F] transition-all duration-300 group-hover:w-full"></span>
//             </a>
//             </div>


//           {/* GRID DE TEXTO + BARRA (1/3 + 2/3) */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

//             {/* 🟣 COLUMNA IZQUIERDA (1/3) */}
//             <div className="md:col-span-1">
//               <p className="mb-4 text-justify">
//                 Este espacio ha sido creado pensando en ti y en tu bienestar durante el embarazo.
//                 Aquí encontrarás información sencilla, ejercicios seguros y recomendaciones que te ayudarán
//                 a moverte con confianza y cuidar tu cuerpo en cada etapa.
//                 </p>

//               {/* IMAGEN debajo del párrafo */}
//               <img
//                 src={infografia}
//                 alt="Infografía"
//                 className="rounded-lg shadow-md w-full"
//               />
//             </div>

//             {/* 🔵 COLUMNA DERECHA (2/3) - Barra de búsqueda */}
//             <div className="md:col-span-2">
//               <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-3 items-center mb-6">

//                 {/* Barra de búsqueda */}
//                 <input
//                   type="text"
//                   placeholder="Buscar por nombre..."
//                   value={busqueda}
//                   onChange={(e) => setBusqueda(e.target.value)}
//                   className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
//                 />

//                 {/* Botón limpiar */}
//                 <button
//                   onClick={() => setBusqueda("")}
//                   className="px-4 py-2 bg-gray-100 rounded-lg"
//                 >
//                   Limpiar
//                 </button>
//               </div>

//               {/* GRID DE CARDS - debajo de la barra */}
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {loading ? (
//                   <p>Cargando contenido...</p>
//                 ) : (
//                   filtrados.map((item) => (
//                     <div
//                       key={item.id}
//                       className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
//                     >
//                       <h2 className="text-lg font-semibold text-[#BA487F] ">{item.nombre}</h2>
//                       <p className="text-gray-600 mb-3 text-justify">{item.descripcion}</p>

//                       <button className="mt-2 inline-block px-4 py-2 bg-[#F39F9F] text-white rounded hover:bg-[#FFC29B] transition">
//                         Ver contenido
//                       </button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>

//         <Footer />
//       </div>
//     </main>
//   );
// }

// export default TiposContenido;