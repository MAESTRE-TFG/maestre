"use client";

import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";

import { AIToolsCards } from "@/components/ai-tools-cards";

const ToolList = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen pt-24 px-8">
      <div className="relative my-8" style={{ height: "650px" }}></div>

      {/* Header Section */}
      <div className="w-full text-center mb-12">
        <h1 className={`text-4xl font-bold font-alfa-slab-one mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          AI Tools
        </h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Choose one of our automated tools and start creating!
        </p>
      </div>

      {/* Tools Section */}
      <div className="w-full max-w-7xl mx-auto">
        <AIToolsCards />
      </div>

      <div className="my-28"></div>

    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ToolList} />;
}
