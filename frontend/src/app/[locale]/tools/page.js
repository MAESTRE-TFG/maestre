"use client";

import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { IconLock, IconUserCircle, IconWand } from "@tabler/icons-react";
import { useTranslations } from 'next-intl';


const CardContent = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base`}>
      {children}
    </div>
  );
};

const ToolList = ( params ) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const baseImgFolder = '/static/tools/';

  const locale = params?.locale || 'es';
  const t = useTranslations("ToolsPage");
  const homeT = useTranslations("HomePage");

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
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (!isProfileComplete) {
      setShowProfileModal(true);
    } else if (isAuthenticated && isProfileComplete) {
      router.push(`/${locale}/tools/${toolPage}`);
    }
  };

  const closeAuthModal = () => setShowAuthModal(false);
  const closeProfileModal = () => setShowProfileModal(false);
  const handleSignUp = () => router.push(`/${locale}/profile/signup`);
  const handleSignIn = () => router.push(`/${locale}/profile/signin`);
  const handleCompleteProfile = () => router.push(`/${locale}/profile/edit`);

  const data = [
    {
      category: "assessment",
      titleKey: "tools.exams.title",
      src: "exam_maker_sm.webp",
      page: "exam-maker",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      contentKey: "tools.exams.content",
      featuresKey: "tools.exams.features"
    },
    {
      category: "assessment",
      titleKey: "tools.tests.title",
      src: "test_maker_sm.webp",
      page: "test-maker",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      contentKey: "tools.tests.content",
      featuresKey: "tools.tests.features"
    },
    {
      category: "organization",
      titleKey: "tools.planner.title",
      src: "planner_sm.webp",
      page: "class-planner",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      contentKey: "tools.planner.content",
      featuresKey: "tools.planner.features"
    },
    {
      category: "language",
      titleKey: "tools.translator.title",
      src: "translator_sm.webp",
      page: "translator",
      sizes: "(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw",
      contentKey: "tools.translator.content",
      featuresKey: "tools.translator.features"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">

      <div className="my-8 sm:my-14"></div>


      <div className="relative">
        { /* Header Section */ }
          <div className="w-full max-w-4xl flex flex-col items-center mb-8 space-y-6 text-center mx-auto">
            <IconWand 
              className={`w-20 h-20 drop-shadow-lg text-primary`}
            />
            <div>
              <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t("pageTitle")}
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t("pageSubtitle")}
              </p>
            </div>
          </div>

            {/* Quick Access Section */}
          { isAuthenticated && isProfileComplete && (
            <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-8 md:px-12 lg:px-16">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {t("quickAccess")} <span className="text-yellow-500 ml-1">★</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {data.map((tool, index) => (
                  <div 
                    key={`quick-${index}`}
                    onClick={() => router.push(`/${locale}/tools/${tool.page}`)}
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
                        alt={t(tool.titleKey)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {t(tool.titleKey)}
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
                      alt={t(tool.titleKey)}
                      sizes={tool.sizes}
                      fill
                      className="object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="text-sm font-medium bg-[#4777da] px-2 py-1 rounded-md">
                        {t(`categories.${tool.category}`)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {t(tool.titleKey)}
                    </h3>
                    <div className="mb-4">
                      <CardContent>
                        {t(tool.contentKey)}
                        <ul className="list-disc ml-6 mt-4">
                          {[0, 1, 2, 3].map((featureIndex) => (
                            <li key={featureIndex}>
                              {t(`${tool.featuresKey}.${featureIndex}`)}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
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
                      {homeT("try_now_button")}
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
                {t("authModal.title")}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              {t("authModal.description")}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeAuthModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "dark:btn-secondary" : ""
                )}
              >
                {t("authModal.cancelButton")}
              </button>
              <button
                onClick={handleSignUp}
                className={cn(
                  "btn btn-md btn-primary",
                  theme === "dark" ? "dark:btn-primary" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                {t("authModal.createAccountButton")}
              </button>
              <button
                onClick={handleSignIn}
                className={cn(
                  "btn btn-md btn-contrast",
                  theme === "dark" ? "dark:btn-contrast" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                {t("authModal.signInButton")}
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
                {t("profileModal.title")}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              {t("profileModal.description")}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeProfileModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "text-white hover:bg-neutral-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {t("profileModal.cancelButton")}
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
                {t("profileModal.completeProfileButton")}
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