"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";

export default function CreateClassroom( params ) {
  const t = useTranslations("ClassroomCreatePage");
  const router = useRouter();
  const { theme } = useTheme();
  const [alert, setAlert] = useState(null);
  const [userSchool, setUserSchool] = useState(null);
  const [userStages, setUserStages] = useState(null);

  const locale = params?.locale || 'es';

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserSchool(parsedUser.school);
    } else {
      localStorage.removeItem("authToken");
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAlert({ type: "error", message: t("alerts.authTokenMissing") });
      router.push(`/${locale}/profile/signup`);
      return;
    }
  }, [router, t]);

  useEffect(() => {
    const fetchStages = async () => {
      if (userSchool) {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/schools/${userSchool}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserStages(data.stages);
          } else {
            setAlert({ type: "error", message: t("alerts.fetchStagesError") });
          }
        } catch (err) {
          setAlert({ type: "error", message: t("alerts.networkError") });
        }
      }
    };
    fetchStages();
  }, [userSchool, t]);

  const educationalStages = [
    {
      stage: "Infantil",
      courses: ["1º Infantil", "2º Infantil", "3º Infantil"],
    },
    {
      stage: "Primaria",
      courses: ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria"],
    },
    {
      stage: "Secundaria",
      courses: ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
    },
    {
      stage: "Bachillerato",
      courses: ["1º Bachillerato", "2º Bachillerato"],
    },
    {
      stage: "FP",
      courses: ["1º FPB", "2º FPB"],
    },
    {
      stage: "Ciclo Formativo",
      courses: ["1º Grado Medio", "2º Grado Medio", "1º Grado Superior", "2º Grado Superior"],
    },
  ];

  const filteredEducationalStages = educationalStages.filter(
    (stage) => userStages && userStages.includes(stage.stage)
  );

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${getApiBaseUrl()}/api/classrooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: t("alerts.success") });
        router.push(`/${locale}/classrooms`);
      } else {
        const data = await response.json();
        if (data.error) {
          setAlert({ type: "error", message: data.error });
        } else {
          setAlert({ type: "error", message: t("alerts.creationFailed") });
        }
      }
    } catch (err) {
      setAlert({ type: "error", message: t("alerts.networkError") });
    }
  };

  return (
    <SidebarDemo
      ContentComponent={() => (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
          <div className="relative mx-auto max-w-7xl w-full">
            {alert && (
              <div className="fixed top-4 right-4 z-50 max-w-md">
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
              </div>
            )}

            <div className="relative w-full flex-1 flex flex-col items-center py-12">
              <div className="w-full max-w-4xl flex items-center mb-8 justify-center md:justify-start space-x-6">
                <img
                  src={
                    theme === "dark"
                      ? "/static/logos/maestre_logo_white_transparent.webp"
                      : "/static/logos/maestre_logo_blue_transparent.webp"
                  }
                  alt={t("header.logoAlt")}
                  className="w-20 h-20 drop-shadow-lg"
                />
                <div className="text-center md:text-left">
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
                    {t("header.subtitle")}
                  </p>
                </div>
              </div>

              <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
              `}</style>

              <div className="w-full max-w-4xl">
                <CreateClassroomForm
                  onSubmit={handleSubmit}
                  educationalStages={filteredEducationalStages}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
