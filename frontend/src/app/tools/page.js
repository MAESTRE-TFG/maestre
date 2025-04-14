"use client";

import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const CardContent = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base`}>
      {children}
    </div>
  );
};

const ToolList = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const baseImgFolder = '/static/tools/';

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

  const data = [
    {
      category: "Assessment",
      title: "Create Engaging Exams",
      src: "exam_maker_sm.webp",
      page: "exam-maker",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      content: <CardContent>
        Create comprehensive exams with our intuitive exam maker. Features include:
        <ul className="list-disc ml-6 mt-4">
          <li>Multiple question types</li>
          <li>Automatic grading</li>
          <li>Custom scoring rules</li>
          <li>Question bank management</li>
        </ul>
      </CardContent>
    },
    {
      category: "Assessment",
      title: "Generate Tests Efficiently",
      src: "test_maker_sm.webp",
      page: "test-maker",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      content: <CardContent>
        Streamline your test creation process with AI-powered assistance:
        <ul className="list-disc ml-6 mt-4">
          <li>AI-generated questions</li>
          <li>Smart difficulty adjustment</li>
          <li>Topic-based generation</li>
          <li>Instant test assembly</li>
        </ul>
      </CardContent>
    },
    {
      category: "Organization",
      title: "Plan Your Classes",
      src: "planner_sm.webp",
      page: "class-planner",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      content: <CardContent>
        Stay organized with our comprehensive planning tools:
        <ul className="list-disc ml-6 mt-4">
          <li>Visual class schedules</li>
          <li>Curriculum mapping</li>
          <li>Resource allocation</li>
          <li>Progress tracking</li>
        </ul>
      </CardContent>
    },
    {
      category: "Language",
      title: "Translate Materials",
      src: "translator_sm.webp",
      page: "translator",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      content: <CardContent>
        Break language barriers in your classroom:
        <ul className="list-disc ml-6 mt-4">
          <li>Real-time translation</li>
          <li>Multi-language support</li>
          <li>Educational context awareness</li>
          <li>Document translation</li>
        </ul>
      </CardContent>
    }
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading...
      </p>
    </div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 md:px-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative">

        {/* Header Section */}
        <div className="w-full text-center mb-8 md:mb-12">
          <h1 className={`text-3xl sm:text-4xl font-bold font-alfa-slab-one mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            AI Tools
          </h1>
          <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Choose one of our automated tools and start creating!
          </p>
        </div>

          {/* Quick Access Section */}
          <div className="w-full max-w-7xl mx-auto mb-12">
          <h2 className={`text-xl font-bold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Quick Access <span className="text-yellow-500 ml-1">★</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((tool, index) => (
              <div 
                key={`quick-${index}`}
                onClick={() => router.push(`/tools/${tool.page}`)}
                className={cn(
                  "rounded-lg p-4 cursor-pointer transition-all duration-300",
                  "flex items-center gap-3 w-full",
                  "hover:shadow-md hover:-translate-y-1 hover:scale-102",
                  theme === 'dark' 
                    ? 'bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700' 
                    : 'bg-white/80 hover:bg-gray-50/90 border border-gray-200'
                )}
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={baseImgFolder+"i_"+tool.src}
                    alt={tool.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {tool.title}
                </span>
              </div>
            ))}
          </div>
        </div>


        {/* Tools Section - Made images larger */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
                  theme === 'dark' ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-gray-200'
                )}
                onClick={() => router.push(`/tools/${tool.page}`)}
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={baseImgFolder+tool.src}
                    alt={tool.title}
                    sizes={tool.sizes}
                    fill
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="text-sm font-medium bg-blue-600 px-2 py-1 rounded-md">
                      {tool.category}
                    </span>
                  </div>
              </div>
              
              <div className="p-5">
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {tool.title}
                </h3>
                <div className="mb-4">
                  {tool.content}
                </div>
                <button 
                  className={cn(
                    "mt-2 px-4 py-2 rounded-lg font-medium transition-colors",
                    theme === 'dark' 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                >
                  Try Now
                </button>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      <div className="my-16 sm:my-28"></div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ToolList} />;
}