// utils/motion.js
// Funciones de animación para usar con Framer Motion o CSS transitions

export const motion = {
  fadeIn: (direction = 'up', delay = 0) => ({
    initial: { 
      opacity: 0, 
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 
    },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: 0.5, delay }
  }),
  
  slideIn: (direction = 'left', delay = 0) => ({
    initial: { 
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      opacity: 0 
    },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, delay }
  }),
  
  scaleIn: (delay = 0) => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.4, delay }
  }),

  staggerContainer: (staggerChildren = 0.1, delayChildren = 0) => ({
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  })
};

export default motion;