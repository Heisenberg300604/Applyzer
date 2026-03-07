import Navbar from '@/components/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import DashboardScrollSection from '@/components/landing/DashboardScrollSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CTASection from '@/components/landing/CTASection'

export default function Landing() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <DashboardScrollSection />
                <HowItWorksSection />
                <FeaturesSection />
                <CTASection />
            </main>
        </div>
    )
}
