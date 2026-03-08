import { FileText, Send, Mail, Zap } from "lucide-react";
import { FeatureTabs } from "@/components/ui/feature-tabs";

export default function FeaturesSection() {
  const tabs = [
    {
      value: "tab-1",
      icon: <FileText className="h-auto w-4 shrink-0" />,
      label: "AI Resume Generation",
      content: {
        badge: "Smart Tailoring",
        title: "Tailored resumes for every job.",
        description:
          "Our AI automatically generates customized resumes for each application. It analyzes job descriptions and selects your most relevant experience, skills, and projects. Every resume is optimized to match what recruiters are looking for—no manual editing required.",
        buttonText: "Generate Resume",
        buttonLink: "/sign-up",
        imageSrc: "/ai resume generation.png",
        imageAlt: "AI-powered resume generation interface",
      },
    },
    {
      value: "tab-2",
      icon: <Mail className="h-auto w-4 shrink-0" />,
      label: "Gmail Integration",
      content: {
        badge: "OAuth Secured",
        title: "Send directly from your Gmail.",
        description:
          "OAuth2-secured integration sends applications directly from your Gmail account. Personalized cold emails with your authentic sender identity. Track replies in real-time and maintain professional communication. No third-party email addresses—it's all you.",
        buttonText: "Connect Gmail",
        buttonLink: "/sign-up",
        imageSrc: "/automated outreach.png",
        imageAlt: "Gmail integration for automated outreach",
      },
    },
    {
      value: "tab-3",
      icon: <Send className="h-auto w-4 shrink-0" />,
      label: "Application Tracking",
      content: {
        badge: "Real-Time Updates",
        title: "Track every application in one place.",
        description:
          "Centralized dashboard shows all your applications with real-time status updates. Monitor reply rates, track follow-ups, and see detailed analytics. Google Sheets-backed tracker with reply detection ensures you never lose track of opportunities. 34% average reply rate.",
        buttonText: "View Dashboard",
        buttonLink: "/sign-up",
        imageSrc: "/application tracker.png",
        imageAlt: "Application tracking dashboard with analytics",
      },
    },
    {
      value: "tab-4",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Bulk Applications",
      content: {
        badge: "Scale Fast",
        title: "Apply to multiple jobs instantly.",
        description:
          "Submit applications to dozens of jobs simultaneously with AI optimization for each one. Our bulk application feature maintains quality while maximizing quantity. Perfect for aggressive job searches. Apply to 100+ jobs in the time it takes to manually apply to one.",
        buttonText: "Start Bulk Apply",
        buttonLink: "/sign-up",
        imageSrc: "/feature-tracker.png",
        imageAlt: "Bulk application interface showing multiple submissions",
      },
    },
  ];

  return (
    <div id="features">
      <FeatureTabs
        badge="Competitive Advantages"
        heading="Features That Give You an Unfair Edge"
        description="Built specifically for the Indian job market. AI-powered automation, Gmail integration, and real-time tracking that actually works."
        tabs={tabs}
      />
    </div>
  );
}
