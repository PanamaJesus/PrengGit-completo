import React, { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { motion } from "framer-motion";
import { fadeIn } from '../../utils/motion';

const NavbarE = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('#home')

  const navLinks = [
    { href: "/IdxEmb", label: "Inicio" },
    { href: "/Estadisticas", label: "Signos vitales" },
    { href: "/Rutinas", label: "Rutinas" },
    { href: "/AllEjercicios", label: "Ejercicios" },
    { href: "/TiposContenido", label: "Contenido Educativo" },
  ]

  const handleLogout = () => {
  localStorage.removeItem("accessToken","refreshToken","usuario");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
  window.location.href = "/#"; 
};

  return (
    <motion.nav 
      variants={fadeIn('down', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm"
    >
      <div className="w-full flex justify-between items-center max-w-none mx-0 sm:px-6 lg:px-8 md:h-20 h-16">
        {/* Logo */}
        <motion.div 
          variants={fadeIn('right', 0.3)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-4 h-4 bg-[#A83279] rounded-full opacity-75 hover:opacity-100 transition-opacity"
          ></motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-4 h-4 bg-[#F39F9F] rounded-full -ml-2 hover:opacity-75 transition-opacity"
          ></motion.div>
        </motion.div>
        {/* Mobile Menu Button */}
        <motion.button 
          variants={fadeIn('left', 0.3)}
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </motion.button>

        {/* Navigation Links - Desktop */}
        <motion.div 
          variants={fadeIn('down', 0.3)}
          className="hidden md:flex items-center gap-10"
        >
          {navLinks.map((link, index) => (
            <motion.a 
              key={index}
              variants={fadeIn('down', 0.1 * (index + 1))}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#A83279] after:transition-all
                ${activeLink === link.href ? 'text-blue-600 after:w-full  ' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div className="flex items-center display-flex">
        <motion.button 
          variants={fadeIn('left', 0.3)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block bg-[#F39F9F] text-white px-6 py-2.5 rounded-lg hover:bg-[#FFC29B] text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100"
        >
          <a href="/Profile">Perfil</a>
        </motion.button>
        <motion.button 
          variants={fadeIn('left', 0.3)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="hidden md:block bg-[#BA487F] text-white px-6 py-2.5 rounded-lg hover:bg-[#722323] text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-100 ml-3"
        >
          Cerrar sesión
        </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          variants={fadeIn('down', 0.2)}
          initial="hidden"
          animate="show"
          className="md:hidden bg-white border-t border-gray-100 py-4"
        >
          <motion.div 
            variants={fadeIn('down', 0.3)}
            className="px-4 space-y-4"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={index}
                variants={fadeIn('right', 0.1 * (index + 1))}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-medium py-2
                  ${activeLink === link.href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button 
              variants={fadeIn('up', 0.4)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#A83279] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100"
            >
              Get in touch
            </motion.button>
            <motion.button 
              variants={fadeIn('up', 0.4)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-100"
            >
              Cerrar sesión
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default NavbarE