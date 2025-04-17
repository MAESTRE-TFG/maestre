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
  IconUserCircle,
  IconLock,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { useState as useModalState, useEffect as useModalEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('HomePage');
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
  const { theme } = useTheme();

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

  const handleSignIn = () => {
    router.push('/profile/signin');
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

        {/* Middle-right scroll button - styled like the existing button */}
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-gray-100/90 hover:bg-gray-200/90 items-center justify-center transition-all"
            onClick={scrollRight}
          >
            <IconArrowNarrowRight className="h-8 w-8 text-gray-700" />
          </motion.button>
        )}

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
      <Modal isOpen={showAuthModal} onClose={closeAuthModal}>
        <div title="  ">
          <div className={cn("p-6", theme === "dark" ? "bg-[#4777da]" : "bg-[#4777da]")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <IconLock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                {t('auth_modal_title')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              {t('auth_modal_description')}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeAuthModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "dark:btn-secondary" : ""
                )}
              >
                {t('auth_modal_cancel')}
              </button>
              <button
                onClick={handleSignUp}
                className={cn(
                  "btn btn-md btn-primary",
                  theme === "dark" ? "dark:btn-primary" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                {t('auth_modal_signup')}
              </button>
              <button
                onClick={handleSignIn}
                className={cn(
                  "btn btn-md btn-contrast",
                  theme === "dark" ? "dark:btn-contrast" : ""
                )}
              >
                <IconUserCircle className="h-5 w-5" />
                {t('auth_modal_signin')}
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
                {t('profile_modal_title')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className={cn("mb-6 text-base", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              {t('profile_modal_description')}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeProfileModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "text-white hover:bg-neutral-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {t('profile_modal_cancel')}
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
                {t('profile_modal_complete')}
              </button>
            </div>
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
  const t = useTranslations('HomePage'); // Add this line to define the t variable
  
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
          <div className="fixed inset-0 h-screen z-[9999] overflow-auto flex items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[10000] my-auto p-4 md:p-6 rounded-xl font-sans relative shadow-xl">
              <div className="absolute top-3 right-3">
                <button
                  className="h-7 w-7 bg-black dark:bg-white rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  onClick={handleClose}>
                  <IconX className="h-4 w-4 text-neutral-100 dark:text-neutral-900" />
                </button>
              </div>
              
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-sm font-medium text-black dark:text-white mt-4">
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-xl md:text-2xl font-semibold text-neutral-700 mt-1 dark:text-white z-500">
                {card.title}
              </motion.p>
              <div className="py-6">{card.content}</div>
              <button
                onClick={handleTryNowClick}
                className={cn(
                  "px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
                  theme === "dark" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105" 
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                {t('try_now_button')}
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