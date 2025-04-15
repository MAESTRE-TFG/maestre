"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to ensure client-side rendering is complete
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const consent = localStorage.getItem('cookie-consent');
        if (consent !== 'accepted') {
          console.log("Setting cookie consent modal to show");
          setShowConsent(true);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const rejectCookies = () => {
    setShowConsent(false);
  };

  const handleCookiesPolicyClick = () => {
    localStorage.setItem('open-cookies-policy', 'true');
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  console.log("Cookie consent state:", showConsent);
  
  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <Image
            src="/static/cookie-icon.webp"
            alt="Cookies"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">¡Cookies!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We use cookies to enhance your experience on our website. By continuing to use our website, you consent to our use of cookies.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={acceptCookies}
            className="btn btn-contrast py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
          >
            Accept
          </button>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Link 
              href="/terms" 
              onClick={handleCookiesPolicyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/90 text-sm font-medium"
            >
              Cookie Policy
            </Link>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <button
              onClick={rejectCookies}
              className="text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/90 text-sm font-medium"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}