"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useTheme } from "@/components/theme-provider";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
    const { theme } = useTheme();
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-6 py-6 hidden md:flex md:flex-col w-[300px] flex-shrink-0", // Adjusted padding for larger text and icons
          theme == "dark" ? "bg-neutral-800" : "bg-neutral-100",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "100px") : "300px", // Adjusted width for larger icons
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  const { theme } = useTheme();
  return (
    <>
      <div
        className={cn(
          "h-20 px-4 py-6 flex flex-row md:hidden items-center justify-between w-full",
          theme == "dark" ? "bg-neutral-800" : "bg-neutral-100"
        )}
        {...props}
      >
        <div className="flex justify-start z-20 w-full">
          <button 
            onClick={() => setOpen(!open)}
            className={cn(
              "p-4 rounded-full transition-all duration-300 hover:bg-opacity-20 mt-2", // Adjusted padding for larger icons
              theme === "dark" ? "hover:bg-white text-neutral-200" : "hover:bg-neutral-300 text-neutral-800"
            )}
          >
            {open ? (
              <IconX className="w-9 h-9 transition-transform duration-300 ease-in-out" /> // Increased icon size
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" // Increased icon size
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform duration-300 ease-in-out"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="14" y2="18" />
              </svg>
            )}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 p-10 z-[100] flex flex-col justify-between",
                theme == "dark" ? "bg-neutral-900" : "bg-white",
                className
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  const { theme } = useTheme();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3", // Adjusted gap and padding for larger text and icons
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-base group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0", // Increased text size
          theme == "dark" ? "text-neutral-200" : "text-neutral-700",
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
