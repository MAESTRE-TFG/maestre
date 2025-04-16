"use client";
import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconUser,
  IconPlus,
  IconSchool,
  IconBooks,
  IconX,
  IconHome,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/Alert"; // Import the Alert component

export function SidebarDemo({ ContentComponent }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);
  
  // Improved user data handling
  useEffect(() => {
    const checkUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");
        
        // Only set user if both user data and token exist
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else {
          // Clear user state if either is missing
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };
    
    // Check on initial load
    checkUserData();
    
    // Add storage event listener to handle changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "authToken") {
        checkUserData();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignout = async () => {
    console.log('Signing out...');
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Change the Authorization header format to match what your backend expects
          await axios.post(`${getApiBaseUrl()}/api/users/signout/`, {}, {
            headers: {
              'Authorization': `Token ${token}`  // Changed from Bearer to Token
            }
          });
          console.log('Successfully called signout API');
        } catch (apiError) {
          console.error('API error during signout:', apiError);
          // Continue with local logout even if API call fails
        }
      }
      
      // Always clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      closeLogoutModal();
      
      // Show success alert
      setAlert({ type: "success", message: "You have successfully logged out." });

      // Redirect to home page after a short delay
      setTimeout(() => {
        setAlert(null); // Clear the alert after a few seconds
        router.push("/");
      }, 3000);
      
    } catch (error) {
      console.error('Error during signout process:', error);
      
      // Ensure we still clear data even if there's an error
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      closeLogoutModal();
      
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      router.push("/profile/signin");
    } else {
      router.push("/profile/edit");
    }
  };

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome
          className={cn(
            "h-6 w-6 ml-2 flex-shrink-0",
            theme == "dark" ? "text-blue-300" : "text-[rgb(25,65,166)]"
          )}
        />
      ),
    },
    {
      label: "Create",
      href: "/tools",
      icon: (
        <IconPlus
          className={cn(
            "h-6 w-6 ml-2 flex-shrink-0",
            theme == "dark" ? "text-green-300" : "text-green-600"
          )}
        />
      ),
    },
    {
      label: "My Classes",
      href: user ? "/classrooms" : "/profile/signin",
      icon: (
        <IconSchool
          className={cn(
            "h-6 w-6 ml-2 flex-shrink-0",
            theme == "dark" ? "text-purple-300" : "text-purple-600"
          )}
        />
      ),
    },
    {
      label: "My Materials",
      href: user ? "/materials" : "/profile/signin",
      icon: (
        <IconBooks
          className={cn(
            "h-6 w-6 ml-2 flex-shrink-0",
            theme == "dark" ? "text-amber-300" : "text-amber-600"
          )}
        />
      ),
    },
    {
      label: user ? user.name : "Sign in",
      href: user ? "/profile/edit" : "/profile/signin",
      icon: (
        <IconUser
          className={cn(
            "h-6 w-6 ml-2 flex-shrink-0",
            theme == "dark" ? "text-cyan-300" : "text-cyan-600"
          )}
        />
      ),
      onClick: handleProfileClick,
    },
  ].filter(Boolean); // Filter out any false values (e.g., if user is not authenticated)

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border overflow-hidden",
        "h-screen overflow-y-auto",
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-gray-200 border-neutral-300"
      )}
    >
      {/* Display the alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Sidebar open={open} setOpen={setOpen} className={cn(open ? "w-84 z-50" : "w-60 z-50")}>
        <SidebarBody
          className={cn(
            "justify-between gap-10",
            theme === "dark"
              ? "bg-gradient-to-b from-neutral-800 via-neutral-800 to-[#b0c4de] z-50" // Adjusted gradient for less saturation
              : "bg-gradient-to-b from-gray-200 via-gray-200 to-[#e0eaf4] z-50" // Adjusted gradient for less saturation
          )}
          style={{
            backgroundSize: "100% 200%",
            backgroundPosition: "top 75%",
          }}
        >
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? (
              <>
                <div className="flex justify-end p-2 md:hidden">
                  <IconX
                    className={cn(
                      "h-6 w-6 cursor-pointer",
                      theme == "dark" ? "text-neutral-200" : "text-neutral-700"
                    )}
                    onClick={() => setOpen(false)}
                  />
                </div>
                <Logo />
              </>
            ) : (
              <LogoIcon />
            )}
            <div className="mt-8 flex flex-col gap-2 z-50">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 z-50">
            <SidebarLink
              link={{
                label: "Theme",
                href: "#",
                icon: (
                  <ThemeSwitch
                    checked={theme === "dark"}
                    onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                  />
                ),
              }}
            />
            {user && (
              <SidebarLink
                link={{
                  label: "Sign out",
                  href: "#",
                  icon: (
                    <IconArrowLeft
                      className={cn(
                        "h-6 w-6 ml-2 flex-shrink-0",
                        theme == "dark" ? "text-neutral-200" : "text-neutral-700"
                      )}
                    />
                  ),
                }}
                onClick={openLogoutModal}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex justify-center items-start overflow-y-auto">
        <ContentComponent />
      </div>
      <Modal isOpen={isLogoutModalOpen} onClose={closeLogoutModal}>
        <div title=" ">
          <div className={cn("p-6", theme === "dark" ? "bg-[#f08060]" : "bg-[#f08060]")}> {/* Adjusted for less saturation */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <IconArrowLeft className="h-6 w-6 text-white" />
              </div>
              <h2
                className="text-xl font-bold text-white"
              >
                Confirm Logout
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p
              className={cn(
                "mb-6 text-base",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeLogoutModal}
                className={cn(
                  "btn btn-md btn-secondary",
                  theme === "dark" ? "dark:btn-secondary" : ""
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSignout}
                className={cn(
                  "btn btn-md btn-danger",
                  theme === "dark" ? "dark:btn-danger" : ""
                )}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export const Logo = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false); // Access sidebar state

  return (
    <div
      className={cn(
        "font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-50 cursor-pointer",
        open ? "text-lg" : "text-sm" // Adjust text size based on sidebar state
      )}
      onClick={() => router.push("/")} // Redirect to home page
    >
      <img
        src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
        className={cn(
          "flex-shrink-0 rounded-full",
          open ? "h-18 w-18" : "h-14 w-14"
        )}
        width={open ? 120 : 90}
        height={open ? 120 : 90}
        alt="Maestre"
        style={{ objectFit: "contain" }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "font-medium whitespace-pre",
          theme == 'dark' ? 'text-white' : 'rgb(25,65,166)'
        )}
      >
        <style jsx global>{
          `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`
        }</style>
        <h2
          style={{
            fontFamily: "'Alfa Slab One', sans-serif",
            fontSize: open ? "2rem" : "1.25rem",
            color: theme === 'dark' ? 'text-white' : 'rgb(25,65,166)',
          }}
        >
          MAESTRE
        </h2>
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <div
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-50 cursor-pointer"
      onClick={() => router.push("/")} // Redirect to home page
    >
      <img
        src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
        className="h-12 w-12 flex-shrink-0 rounded-full"
        width={90}
        height={90}
        alt="Maestre"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

