"use client";
import React from 'react';
import Image from 'next/image';
import { useTheme } from "@/components/theme-provider";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from '@/components/ui/local-switcher';

export function Footer({ locale }) {
  const { theme } = useTheme();
  const t = useTranslations('HomePage');

  return (
    <footer className="relative">
      {/* Top wave SVG */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            fill={theme === "dark" ? "#000" : "#fff"}
          ></path>
        </svg>
      </div>
      
      {/* Main footer content */}
      <div className={cn(
        "pt-32 pb-8 text-white",
        theme === "dark" 
          ? "bg-gradient-to-r from-blue-950/90 to-purple-950/90" 
          : "bg-gradient-to-r from-blue-600/80 to-purple-600/80"
      )}>
        <div className="container mx-auto px-6">
          {/* Logo and brand */}
          <div className="flex justify-center mb-16">
            <Link href="/" passHref>
              <div className="flex items-center gap-4 cursor-pointer">
                <Image
                  src="/static/logos/maestre_logo_white_transparent.webp"
                  alt="Maestre Logo"
                  width={70}
                  height={70}
                  className="rounded-xl"
                />
                <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                  {t('title')}
                </h2>
              </div>
            </Link>
          </div>
          
          {/* Three column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto mb-16">
            {/* About column */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-6">{t('footer_about')}</h3>
              <p className={cn(
                "mb-8 leading-relaxed",
                theme === "dark" ? "text-gray-300" : "text-white/90"
              )}>
                {t('main_description')}
              </p>
              <div className="flex justify-center md:justify-start gap-6">
                <a href="/" target="_blank" rel="noopener noreferrer" 
                  className={cn(
                    "p-3 rounded-full transition-colors duration-300",
                    theme === "dark" 
                      ? "bg-gray-800/50 hover:bg-gray-700/50" 
                      : "bg-white/20 hover:bg-white/30"
                  )}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer" 
                  className={cn(
                    "p-3 rounded-full transition-colors duration-300",
                    theme === "dark" 
                      ? "bg-gray-800/50 hover:bg-gray-700/50" 
                      : "bg-white/20 hover:bg-white/30"
                  )}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer" 
                  className={cn(
                    "p-3 rounded-full transition-colors duration-300",
                    theme === "dark" 
                      ? "bg-gray-800/50 hover:bg-gray-700/50" 
                      : "bg-white/20 hover:bg-white/30"
                  )}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://github.com/MAESTRE-TFG" target="_blank" rel="noopener noreferrer" 
                  className={cn(
                    "p-3 rounded-full transition-colors duration-300",
                    theme === "dark" 
                      ? "bg-gray-800/50 hover:bg-gray-700/50" 
                      : "bg-white/20 hover:bg-white/30"
                  )}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Links column */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-6">{t('footer_legal')}</h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href={`/terms`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_privacy')}
                    </a>
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href={`/terms`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_terms')}
                    </a>
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href={`/terms`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_cookies')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Products column */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-6">{t('footer_products')}</h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <Link href={`${locale}/tools/exam-maker`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_exam_creator')}
                    </a>
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <Link href={`${locale}/tools/test-maker`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_test_creator')}
                    </a>
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <Link href={`${locale}/tools/translator`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_translator')}
                    </a>
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <Link href={`${locale}/tools/planner`} legacyBehavior>
                    <a className={cn(
                      "transition-colors",
                      theme === "dark" ? "text-gray-300 hover:text-white" : "text-white/90 hover:text-white"
                    )}>
                      {t('footer_planner')}
                    </a>
                  </Link>
                </li>
              </ul>
              
              {/* Language selector */}
              <div className="mt-8 flex items-center justify-center md:justify-start">
                <p className={cn(
                  "mr-4",
                  theme === "dark" ? "text-gray-300" : "text-white/90"
                )}>
                  {t('footer_language')}
                </p>
                  <LocaleSwitcher />
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className={cn(
            "pt-8 border-t text-center",
            theme === "dark" ? "border-gray-700/50 text-gray-400" : "border-white/20 text-white/80"
          )}>
            <p className="text-sm">
              {t('footer_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}