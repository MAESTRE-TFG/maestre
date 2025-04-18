"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateSchoolForm } from "@/components/school-create-form";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";

export default function CreateSchool( params ) {
  const router = useRouter();
  const { theme } = useTheme();
  const t = useTranslations("CreateSchoolPage");
  const [alert, setAlert] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const locale = params?.locale || "es";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.removeItem("authToken");
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAlert({ type: "error", message: t("alerts.mustSignUp") });
      router.push(`/${locale}/profile/signup`);
      return;
    }
  }, [router, t, locale]);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${getApiBaseUrl()}/api/schools/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: "success", message: t("alerts.success") });
        if (editMode) {
          router.refresh();
          router.push(`/${locale}/profile/edit?editMode=true`);
        } else {
          router.push(`/${locale}/profile/complete`);
        }
      } else {
        const data = await response.json();
        setAlert({ type: "error", message: data.detail || t("alerts.failure") });
      }
    } catch (err) {
      setAlert({ type: "error", message: t("alerts.networkError") });
    }
  };

  return (
    <SidebarDemo
      ContentComponent={() => (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
          {/* Content container with max width for wider screens */}
          <div className="relative mx-auto max-w-7xl w-full">
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

            <div className="relative w-full flex-1 flex flex-col items-center py-12">
              {/* Header Section with Logo */}
              <div className="w-full max-w-4xl flex items-center mb-8 justify-center space-x-6">
                <img
                  src={
                    theme === "dark"
                      ? "/static/logos/maestre_logo_white_transparent.webp"
                      : "/static/logos/maestre_logo_blue_transparent.webp"
                  }
                  alt={t("header.logoAlt")}
                  className="w-20 h-20 drop-shadow-lg"
                />
                <div className="text-center">
                  <h1
                    className={`text-4xl font-extrabold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {t("header.title")}
                  </h1>
                  <p
                    className={`text-xl ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("header.subtitle")}{" "}
                    <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                      MAESTRE
                    </span>
                  </p>
                </div>
              </div>

              <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
              `}</style>

              <div className="w-full max-w-4xl">
                <CreateSchoolForm onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
