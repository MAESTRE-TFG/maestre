"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { SignupForm } from "@/components/signup-form-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Alert from "@/components/ui/Alert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslations } from "next-intl";

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();
  const t = useTranslations("SignUpPage");
  const [alert, setAlert] = useState(null);
  const videoRef = useRef(null);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log(t("videoAutoplayError"), error);
      });
    }
  }, [isLargeScreen, t]);

  const handleSubmit = async (formData) => {
    // Field length restrictions
    if (formData.username && formData.username.length > 30) {
      showAlert("warning", t("alerts.usernameTooLong"));
      return;
    }
    if (formData.email && formData.email.length > 255) {
      showAlert("warning", t("alerts.emailTooLong"));
      return;
    }
    if (formData.name && formData.name.length > 30) {
      showAlert("warning", t("alerts.nameTooLong"));
      return;
    }
    if (formData.surname && formData.surname.length > 30) {
      showAlert("warning", t("alerts.surnameTooLong"));
      return;
    }
    if (formData.school && typeof formData.school !== "string") {
      showAlert("warning", "Invalid school selection");
      return;
    }
    if (formData.password && formData.password.length > 128) {
      showAlert("warning", t("alerts.passwordTooLong"));
      return;
    }
    if (formData.password && formData.password.length < 8) {
      showAlert("warning", t("alerts.passwordTooShort"));
      return;
    }
    if (formData.password && !/[A-Z]/.test(formData.password)) {
      showAlert("warning", t("alerts.passwordUppercase"));
      return;
    }
    if (formData.password && !/[a-z]/.test(formData.password)) {
      showAlert("warning", t("alerts.passwordLowercase"));
      return;
    }
    if (formData.password && !/[0-9]/.test(formData.password)) {
      showAlert("warning", t("alerts.passwordNumber"));
      return;
    }
    if (formData.password && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      showAlert("warning", t("alerts.passwordSpecialCharacter"));
      return;
    }
    if (formData.password && !/^[^\s]+$/.test(formData.password)) {
      showAlert("warning", t("alerts.passwordNoWhitespace"));
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
        showAlert("success", t("alerts.signupSuccess"));
      } else {
        const data = await response.json();
        showAlert("error", data.detail || t("alerts.signupFailure"));
      }
    } catch (err) {
      showAlert("error", t("alerts.networkError"));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row",
        "bg-gradient-to-br",
        theme === "dark"
          ? "from-gray-900 via-zinc-900 to-gray-800"
          : "from-blue-50 via-white to-blue-100"
      )}
    >
      {/* Floating alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Left side - Video (only on large screens) */}
      {isLargeScreen && (
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/static/maestrito/maestrito_hello_02.mp4"
              loop
              muted
              playsInline
            />
            {/* Optional overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          {/* Video caption/branding */}
          <div className="absolute bottom-8 left-8 z-10 max-w-lg">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {t("videoCaption")}
            </h2>
          </div>
        </div>
      )}

      {/* Right side - Signup form */}
      <div
        className={cn(
          "flex flex-col justify-center items-center p-6 md:p-12",
          isLargeScreen ? "lg:w-1/2" : "w-full"
        )}
      >
        <div className="w-full max-w-xl">
          <div
            className={cn(
              "flex items-center mb-8",
              isLargeScreen ? "justify-start space-x-6" : "justify-center space-x-4"
            )}
          >
            <img
              src={
                theme === "dark"
                  ? "/static/logos/maestre_logo_white_transparent.webp"
                  : "/static/logos/maestre_logo_blue_transparent.webp"
              }
              alt={t("logoAlt")}
              className="w-28 h-28 drop-shadow-lg"
            />
            <div
              className={cn(isLargeScreen ? "text-left" : "text-center")}
            >
              <h1
                className={cn(
                  "text-4xl font-extrabold",
                  theme === "dark" ? "text-white" : "text-gray-800"
                )}
              >
                {t("welcomeMessage")}{" "}
                <span
                  style={{
                    fontFamily: "'Alfa Slab One', sans-serif",
                  }}
                >
                  MAESTRE
                </span>
              </h1>
              <p
                className={cn(
                  "text-xl mt-2",
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                {t("createAccount")}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "bg-opacity-30 backdrop-filter backdrop-blur-lg",
              "rounded-xl shadow-xl p-8",
              "w-full",
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            )}
          >
            <SignupForm onSubmit={handleSubmit} showAlert={showAlert} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
      `}</style>
    </div>
  );
}
