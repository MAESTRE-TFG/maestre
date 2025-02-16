"use client";

import { useRouter } from "next/navigation";
import { SigninForm } from "../../components/signin-form-demo"; // Change to SigninForm
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SignIn() { // Change function name to SignIn
  const router = useRouter();
  const { theme } = useTheme();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/signin/", { // Updated endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Guarda el token en localStorage
        const user = JSON.stringify(data)
        localStorage.setItem("user", user);
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error occurred");
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
          src={theme === "dark" ? "static/maestre_logo_circle_black.png" : "static/maestre_logo_circle.png"} 
          alt="MAESTRE Logo" 
          className="mx-auto mt-4 w-44 h-44"
        />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SigninForm onSubmit={handleSubmit} /> {/* Change to SigninForm */}
      </div>
    </div>
  );
}
