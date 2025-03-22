"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconUser,
  IconPlus,
  IconSchool,
  IconBooks,
  IconX,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { Modal } from "@/components/ui/modal";

export function SidebarDemo({ ContentComponent }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignout = async () => {
    console.log('Signing out...');
    try {
      await axios.post('http://localhost:8000/api/users/signout/', {}, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      closeLogoutModal();
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      setUser(null);
      
      setTimeout(() => {
        router.push("/profile/signin");
      }, 100);
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Invalid token:', error.response.data?.detail || 'No detail available');
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        
        setTimeout(() => {
          router.push("/profile/signin");
        }, 100);
      } else {
        console.error('Error Signing out:', error);
      }
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
      label: "Create",
      href: "/tools",
      icon: (
        <IconPlus
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
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
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
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
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
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
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
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
          : "bg-gray-100 border-neutral-200"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} className={cn(open ? "w-84 z-50" : "w-60 z-50")}>
        <SidebarBody className={cn("justify-between gap-10", theme === "dark" ? "bg-neutral-800 z-50" : "bg-neutral-100 z-50")}>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? (
              <>
                <div className="flex justify-end p-2 md:hidden"> {/* Add md:hidden to hide on larger screens */}
                  <IconX
                    className={cn(
                      "h-6 w-6 cursor-pointer",
                      theme == "dark" ? "text-neutral-200" : "text-neutral-700"
                    )}
                    onClick={() => setOpen(false)} // Ensure this onClick event is present
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
                  )
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
                        "h-5 w-5 flex-shrink-0",
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
      <div className="flex-1 flex justify-center items-start overflow-y-auto pt-8">
        <ContentComponent />
      </div>
      <Modal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} title="Confirm Logout" style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4"
          >
            Confirm Logout
          </h2>
          <p className="mb-4">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
          <div className="flex justify-end">
            <button
              onClick={closeLogoutModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSignout} // Llama a la función de cierre de sesión
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export const Logo = () => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <div
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-50 cursor-pointer"
      onClick={() => router.push("/")} // Redirect to home page
    >
      <img
        src={theme === "dark" ? "/static/maestre_logo_2_dark.webp" : "/static/maestre_logo_2.webp"}
        className="h-12 w-12 flex-shrink-0 rounded-full"
        width={90}
        height={90}
        alt="Maestre"
        style={{ objectFit: "contain" }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "font-medium whitespace-pre",
          theme == "dark" ? "text-white" : "text-black"
        )}
      >
        <style jsx global>{
          `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`
        }</style>
        <h2 style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>MAESTRE</h2>
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
        src={theme === "dark" ? "/static/maestre_logo_2_dark.webp" : "/static/maestre_logo_2.webp"}
        className="h-12 w-12 flex-shrink-0 rounded-full"
        width={90}
        height={90}
        alt="Maestre"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

