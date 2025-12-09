import React from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const Footer = () => {
  const footerLinks = {
    empresa: [
      { name: 'Sobre Prenfit', href: '#' },
      { name: 'Términos de Uso', href: '#' },
      { name: 'Política de Privacidad', href: '#' },
      { name: 'Cómo Funciona', href: '#' },
      { name: 'Contáctanos', href: '#' },
    ],
    ayuda: [
      { name: 'Soporte Técnico', href: '#' },
      { name: 'Atención 24/7', href: '#' },
      { name: 'Chat Rápido', href: '#' },
    ],
    soporte: [
      { name: 'Preguntas Frecuentes', href: '#' },
      { name: 'Políticas', href: '#' },
      { name: 'Para Negocios', href: '#' },
    ],
    contacto: [
      { name: 'WhatsApp', href: '#' },
      { name: 'Soporte 24h', href: '#' },
    ],
  };

  return (
    <motion.footer 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      className="bg-[#FFECCC] mt-20"
    >
      <div className="w-full px-6 py-8">

        <motion.div 
          variants={fadeIn('up', 0.3)}
          className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand / Logo */}
          <motion.div 
            variants={fadeIn('right', 0.4)}
            className="lg:col-span-4"
          >
            <motion.div 
              variants={fadeIn('down', 0.5)}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-4 h-4 bg-[#BA487F] rounded-full opacity-80"></div>
              <div className="w-4 h-4 bg-[#FF9587] rounded-full -ml-2"></div>
              <span className="text-xl font-semibold ml-1 text-[#722323]">
                Prenfit
              </span>
            </motion.div>

            <motion.p 
              variants={fadeIn('up', 0.6)}
              className="text-[#722323] opacity-80 mb-6"
            >
              Prenfit te acompaña en cada paso de tu progreso: rutinas personalizadas,
              seguimiento inteligente y herramientas creadas para mejorar tu rendimiento.
            </motion.p>

            {/* Social icons */}
            <motion.div 
              variants={fadeIn('up', 0.7)}
              className="flex gap-4"
            >
              <motion.a 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-[#FFC29B] rounded-full flex items-center justify-center text-[#722323] hover:bg-[#BA487F] hover:text-white transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-[#FFC29B] rounded-full flex items-center justify-center text-[#722323] hover:bg-[#BA487F] hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-[#FFC29B] rounded-full flex items-center justify-center text-[#722323] hover:bg-[#BA487F] hover:text-white transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Links */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links], indexCat) => (
                <motion.div 
                  key={category}
                  variants={fadeIn('up', 0.3 * (indexCat + 1))}
                >
                  <motion.h3 
                    variants={textVariant(0.2)}
                    className="text-lg font-semibold mb-4 text-[#722323]"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.h3>

                  <motion.ul 
                    variants={fadeIn('up', 0.4)}
                    className="space-y-3"
                  >
                    {links.map((link, index) => (
                      <motion.li 
                        key={index}
                        variants={fadeIn('up', 0.1 * (index + 1))}
                      >
                        <motion.a 
                          whileHover={{ x: 5 }}
                          className="text-[#722323] opacity-80 hover:text-[#BA487F] transition-colors"
                        >
                          {link.name}
                        </motion.a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          variants={fadeIn('up', 0.8)}
          className="border-t border-[#FFC29B] mt-12 pt-8"
        >
          <motion.div 
            variants={fadeIn('up', 0.9)}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-[#722323] opacity-80 text-sm">
              © {new Date().getFullYear()} Prenfit — Todos los derechos reservados.
            </p>
            <p className="text-[#722323] opacity-80 text-sm">
              Diseñado con ❤️ para tu bienestar.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
