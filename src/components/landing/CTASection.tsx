import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Main CTA Card - Border, no background */}
        <div className="border-2 border-black p-12 md:p-20">
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 text-center mb-6 leading-tight">
            Ready to Beat the ATS?
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 text-center mb-4 max-w-3xl mx-auto">
            Submit your resume and get your <span className="text-orange-500 font-bold">ATS Match Score</span> instantly
          </p>

          {/* Supporting text */}
          <p className="text-base text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            See exactly how recruiters see your profile. Get actionable insights to optimize your resume for any job description.
          </p>

          {/* Big CTA Button */}
          <div className="flex justify-center">
            <Link to="/sign-up" className="w-full max-w-md">
              <InteractiveHoverButton className="w-full text-lg md:text-xl py-6 md:py-8 px-12 uppercase tracking-wider font-bold">
                <Upload className="w-6 h-6 mr-3" />
                Check My ATS Score
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          Join thousands of developers who landed their dream jobs with ApplyBot
        </p>
      </div>
    </section>
  );
}
