import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🏋️‍♀️",
      title: "Rutinas personalizadas",
      description: "Planes de entrenamiento adaptados a tu nivel, objetivos y tiempo disponible.",
      bg: "#FF9587" // Paleta 1
    },
    {
      icon: "📊",
      title: "Seguimiento de progreso",
      description: "Registra tus avances y visualiza tu evolución con métricas claras y motivadoras.",
      bg: "#F39F9F" // Paleta 2
    },
    {
      icon: "💡",
      title: "Recomendaciones inteligentes",
      description: "Recibe sugerencias basadas en tu rendimiento y hábitos para mejorar día a día.",
      bg: "#BA487F" // Paleta 1
    }
  ];

  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className=" mx-auto px-4 py-16"
    >
      <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-12">
        <motion.h2 variants={textVariant(0.2)} className="text-3xl font-bold mb-4 text-[#722323]">
          ¿Cómo te ayuda PrenFit?
        </motion.h2>
        <motion.p variants={fadeIn("up", 0.4)} className="text-[#722323]/70">
          Herramientas inteligentes diseñadas para mejorar tu rendimiento y mantenerte motivada.
        </motion.p>
      </motion.div>

      <motion.div variants={fadeIn("up", 0.5)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeIn("up", 0.3 * (index + 1))}
            className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-[#FFECCC]"
          >
            <motion.div
              variants={fadeIn("down", 0.4 * (index + 1))}
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-4xl"
              style={{ backgroundColor: feature.bg }}
            >
              {feature.icon}
            </motion.div>

            <motion.h3 variants={textVariant(0.3)} className="text-2xl font-semibold text-[#722323] mb-3 text-center">
              {feature.title}
            </motion.h3>

            <motion.p variants={fadeIn("up", 0.6 * (index + 1))} className="text-[#722323]/70 text-center">
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeIn("up", 0.7)} className="text-center mt-12">
        <motion.button
          variants={fadeIn("up", 0.8)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#BA487F] text-white cursor-pointer px-8 py-3 rounded-full font-medium hover:bg-[#722323] transition-colors relative"
        >
          Empezar ahora
          <div className="absolute -z-10 w-full h-full rounded-full bg-[#BA487F]/40 blur-xl top-0 left-0"></div>
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default FeaturesSection;
