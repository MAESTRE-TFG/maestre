"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUser,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import axios from 'axios';
import { useRouter } from "next/navigation";

export function SidebarDemo({ ContentComponent }) {
  const { theme } = useTheme();
  const router = useRouter();
  const user = typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleSignout = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/signout/', {}, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push("/signin");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Invalid token:', error.response.data.detail);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push("/signin");
      } else {
        console.error('Error Signing out:', error);
      }
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "http://localhost:3000/",
      icon: (
        <IconBrandTabler
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
          )}
        />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
          )}
        />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
          )}
        />
      ),
    },
    // Only show the signout button if the user is authenticated
    user && {
      label: "Sign out",
      href: "",
      icon: (
        <IconArrowLeft
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
          )}
        />
      ),
      onClick: handleSignout,
    },
  ].filter(Boolean); // Filter out any false values (e.g., if user is not authenticated)

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border overflow-hidden",
        "h-screen",
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-gray-100 border-neutral-200"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user ? user.name + " " + user.surname : "Sign in",
                href: user ? "http://localhost:3000/profile_edit" : "/signin",
                icon: (
                  <IconUser
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      theme == "dark" ? "text-neutral-200" : "text-neutral-700"
                    )}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <ContentComponent />
    </div>
  );
}
export const Logo = () => {
  const { theme } = useTheme();
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <img
        src={theme === "dark" ? "static/maestre_logo_2_dark.webp" : "static/maestre_logo_2.webp"}
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
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <img
        src={theme === "dark" ? "static/maestre_logo_2_dark.webp" : "static/maestre_logo_2.webp"}
        className="h-14 w-14 flex-shrink-0 rounded-full"
        width={100}
        height={100}
        alt="Maestre"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};
