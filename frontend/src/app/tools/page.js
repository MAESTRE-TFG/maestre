"use client";

import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { AIToolsCards } from "@/components/ai-tools-cards";

const ToolList = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated when the component mounts
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      // If no token or user data, redirect to login
      if (!token || !user) {
        console.log("No authentication detected");
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading...
      </p>
    </div>;
  }

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
