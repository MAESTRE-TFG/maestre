"use client";

import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { AIToolsCards } from "@/components/ai-tools-cards";
import { useRouter } from 'next/navigation';

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
<div className="min-h-screen pt-24 px-4 sm:px-6 md:px-8">
  <div className="relative my-8 hidden md:block h-[400px] md:h-[650px]"></div>

  {/* Header Section */}
  <div className="w-full text-center mb-8 md:mb-12">
    <h1 className={`text-3xl sm:text-4xl font-bold font-alfa-slab-one mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      AI Tools
    </h1>
    <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      Choose one of our automated tools and start creating!
    </p>
  </div>

  {/* Tools Section */}
  <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
    <AIToolsCards />
  </div>

  <div className="my-16 sm:my-28"></div>
</div>

  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ToolList} />;
}
