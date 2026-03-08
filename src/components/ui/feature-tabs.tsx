import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface FeatureTabsProps {
  badge?: string;
  heading?: string;
  description?: string;
  tabs: Tab[];
}

const FeatureTabs = ({
  badge = "ApplyBot",
  heading = "AI-Powered Features Built to Win",
  description = "Everything you need to automate your job search and land more interviews.",
  tabs,
}: FeatureTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  // Auto-scroll tabs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.value === current);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].value;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [tabs]);

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col items-center gap-6 text-center mb-16">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold border-orange-500 text-orange-500">
            {badge}
          </Badge>
          <h2 className="max-w-4xl text-5xl font-black text-gray-900 md:text-6xl leading-tight">
            {heading}
          </h2>
          <p className="text-gray-600 max-w-3xl text-lg">
            {description}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-16">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 bg-transparent h-auto p-0 mb-12">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-100 transition-all duration-300"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mx-auto max-w-[1400px] rounded-2xl bg-gray-50 border-2 border-black p-8 lg:p-20">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-16 lg:grid-cols-2 lg:gap-20 data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-4 duration-500"
              >
                <div className="flex flex-col gap-6 max-w-xl">
                  <Badge variant="outline" className="w-fit bg-white text-xs uppercase tracking-wider font-semibold border-orange-500 text-orange-500">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-4xl font-black text-gray-900 lg:text-6xl leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-gray-600 text-lg lg:text-xl leading-relaxed">
                    {tab.content.description}
                  </p>
                  <Link to={tab.content.buttonLink}>
                    <InteractiveHoverButton className="mt-4 text-sm">
                      {tab.content.buttonText}
                    </InteractiveHoverButton>
                  </Link>
                </div>
                <div className="w-full">
                  <img
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    className="rounded-xl w-full h-auto object-cover shadow-lg"
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { FeatureTabs };
