"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useTheme } from "@/components/theme-provider"; // Add this import
import { useRouter } from "next/navigation";
import { useState as useModalState, useEffect as useModalEffect } from "react";
import { Modal } from "@/components/ui/modal";

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
  handleToolClick: (path) => {},
});

export const Carousel = ({
  items,
  initialScroll = 0,
  onToolClick
}) => {
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 300 : 480;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  const [showAuthModal, setShowAuthModal] = useModalState(false);
  const [showProfileModal, setShowProfileModal] = useModalState(false);
  const [isAuthenticated, setIsAuthenticated] = useModalState(false);
  const [isProfileComplete, setIsProfileComplete] = useModalState(false);
  const [selectedToolPath, setSelectedToolPath] = useModalState("");
  const router = useRouter();

  useModalEffect(() => {
    checkAuthStatus();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (!user || !token) {
        setIsAuthenticated(false);
        setIsProfileComplete(false);
        return;
      }
      
      try {
        setIsAuthenticated(true);
        const userData = JSON.parse(user);
        
        // Check if profile is complete
        const isComplete = userData.region && 
                          userData.city && 
                          userData.school;
        
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setIsProfileComplete(false);
      }
    }
  };

  const handleToolClick = (path) => {
    setSelectedToolPath(path);
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      router.push(path);
    }
  };

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

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex, handleToolClick }}>
      <div className="relative w-full">
        <div 
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth [scrollbar-width:none]">
          <div className={cn(
            "flex flex-row justify-start gap-8 pl-8 pr-8",
            "max-w-7xl mx-auto"
          )}>
            {items.map((item, index) => (
              <div key={`card-${index}`} className="rounded-3xl">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <button
            className="h-14 w-14 rounded-full bg-gray-100/90 hover:bg-gray-200/90 flex items-center justify-center disabled:opacity-50 transition-all"
            onClick={scrollLeft}
            disabled={!canScrollLeft}>
            <IconArrowNarrowLeft className="h-8 w-8 text-gray-700" />
          </button>
          <button
            className="h-14 w-14 rounded-full bg-gray-100/90 hover:bg-gray-200/90 flex items-center justify-center disabled:opacity-50 transition-all"
            onClick={scrollRight}
            disabled={!canScrollRight}>
            <IconArrowNarrowRight className="h-8 w-8 text-gray-700" />
          </button>
        </div>
        
        {/* Authentication Modal */}
        <Modal 
          isOpen={showAuthModal} 
          onClose={closeAuthModal} 
          title="Authentication Required"
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
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose, currentIndex, handleToolClick } = useContext(CarouselContext);
  const { theme } = useTheme();
  
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  const handleTryNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToolClick(`/tools/${card.page}`);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-[9999] overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[10000] my-10 p-4 md:p-10 rounded-3xl font-sans relative">
              <div className="flex justify-end gap-4">
                <button
                  className="h-8 w-8 bg-black dark:bg-white rounded-full flex items-center justify-center"
                  onClick={handleClose}>
                  <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
                </button>
              </div>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white">
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white z-500">
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
              <button
                onClick={handleTryNowClick}
                style={{ fontFamily: "Alfa Slab One"}}
                className={cn(
                  "inline-flex items-center justify-items-center rounded-full transition-all",
                  "font-medium text-sm py-2 px-6",
                  "border border-transparent,",
                  theme === "dark" 
                    ? "bg-white text-black hover:bg-neutral-200" 
                    : "bg-black text-white hover:bg-neutral-800"
                )}>
                Try Now!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-64 w-60 md:h-[32rem] md:w-[26rem] overflow-hidden flex flex-col items-start justify-end relative z-10 transition-transform duration-300 hover:-translate-y-4 hover:shadow-xl"
      >
        <div
          className="absolute h-full top-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left opacity-80">
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2">
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0" />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn("transition duration-300", isLoading ? "blur-sm" : "blur-0", className)}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest} />
  );
};
