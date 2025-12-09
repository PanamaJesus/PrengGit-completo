import scheduleImage from "../assets/stats.webp";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const ScheduleSection = () => {
  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className="max-w-7xl mx-auto px-4 py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
        {/* Imagen lateral */}
        <motion.div variants={fadeIn("right", 0.3)} className="w-full md:w-1/2">
          <motion.img
            variants={fadeIn("up", 0.4)}
            src={scheduleImage}
            alt="Estadísticas de progreso"
            className="w-full h-auto rounded-xl"
          />
        </motion.div>

        {/* Contenido derecho */}
        <motion.div variants={fadeIn("left", 0.3)} className="w-full md:w-1/2">
          <motion.span
            variants={fadeIn("up", 0.4)}
            className="font-semibold text-[#BA487F]"
          >
            ESTADÍSTICAS
          </motion.span>

          <motion.h2
            variants={textVariant(0.5)}
            className="text-3xl md:text-4xl font-bold text-[#722323] mt-4 mb-6"
          >
            Conoce tu avance con métricas claras <br /> y monitoreo inteligente
          </motion.h2>

          <motion.p
            variants={fadeIn("up", 0.6)}
            className="text-[#722323]/70 mb-8"
          >
            PrenFit analiza tu rendimiento y genera rutinas basadas en datos reales como tu ritmo cardíaco, tiempo de actividad, intensidad de entrenamientos y consistencia semanal. Observa tu progreso en gráficas fáciles de entender y mantén tu motivación al máximo.
          </motion.p>

          <motion.a
            variants={fadeIn("up", 0.7)}
            href="#"
            className="text-[#BA487F] font-semibold flex items-center gap-2 hover:gap-4 transition-all cursor-pointer"
          >
            Descubre cómo funcionan las estadísticas
            <motion.svg
              variants={fadeIn("left", 0.8)}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ScheduleSection;
