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
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function SidebarDemo({ ContentComponent }) {
    const { theme } = useTheme();
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
                label: "Manu Arora",
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
      <Link
        href="#"
        className={cn(
          "font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20",
          theme == "dark" ? "text-white" : "text-black"
        )}
      >
        <div
          className={cn(
            "h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0",
            theme == "dark" ? "bg-white" : "bg-black"
          )}
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "font-medium whitespace-pre",
            theme == "dark" ? "text-white" : "text-black"
          )}
        >
          Acet Labs
        </motion.span>
      </Link>
    );
    };
    export const LogoIcon = () => {
        const { theme } = useTheme();
    return (
      <Link
        href="#"
        className={cn(
          "font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20",
          theme == "dark" ? "text-white" : "text-black"
        )}
      >
        <div
          className={cn(
            "h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0",
            theme == "dark" ? "bg-white" : "bg-black"
          )}
        />
      </Link>
    );
    };

    // Dummy dashboard component with content
    const Dashboard = () => {
    return (
      <div className="flex flex-1">
        <div
          className={cn(
            "p-2 md:p-10 rounded-tl-2xl border  flex flex-col gap-2 flex-1 w-full h-full",
            theme == "dark"
              ? "bg-neutral-900 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <div className="flex gap-2">
            {[...new Array(4)].map((i) => (
              <div
                key={"first-array" + i}
                className={cn(
                  "h-20 w-full rounded-lg animate-pulse",
                  theme == "dark" ? "bg-neutral-800" : "bg-gray-100"
                )}
              ></div>
            ))}
          </div>
          <div className="flex gap-2 flex-1">
            {[...new Array(2)].map((i) => (
              <div
                key={"second-array" + i}
                className={cn(
                  "h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse",
                  theme == "dark" ? "bg-neutral-800" : "bg-gray-100"
                )}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
};
