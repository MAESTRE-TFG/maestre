"use client";

import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { IconLock, IconUserCircle } from "@tabler/icons-react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const baseImgFolder = '/static/tools/';

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));

      if (token && user) {
        setIsAuthenticated(true);
        if (user.region && user.city && user.school) {
          setIsProfileComplete(true);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleTryNowClick = (toolPage) => {
    console.log(isAuthenticated, isProfileComplete);
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (!isProfileComplete) {
      setShowProfileModal(true);
    } else if (isAuthenticated && isProfileComplete) {
      router.push(`/tools/${toolPage}`);
    }
  };

  const closeAuthModal = () => setShowAuthModal(false);
  const closeProfileModal = () => setShowProfileModal(false);
  const handleSignUp = () => router.push('/profile/signup');
  const handleSignIn = () => router.push('/profile/signin');
  const handleCompleteProfile = () => router.push('/profile/edit');

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">

      <div className="my-16 sm:my-28"></div>


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
          { isAuthenticated && isProfileComplete && (
            <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-8 md:px-12 lg:px-16">
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
          )}


        {/* Tools Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
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
            onClick={() => handleTryNowClick(tool.page)}
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
                <span className="text-sm font-medium bg-[#4777da] px-2 py-1 rounded-md">
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
              onClick={() => handleTryNowClick(tool.page)}
              className={cn(
                "px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
                theme === "dark" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105",
                "shadow-lg hover:shadow-xl"
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

              {/* Authentication Modal */}
      <Modal isOpen={showAuthModal} onClose={closeAuthModal}>
        <div title="  ">
          <div className={cn("p-6", theme === "dark" ? "bg-[#4777da]" : "bg-[#4777da]")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <IconLock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                Authentication Required
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              You need to be logged in to access this tool. Create an account to unlock all features.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeAuthModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "dark:btn-secondary" : ""
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSignUp}
                className={cn(
                  "btn btn-md btn-primary",
                  theme === "dark" ? "dark:btn-primary" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                Create Account
              </button>
              <button
                onClick={handleSignIn}
                className={cn(
                  "btn btn-md btn-contrast",
                  theme === "dark" ? "dark:btn-contrast" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                Sing In
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Profile Completion Modal */}
      <Modal isOpen={showProfileModal} onClose={closeProfileModal}>
        <div title="  ">
          <div className={cn("p-6", theme === "dark" ? "bg-purple-600" : "bg-purple-500")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <IconUserCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                Complete Your Profile
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              We need a few more details before you can access this tool. Your profile information helps us personalize your experience.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeProfileModal}
                className={cn(
                  "btn btn-md btn-secundary",
                  theme === "dark" ? "text-white hover:bg-neutral-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteProfile}
                className={cn(
                  "btn btn-md btn-purple",
                  "flex items-center gap-2",
                  theme === "dark" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="my-16 sm:my-28"></div>

    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ToolList} />;
}