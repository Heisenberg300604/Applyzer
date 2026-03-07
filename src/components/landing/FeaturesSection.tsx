import { FileText, Send, BarChart3 } from "lucide-react";
import { FeatureTabs } from "@/components/ui/feature-tabs";

export default function FeaturesSection() {
  const tabs = [
    {
      value: "tab-1",
      icon: <FileText className="h-auto w-4 shrink-0" />,
      label: "WhatsApp-First Pipeline",
      content: {
        badge: "Real-Time Alerts",
        title: "One-click apply from WhatsApp.",
        description:
          "Get instant job match notifications on WhatsApp. Reply 'YES' to apply without opening a dashboard. Native integration for real-time application triggers ensures you never miss an opportunity. Built for the Indian market where WhatsApp is king.",
        buttonText: "Try WhatsApp Flow",
        buttonLink: "/sign-up",
        imageSrc: "/ai resume generation.png",
        imageAlt: "WhatsApp-first job application flow",
      },
    },
    {
      value: "tab-2",
      icon: <Send className="h-auto w-4 shrink-0" />,
      label: "Human-in-the-Loop",
      content: {
        badge: "Quality Control",
        title: "Review AI output before sending.",
        description:
          "Unlike fully automated tools, APPLYZERgives you control. Review and tweak AI-generated resumes and emails before they hit a recruiter's inbox. Our Executive plan includes expert human review to ensure every application is perfect. You stay in command.",
        buttonText: "See Review Process",
        buttonLink: "/sign-up",
        imageSrc: "/automated outreach.png",
        imageAlt: "Human-in-the-loop review interface",
      },
    },
    {
      value: "tab-3",
      icon: <BarChart3 className="h-auto w-4 shrink-0" />,
      label: "ATS Score Gamification",
      content: {
        badge: "Competitive Edge",
        title: "Beat ATS with data-driven insights.",
        description:
          "See your exact ATS Match Score for every job. Our TF-IDF algorithm shows you're 85% match for Google—add 'Redis' to reach 95%. Gamified metrics help you optimize your profile strategically. Know exactly what recruiters see before you apply.",
        buttonText: "Check Your Score",
        buttonLink: "/sign-up",
        imageSrc: "/application tracker.png",
        imageAlt: "ATS score dashboard with optimization suggestions",
      },
    },
  ];

  return (
    <div id="features">
      <FeatureTabs
        badge="Competitive Advantages"
        heading="Features That Give You an Unfair Edge"
        description="Built specifically for the Indian job market. WhatsApp integration, human oversight, and ATS optimization that actually works."
        tabs={tabs}
      />
    </div>
  );
}
