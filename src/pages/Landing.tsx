import Navbar from '@/components/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CategoriesSection from '@/components/landing/CategoriesSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function Landing() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                <TestimonialsSection />
                <CategoriesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
