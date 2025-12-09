import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const PurposeSection = () => {
  const features = [
    {
      icon: "💪",
      title: "Diseñado para tu progreso",
      description: "Creamos rutinas y planes personalizados para que avances de forma constante y segura."
    },
    {
      icon: "🔥",
      title: "Siempre en sintonía contigo",
      description: "PrenFit se adapta a tu ritmo, tus objetivos y tus necesidades, ofreciéndote una experiencia totalmente personalizada."
    }
  ];

  return (
    <section id="about" className="w-full bg-[#FFECCC] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          variants={fadeIn('right', 0.2)}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 grid-cols-1 gap-8"
        >
          <motion.div variants={fadeIn('right', 0.3)}>
            <motion.div 
              variants={fadeIn('up', 0.4)}
              className="text-sm font-medium mb-2 text-[#BA487F]"
            >
              LOGRA MÁS
            </motion.div>

            <motion.h2 
              variants={textVariant(0.5)}
              className="text-3xl md:w-4/5 md:text-4xl font-bold text-[#722323]"
            >
              El propósito de PrenFit es ayudarte a alcanzar tu mejor versión
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={fadeIn('left', 0.3)}
            className="col-span-2 grid grid-cols-1 md:grid-cols-2 justify-between gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn('up', 0.3 * (index + 1))}
                className="flex items-start space-x-4"
              >
                <motion.div 
                  variants={fadeIn('right', 0.4 * (index + 1))}
                  className="w-12 h-12 flex items-center justify-center text-3xl rounded-xl bg-[#FF9587]/30 text-[#722323]"
                >
                  {feature.icon}
                </motion.div>

                <motion.div variants={fadeIn('left', 0.4 * (index + 1))}>
                  <motion.h3 
                    variants={textVariant(0.3)}
                    className="text-xl font-semibold mb-2 text-[#722323]"
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p 
                    variants={fadeIn('up', 0.4)}
                    className="text-[#722323]/80"
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PurposeSection;
