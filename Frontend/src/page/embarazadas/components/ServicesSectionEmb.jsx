// ServicesSection (PrenFit version)
import React from 'react'
import { BsStack } from 'react-icons/bs'
import { HiLightBulb } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { BiTime } from 'react-icons/bi'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../../utils/motion";

const ServicesSection = () => {
  const services = [
    {
      icon: <BsStack className="w-8 h-8 text-[#BA487F]" />, // Página web
      title: "Primer trimestre",
      description: "Rutinas suaves enfocadas en movilidad, respiración y adaptación segura al embarazo.",
      link: "#primer-trimestre"
    },
    {
      icon: <HiLightBulb className="w-8 h-8 text-[#FF9587]" />, // Ejercicios
      title: "Segundo trimestre",
      description: "Ejercicios de bajo impacto, fuerza ligera y equilibrio para acompañar el crecimiento del bebé.",
      link: "#segundo-trimestre"
    },
    {
      icon: <FiSettings className="w-8 h-8 text-[#B95E82]" />, // Rutinas
      title: "Tercer trimestre",
      description: "Movimientos para aliviar presión lumbar, fortalecer el piso pélvico y prepararte para el parto.",
      link: "#tercer-trimestre"
    },
    {
      icon: <BiTime className="w-8 h-8 text-[#F39F9F]" />, // Estadísticas
      title: "Postparto",
      description: "Rutinas suaves para recuperar fuerza, trabajar abdomen profundo y reconectar con tu cuerpo.",
      link: "#postparto"
    }
  ]

  return (
    <section id="services" className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={fadeIn('up', 0.3)}
        className='flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24'
      >
        {/* Header */}
        <motion.div 
          variants={fadeIn('right', 0.4)}
          className="md:w-1/3"
        >
          <motion.h2
            variants={textVariant(0.2)}
            className="text-3xl md:text-4xl font-bold mb-6 md:w-4/5 text-[#722323]"
          >
            Todo lo que necesitas para mejorar con PrenFit
          </motion.h2>

          <motion.p 
            variants={fadeIn('up', 0.5)}
            className="text-gray-600 text-lg mb-4 md:w-4/5"
          >
            Herramientas inteligentes diseñadas para ayudarte a progresar de forma real y constante.
          </motion.p>

          <motion.div variants={fadeIn('up', 0.6)} className="space-y-3">
            <motion.div variants={fadeIn('right', 0.7)} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FFECC0] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#BA487F]"></div>
              </div>
              <span className="text-gray-600">Planes personalizados</span>
            </motion.div>

            {/* <motion.div variants={fadeIn('right', 0.8)} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FFECCC] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#722323]"></div>
              </div>
              <span className="text-gray-600">Seguimiento en tiempo real</span>
            </motion.div> */}
          </motion.div>

          <motion.button 
            variants={fadeIn('up', 0.9)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-[#BA487F] text-white px-8 py-3 cursor-pointer rounded-full hover:bg-[#8e345f] transition-colors"
          >
            Comenzar ahora
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <motion.div variants={fadeIn('left', 0.4)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 0.3 * (index + 1))}
              whileHover={{ scale: 1.05 }}
              className="bg-white max-w-72 cursor-pointer rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div variants={fadeIn('down', 0.4 * (index + 1))} className="mb-4">
                {service.icon}
              </motion.div>

              <motion.h3 variants={textVariant(0.3)} className="text-xl font-semibold mb-2 text-[#722323]">
                {service.title}
              </motion.h3>

              <motion.p variants={fadeIn('up', 0.5 * (index + 1))} className="text-gray-600 mb-4">
                {service.description}
              </motion.p>

              <motion.a
                variants={fadeIn('up', 0.6 * (index + 1))}
                href={service.link}
                className="text-[#BA487F] font-medium hover:text-[#722323] transition-colors"
              >
                Saber más
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default ServicesSection;
