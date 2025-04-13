"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { SignupForm } from "@/components/signup-form-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Alert from "@/components/ui/Alert"; // Import the Alert component

export default function SignUp() {
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
    // Field length restrictions
    if (formData.username && formData.username.length > 30) {
      showAlert("warning", "Username cannot exceed 30 characters");
      return;
    }
    if (formData.email && formData.email.length > 255) {
      showAlert("warning", "Email cannot exceed 255 characters");
      return;
    }
    if (formData.name && formData.name.length > 30) {
      showAlert("warning", "First name cannot exceed 30 characters");
      return;
    }
    if (formData.surname && formData.surname.length > 30) {
      showAlert("warning", "Last name cannot exceed 30 characters");
      return;
    }
    if (formData.school && typeof formData.school !== "string") {
      showAlert("warning", "Invalid school selection");
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/users/signup/`, {
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
        showAlert("success", "Account created successfully");
      } else {
        const data = await response.json();
        showAlert("error", data.detail || "Registration failed");
      }
    } catch (err) {
      showAlert("error", "Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
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
          src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.wepb"} 
          alt="MAESTRE Logo" 
          className="mx-auto mt-4 w-32 h-32"
        />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <SignupForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
