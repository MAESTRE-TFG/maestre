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
      <Modal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
        title="  "
        style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">
            Authentication Required
          </h2>
          <p className="mb-4">
            You need to be logged in to access this tool. Please create an account to continue.
          </p>
          <div className="flex justify-end">
            <button
              onClick={closeAuthModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSignUp}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    {/* Profile Completion Modal */}
      <Modal 
        isOpen={showProfileModal} 
        onClose={closeProfileModal} 
        title="Complete Your Profile"
        style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">
            Complete Your Profile
          </h2>
          <p className="mb-4">
            Please complete your profile information before accessing this tool.
          </p>
          <div className="flex justify-end">
            <button
              onClick={closeProfileModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </Modal>
      <FocusCards cards={cards} onCardClick={handleCardClick} />
    </>
  );
}