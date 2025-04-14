"use client";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
        <div className="relative w-80 h-80 mb-8">
          <Image
            src="/static/maestrito/maestrito_sad_transparent.webp"
            alt="Maestrito Sad"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* 404 Title */}
      <h1 className={`text-8xl font-bold mb-4 font-alfa-slab-one ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        404
      </h1>

        <span className={`text-xl mb-8 text-center px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Oops! Looks like you've wandered into uncharted territory.
        </span>

      <button
        onClick={() => router.push('/')}
        className={cn(
          "mt-4 px-8 py-4 rounded-md text-lg font-medium border border-green-500 relative group/btn",
          "hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.3)] transition-shadow duration-800",
          theme === "dark"
            ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
        )}
        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
      >
        Return Home
        <BottomGradient />
      </button>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className={cn(
          "group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
          "bg-gradient-to-r from-transparent via-green-500 to-transparent"
        )}
      />
      <span
        className={cn(
          "group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
          "bg-gradient-to-r from-transparent via-green-500 to-transparent"
        )}
      />
    </>
  );
};