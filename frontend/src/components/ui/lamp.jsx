"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export const LampContainer = ({
  children,
  className
}) => {
  const { theme } = useTheme();
  
  return (
    (<div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        theme === 'dark' ? 'bg-neutral-900' : 'bg-white',
        className
      )}>
      <div
        className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        {/* Gradient elements */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "22rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-hidden w-[20rem] bg-gradient-conic from-[#99BBE6] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]">
          <div
            className={`absolute w-[800%] h-40 left-0 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`} />
          <div
            className={`absolute w-40 h-[800%] left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "20rem" }}
          whileInView={{ opacity: 1, width: "22rem" }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[20rem] bg-gradient-conic from-transparent via-transparent to-[#99BBE6] text-white [--conic-position:from_290deg_at_center_top]">
          <div
            className={`absolute w-40 h-[100%] right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`} />
          <div
            className={`absolute w-[100%] right-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`} />
        </motion.div>
        <div
          className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#99BBE6] opacity-50 blur-3xl"></div>
        <motion.div className="absolute inset-auto z-30 h-36 w-60 -translate-y-[6rem] rounded-full bg-[#99BBE6] blur-2xl"></motion.div>
        <motion.div className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-[#99BBE6]"></motion.div>

        <div
          className={`absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}></div>
      </div>
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>)
  );
};
