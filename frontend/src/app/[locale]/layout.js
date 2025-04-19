"use client";
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import NotFound from './not-found';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Alfa_Slab_One } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";
import React from 'react';

// Import messages statically to avoid dynamic imports in client components
import enMessages from '../../../messages/en.json';
import esMessages from '../../../messages/es.json';

const messages = {
  en: enMessages,
  es: esMessages
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const alfaSlabOne = Alfa_Slab_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});


export default function RootLayout({ children, params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const locale = unwrappedParams.locale;
  
  if (!routing.locales.includes(locale)) {
    NotFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${alfaSlabOne.className}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale] || {}}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
