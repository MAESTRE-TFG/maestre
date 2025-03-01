"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname } from "next/navigation";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ErrorContextProvider, ErrorContext } from "@/context/ErrorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ErrorContext.Consumer>
              {({ errorMessage, clearErrorMessage }) => (
                errorMessage && (
                  <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      variant="filled"
                      severity="error"
                      onClose={clearErrorMessage}
                    >
                      {errorMessage}
                    </Alert>
                  </div>
                )
              )}
            </ErrorContext.Consumer>
            {children}
            <ThemeSwitch />
          </ThemeProvider>
        </ErrorContextProvider>
      </body>
    </html>
  );
}
