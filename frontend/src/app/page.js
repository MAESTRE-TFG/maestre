"use client";
import { useEffect, useState } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/signup');
      return;
    }
  }, [router]);

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          "p-2 md:p-10 rounded-tl-2xl border flex flex-col gap-2 flex-1 w-full h-full",
          theme == "dark"
            ? "border-neutral-70 bg-neutral-900"
            : "border-neutral-200 bg-white"
        )}
      >
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={i} // Utiliza el índice directamente como clave
              className={cn(
                "h-20 w-full rounded-lg animate-pulse",
                theme == "dark" ? "bg-neutral-800" : "bg-gray-100"
              )}
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, i) => (
            <div
              key={i} // Utiliza el índice directamente como clave
              className={cn(
                "h-full w-full rounded-lg animate-pulse",
                theme == "dark" ? "bg-neutral-800" : "bg-gray-100"
              )}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={Home} />;
}
