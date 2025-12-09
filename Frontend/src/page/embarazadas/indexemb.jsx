import '../../App.css'
import NavbarE from './NavEmb'
import Footer from '../../components/Footer'
import HeroEmb from '../embarazadas/components/HeroEmb'
import PorpuseSection from '../embarazadas/components/PurposeSectionEmb'
import FeaturesSection from '../embarazadas/components/FeaturesSectionEmb'
import ServicesSection from '../embarazadas/components/ServicesSectionEmb'

function IdxEmb() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        <NavbarE/>
        <HeroEmb/>
        <PorpuseSection/>
        <FeaturesSection />
        <ServicesSection />
        <Footer />
      </div>
    </main>
  )
}

export default IdxEmb
 