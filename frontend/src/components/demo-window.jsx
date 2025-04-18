"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useTranslations } from "next-intl"; // Import the translation hook

export function DemoWindow() {
  const { theme } = useTheme();
  const t = useTranslations("DemoWindow"); // Use translations for this component
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const toggleInfo = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-lg overflow-hidden relative shadow-xl transition-transform duration-300 hover:scale-105 ${
        theme === "dark" ? "bg-neutral-800" : "bg-gray-100"
      }`}
    >
      {/* Header with window buttons */}
      <div
        className="h-8 flex items-center px-4 bg-opacity-90"
        style={{
          backgroundColor: theme === "dark" ? "#2D2D2D" : "#E9E9E9",
        }}
      >
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
          controlsList="nodownload noplaybackrate nofullscreen" // Disable browser controls
          ref={(videoElement) => {
            if (videoElement) {
              // Set a random start time between 0 and 70% of the video duration
              videoElement.addEventListener("loadedmetadata", () => {
                const randomStartTime =
                  Math.random() * (videoElement.duration * 0.7);
                videoElement.currentTime = randomStartTime;
              });
            }
          }}
        >
          <source src="/static/demo_1.mp4" type="video/mp4" />
          <source src="/static/demo_1.webm" type="video/webm" />
          {t("videoUnsupported")} {/* Internationalized */}
        </video>
      </div>

      {/* Learn More Section */}
      <div
        className={`border-t ${
          theme === "dark" ? "border-neutral-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={toggleInfo}
          className={`flex items-center justify-between w-full p-4 text-left transition-colors ${
            theme === "dark"
              ? "hover:bg-neutral-700 text-white"
              : "hover:bg-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Info
              size={18}
              className={
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }
            />
            <span className="font-medium">{t("learnMore")}</span>{" "}
            {/* Internationalized */}
          </div>
          {isInfoExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isInfoExpanded && (
          <div
            className={`p-4 ${
              theme === "dark"
                ? "bg-neutral-900 text-gray-300"
                : "bg-white text-gray-700"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">
              {t("featuresTitle")} {/* Internationalized */}
            </h3>
            <p className="mb-3">{t("featuresDescription")}</p>{" "}
            {/* Internationalized */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                className={`p-3 rounded ${
                  theme === "dark" ? "bg-neutral-800" : "bg-gray-100"
                }`}
              >
                <h4 className="font-medium mb-1">
                  {t("feature1Title")} {/* Internationalized */}
                </h4>
                <p className="text-sm">{t("feature1Description")}</p>{" "}
                {/* Internationalized */}
              </div>
              <div
                className={`p-3 rounded ${
                  theme === "dark" ? "bg-neutral-800" : "bg-gray-100"
                }`}
              >
                <h4 className="font-medium mb-1">
                  {t("feature2Title")} {/* Internationalized */}
                </h4>
                <p className="text-sm">{t("feature2Description")}</p>{" "}
                {/* Internationalized */}
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#"
                className={`inline-flex items-center px-4 py-2 rounded-md font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {t("viewDocumentation")} {/* Internationalized */}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}