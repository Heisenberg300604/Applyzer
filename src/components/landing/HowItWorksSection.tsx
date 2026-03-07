import DisplayCards from "@/components/ui/display-cards";
import { FileText, Send, BarChart3 } from "lucide-react";

export default function HowItWorksSection() {
  const workflowCards = [
    {
      icon: <FileText className="size-4 text-white" />,
      title: "Step 1: Upload Profile",
      description: "Add your resume and career history",
      date: "30 seconds",
      iconClassName: "bg-orange-500",
      titleClassName: "text-orange-500 font-semibold",
      className:
        "[grid-area:stack] hover:-translate-y-10 scale-125",
    },
    {
      icon: <Send className="size-4 text-white" />,
      title: "Step 2: AI Matches Jobs",
      description: "TF-IDF scoring finds perfect roles",
      date: "Instant",
      iconClassName: "bg-orange-500",
      titleClassName: "text-orange-500 font-semibold",
      className:
        "[grid-area:stack] translate-x-20 translate-y-12 hover:-translate-y-1 scale-125",
    },
    {
      icon: <BarChart3 className="size-4 text-white" />,
      title: "Step 3: Auto-Apply & Track",
      description: "Gmail sends + tracks replies",
      date: "Automated",
      iconClassName: "bg-orange-500",
      titleClassName: "text-orange-500 font-semibold",
      className:
        "[grid-area:stack] translate-x-40 translate-y-24 hover:translate-y-12 scale-125",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-gray-50">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            How APPLYZERWorks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            From profile upload to inbox delivery in three simple steps. Our AI handles the entire application pipeline so you can focus on interview prep.
          </p>
        </div>

        {/* Bento Grid - 2:3 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 mx-auto">
          {/* Left Column - 2 parts (3 Detail Cards) */}
          <div className="lg:col-span-2 grid grid-rows-3 gap-0">
            {/* Card 1: Smart Resume Generation */}
            <div className="border-2 border-black p-6 bg-white flex flex-col items-center text-center justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Smart Resume Generation
              </h3>
              <p className="text-sm text-gray-600">
                AI selects your top 3 projects that match each job description using TF-IDF scoring and LLM analysis.
              </p>
            </div>

            {/* Card 2: Gmail Integration */}
            <div className="border-2 border-black border-t-0 p-6 bg-white flex flex-col items-center text-center justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                <Send className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Gmail Integration
              </h3>
              <p className="text-sm text-gray-600">
                OAuth2-secured sending directly from your Gmail. Personalized cold emails with autonomous follow-ups.
              </p>
            </div>

            {/* Card 3: Real-Time Tracking */}
            <div className="border-2 border-black border-t-0 p-6 bg-white flex flex-col items-center text-center justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Real-Time Tracking
              </h3>
              <p className="text-sm text-gray-600">
                Google Sheets-backed tracker with reply detection. Monitor your 34% reply rate in real-time.
              </p>
            </div>
          </div>

          {/* Right Column - 3 parts (Display Cards spanning all 3 rows) */}
          <div className="lg:col-span-3 border-2 border-black border-l-0 bg-white flex items-center justify-center p-8 lg:p-16 min-h-[600px]">
            <DisplayCards cards={workflowCards} />
          </div>
        </div>
      </div>
    </section>
  );
}
