import BarCard from "../../../components/charts/BarCard";
import LineCard from "../../../components/charts/LineCard";
import NavbarE from '../NavEmb'
import Footer from '../../../components/Footer'
import UltimasLecturas from "./UltimasLecturas";
import DatosRutinas from "./DatosRutinas";
import HistogramaRutinas from "../../../components/charts/HistogramaRutinas";
import { div } from "framer-motion/client";

function IndexEstadisticas() {

  return (
    <div>
    <NavbarE />
    <main className="w-full overflow-x-hidden flex flex-col relative pt-20 md:pt-24">

      

      {/* 🌈 Fondo decorativo (NO ENCERRAR CONTENIDO) */}
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] 
        bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 
        rounded-full blur-[80px] -z-10">
      </div>

      {/* CONTENIDO REAL */}
      <div className="flex-1 w-full px-6 py-10">

        <h1 className="text-4xl font-extrabold text-gray-500 mb-8">
          Signos vitales y Estadísticas
        </h1>

        

        {/* 🔥 SECCIÓN DE SIGNOS VITALES */}
        <UltimasLecturas />

        {/* 🔥 SECCIÓN DE RUTINAS */}
        <DatosRutinas />
        

        <HistogramaRutinas/>


      </div>

      <div className="absolute -top-28 -left-28 w-[500px] h-screen bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10">
      </div>
    </main>
      <Footer />
    </div>
  );
}

export default IndexEstadisticas;
