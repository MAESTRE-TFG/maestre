"use client";
import React from "react";
import { useTheme } from "@/components/theme-provider";

export function DemoWindow() {
  const { theme } = useTheme();

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-lg overflow-hidden relative shadow-xl transition-transform duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
      {/* Header with window buttons */}
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: theme === 'dark' ? '#2D2D2D' : '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>

      {/* Video container with fixed size */}
      <div className="aspect-video relative z-20">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          ref={(videoElement) => {
            if (videoElement) {
              // Set a random start time between 0 and 70% of the video duration
              videoElement.addEventListener('loadedmetadata', () => {
                const randomStartTime = Math.random() * (videoElement.duration * 0.7);
                videoElement.currentTime = randomStartTime;
              });
            }
          }}
        >
          <source src="/static/demo_1.mp4" type="video/mp4" />
          <source src="/static/demo_1.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}