"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Alfa_Slab_One } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${alfaSlabOne.className}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
