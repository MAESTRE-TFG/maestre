"use client";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-neutral-900" : "bg-white"
      }`}
    >
      <div className="relative w-80 h-80 mb-8">
        <Image
          src="/static/maestrito/maestrito_sad_transparent.webp"
          alt="Maestrito Sad"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <h1
        className={`text-8xl font-bold mb-4 font-alfa-slab-one ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        404
      </h1>

      <span
        className={`text-xl mb-8 text-center px-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Oops! Looks like you've wandered into uncharted territory.
      </span>

      <button
        onClick={() => router.push("/")}
        className={cn(
          "btn btn-md btn-success",
          theme === "dark" ? "dark:btn-success" : ""
        )}
        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
      >
        Return Home
      </button>
    </div>
  );
}