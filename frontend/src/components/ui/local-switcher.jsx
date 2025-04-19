'use client';
import { usePathname } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocalSwitcher({ locale }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = useTranslations('HomePage');
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLanguageChange = (newLocale) => {
    if (newLocale === locale) return;
    
    // Get the current path without locale prefix
    let pathWithoutLocale = pathname;
    const locales = ['en', 'es', 'gl', 'ca', 'eu'];
    
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}`)) {
        pathWithoutLocale = pathname.substring(`/${loc}`.length) || '/';
        break;
      }
    }
    
    // Build the new URL
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    // Use direct navigation to avoid any router state issues
    window.location.assign(newPath);
  };
  
  // Map of locale codes to their display names and flags
  const localeInfo = {
    en: { name: "English", flag: "🇬🇧" },
    es: { name: "Español", flag: "🇪🇸" },
    // gl: { name: "Galego", flag: "🏴󠁥󠁳󠁧" },
    // ca: { name: "Català", flag: "🏴󠁥󠁳󠁣󠁴󠁿" },
    // eu: { name: "Euskara", flag: "🏴󠁥󠁳󠁰󠁶󠁿" }
  };

  console.log(locale);
  
  return (
    <div 
      ref={dropdownRef}
      className={cn(
        "relative",
        isOpen ? "z-50" : "z-10"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-2 rounded-full flex items-center justify-between min-w-[140px]",
          "transition-all duration-300 font-medium",
          theme === "dark"
            ? "bg-gray-800/50 hover:bg-gray-700/50 text-white"
            : "bg-white/20 hover:bg-white/30 text-white",
          isOpen && (theme === "dark" ? "bg-gray-700/50" : "bg-white/30")
        )}
      >
        <span className="flex items-center">
          {/* {locale && localeInfo[locale] && (
            <>
              <span className="mr-2 text-lg">{localeInfo[locale].flag}</span>
              <span>{localeInfo[locale].name}</span>
            </>
          )} */}
          {t('footer_language_text')}
        </span>
        <svg 
          className={cn(
            "h-4 w-4 ml-2 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className={cn(
            "absolute right-0 bottom-full mb-2 w-48 rounded-xl overflow-hidden shadow-lg",
            "transition-all duration-200 transform origin-bottom-right",
            theme === "dark" 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-white border border-gray-200"
          )}
        >
          <div className="py-1">
            {Object.entries(localeInfo).map(([code, { name, flag }]) => (
              <button
                key={code}
                onClick={() => {
                  handleLanguageChange(code);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-4 py-2 text-left",
                  "transition-colors duration-150",
                  theme === "dark" 
                    ? "text-gray-200 hover:bg-gray-700" 
                    : "text-gray-700 hover:bg-gray-100",
                  locale === code && (
                    theme === "dark" 
                      ? "bg-blue-900/30 text-blue-300" 
                      : "bg-blue-50 text-blue-600"
                  )
                )}
              >
                <span className="mr-3 text-lg">{flag}</span>
                <span>{name}</span>
                {locale === code && (
                  <span className="ml-auto">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}