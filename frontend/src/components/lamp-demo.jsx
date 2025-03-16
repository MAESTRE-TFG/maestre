"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";
import { useTheme } from "@/components/theme-provider";


export function LampDemo() {
  const { theme } = useTheme();

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 1.2,
          ease: "easeInOut",
        }}
        className={`py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-6xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-200 to-gray-400'
              : 'bg-gradient-to-br from-slate-700 to-slate-900'
          }`}      >
        Empowering educators <br /> with intelligent tools
      </motion.h1>
    </LampContainer>
  );
}
