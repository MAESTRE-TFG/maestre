"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { SigninForm } from "@/components/signin-form-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function SignIn() {
  const router = useRouter();
  const { theme } = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/users/signin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        const user = JSON.stringify(data)
        localStorage.setItem("user", user);
        router.push("/");
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || "Login failed");
      }
    } catch (err) {
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Welcome back to{" "}
          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            MAESTRE
          </span>
          , Sign in to your account
        </h1>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        `}</style>
      </div>
        <img 
          src={theme === "dark" ? "/static/maestre_logo_circle_black.png" : "/static/maestre_logo_circle.png"} 
          alt="MAESTRE Logo" 
          className="mx-auto mt-4 w-32 h-32"
        />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SigninForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
