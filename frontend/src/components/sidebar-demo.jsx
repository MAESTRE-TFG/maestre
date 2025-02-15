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

export function SidebarDemo({ ContentComponent }) {
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'))
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
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft
          className={cn(
            "h-5 w-5 flex-shrink-0",
            theme == "dark" ? "text-neutral-200" : "text-neutral-700"
          )}
        />
      ),
    },
  ];
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
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.name + " " + user.surname,
                href: "#",
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
        src="static/maestre_logo_circle.png"
        className="h-7 w-7 flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Maestre"
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
        src="static/maestre_logo_circle.png"
        className="h-7 w-7 flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Maestre"
      />
    </div>
  );
};
