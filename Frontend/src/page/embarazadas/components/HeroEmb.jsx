import React from 'react'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../../utils/motion";
import heroImage from '../../../assets/hero-image.png'

const Hero = () => {
  return (
    <section id="home" className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 pt-44 pb-16 container mx-auto">
      
      {/* Left Column */}
      <div className="w-full md:w-1/2 space-y-8">
        
        <motion.div variants={fadeIn('right', 0.2)} initial="hidden" whileInView="show">
          {/* Star badge */}
          <div className="flex items-center gap-2 bg-[#FFECCC] w-fit px-4 py-2 rounded-full hover:bg-[#FF9587]/20 transition-colors cursor-pointer group">
            <span className="text-[#BA487F] group-hover:scale-110 transition-transform">★</span>
            <span className="text-sm font-medium text-[#722323]">PrenFit — Fitness Intelligence</span>
          </div>
        </motion.div>

        <motion.h1 
          variants={textVariant(0.3)}
          initial="hidden"
          whileInView="show"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#722323]"
        >
          Transforma tu cuerpo con{' '}
          <span className="relative inline-block text-[#BA487F]">
            ejercicios personalizados 
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9587]/60"></span>
          </span>{' '}
          y seguimiento real. 
          <span className="inline-block ml-2 animate-pulse"></span>
        </motion.h1>

        <motion.p 
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          className="text-[#722323]/80 text-lg md:text-xl max-w-xl"
        >
          Bienvenida a nuestro espacio diseñado especialmente para acompañarte durante tu embarazo. Aquí encontrarás rutinas seguras, explicadas paso a paso, para mantenerte activa, fortalecer tu cuerpo y prepararte para cada etapa de la maternidad.
        </motion.p>

      </div>

      {/* Right Column - Images */}
      <motion.div 
        variants={fadeIn('left', 0.5)}
        initial="hidden"
        whileInView="show"
        className="w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12"
      >
        <div className="relative">
          <img
            src={heroImage}
            alt="PrenFit fitness dashboard"
            className="rounded-lg relative z-10 hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </motion.div>

    </section>
  )
}

export default Hero
