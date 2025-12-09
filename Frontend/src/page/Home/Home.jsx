import '../../App.css'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import PurposeSection from '../../components/PurposeSection'
import FeaturesSection from '../../components/FeaturesSection'
import ScheduleSection from '../../components/ScheduleSection'
import MonitorSection from '../../components/MonitorSection'
import PricingSection from '../../components/PricingSection'
import ServicesSection from '../../components/ServicesSection'
import TestimonialsSection from '../../components/TestimonialsSection'
import NewsletterSection from '../../components/NewsletterSection'
import Footer from '../../components/Footer'

function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
            <div className="absolute -top-28 -left-28 w-[500px] h-screen bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        <Navbar />
        <Hero />
        <PurposeSection />
        <FeaturesSection />
        <ScheduleSection />
        {/* <MonitorSection />
        <PricingSection /> */}
        <ServicesSection />
        {/* <TestimonialsSection /> */}
        {/* <NewsletterSection /> */}
        <Footer />
      </div>
    </main>
  )
}

export default Home

// import React from "react";
// import { Link } from "react-router-dom";

// function Home() {
//   return (
//     <div className="p-6 text-center">
//       <h1 className="text-3xl font-bold mb-6">Bienvenida a PrenaFit</h1>
//       <div className="flex justify-center gap-4">
//         <Link
//           to="/admin"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Ir a Admin
//         </Link>
//         <Link
//           to="/contenido"
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Ver Contenido
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;
