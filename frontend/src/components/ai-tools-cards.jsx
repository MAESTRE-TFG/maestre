"use client";
import { FocusCards } from "@/components/ui/focus-cards";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import axios from "axios";

export function AIToolsCards() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedToolPath, setSelectedToolPath] = useState("");

  useEffect(() => {
    checkAuthStatus();
    
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      console.log("Checking auth status:", { token: !!token, user: !!user });
      
      if (!user || !token) {
        setIsAuthenticated(false);
        setIsProfileComplete(false);
        return;
      }
      
      try {
        setIsAuthenticated(true);
        const userData = JSON.parse(user);
        console.log("User data:", userData);
        
        const isComplete = userData.region && 
                          userData.city && 
                          userData.school;
        
        console.log("Profile complete:", isComplete);
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setIsProfileComplete(false);
      }
    }
  };

  const cards = [
    {
      // title: "Exam Maker",
      src: "/static/tools/exam_maker.webp",
      description: "Create comprehensive exams with our intuitive exam maker",
      url: "/tools/exam-maker"
    },
    {
      // title: "Test Generator",
      src: "/static/tools/test_maker.webp",
      description: "Generate tests efficiently with AI-powered assistance",
      url: "/tools/test-generator"
    },
    {
      // title: "Class Planner",
      src: "/static/tools/planner.webp",
      description: "Plan your classes with our comprehensive planning tools",
      url: "/tools/class-planner"
    },
    {
      // title: "Translator",
      src: "/static/tools/translator.webp",
      description: "Break language barriers in your classroom",
      url: "/tools/translator"
    }
  ];

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleSignUp = () => {
    router.push('/profile/signup');
    closeAuthModal();
  };
  
  const handleSignIn = () => {
    router.push('/profile/signin');
    closeAuthModal();
  };

  const handleCompleteProfile = () => {
    router.push('/profile/complete');
    closeProfileModal();
  };

  const handleCardClick = (path) => {
    setSelectedToolPath(path);
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      router.push(path);
    }
  };

  return (<>
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
                     "btn btn-md btn-secondary",
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
      <FocusCards cards={cards} onCardClick={handleCardClick} />
    </>
  );
}