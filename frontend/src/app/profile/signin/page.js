"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { SigninForm } from "@/components/signin-form-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Alert from "@/components/ui/Alert"; // Import the Alert component

export default function SignIn() {
  const router = useRouter();
  const { theme } = useTheme();
  const [alert, setAlert] = useState(null); // State for managing alerts

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto-dismiss after 5 seconds
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (formData) => {
    // Field length and uniqueness restrictions
    if (formData.emailOrUsername && formData.emailOrUsername.length > 255) {
      showAlert("warning", "Email or username cannot exceed 255 characters");
      return;
    }
    if (formData.password && formData.password.length > 128) {
      showAlert("warning", "Password cannot exceed 128 characters");
      return;
    }
    if (formData.password && formData.password.length < 8) {
      showAlert("warning", "Password must be at least 8 characters long");
      return;
    }
    if (formData.password && !/[A-Z]/.test(formData.password)) {
      showAlert("warning", "Password must contain at least one uppercase letter");
      return;
    }
    if (formData.password && !/[a-z]/.test(formData.password)) {
      showAlert("warning", "Password must contain at least one lowercase letter");
      return;
    }
    if (formData.password && !/[0-9]/.test(formData.password)) {
      showAlert("warning", "Password must contain at least one number");
      return;
    }
    if (formData.password && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      showAlert("warning", "Password must contain at least one special character");
      return;
    }

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
        const user = JSON.stringify(data);
        localStorage.setItem("user", user);
        router.push("/");
        showAlert("success", "Signed in successfully");
      } else {
        const data = await response.json();
        showAlert("error", data.detail || "Login failed");
      }
    } catch (err) {
      showAlert("error", "Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
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
          src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"} 
          alt="MAESTRE Logo" 
          className="mx-auto mt-4 w-32 h-32"
        />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SigninForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
