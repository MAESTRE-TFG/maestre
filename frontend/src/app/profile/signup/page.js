"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "../../components/signup-form-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/signup/", {
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
        setError(data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Welcome to{" "}
          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            MAESTRE
          </span>
          , Create your account
        </h1>
      </div>
        <img 
          src={theme === "dark" ? "static/maestre_logo_circle_black.png" : "static/maestre_logo_circle.png"} 
          alt="MAESTRE Logo" 
          className="mx-auto mt-4 w-44 h-44"
        />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <SignupForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
