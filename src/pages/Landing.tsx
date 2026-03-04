import Navbar from '@/components/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import CategoriesSection from '@/components/landing/CategoriesSection'
import GlobalReachSection from '@/components/landing/GlobalReachSection'
import InsightsSection from '@/components/landing/InsightsSection'
import Footer from '@/components/landing/Footer'

export default function Landing() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                <CategoriesSection />
                <GlobalReachSection />
                <InsightsSection />
            </main>
            <Footer />
        </div>
    )
}
