"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import Alert from "@/components/ui/Alert";

export default function CreateClassroom() {
  const router = useRouter();
  const { theme } = useTheme();
  const [alert, setAlert] = useState(null);
  const [userSchool, setUserSchool] = useState(null);
  const [userStages, setUserStages] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserSchool(parsedUser.school);
    } else {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ type: "error", message: "Authentication token missing. Redirecting to signup." });
      router.push('/profile/signup');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchStages = async () => {
      if (userSchool) {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/schools/${userSchool}/`, {
            headers: {
              "Authorization": `Token ${localStorage.getItem('authToken')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserStages(data.stages);
          } else {
            setAlert({ type: "error", message: "Failed to fetch stages. Please try again later." });
          }
        } catch (err) {
          setAlert({ type: "error", message: "Network error occurred while fetching stages." });
        }
      }
    };
    fetchStages();
  }, [userSchool]);

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
      courses: ["1º Grado Medio", "2º Grado Medio", "1º Grado Superior", "2º Grado Superior"]
    },
  ];

  const filteredEducationalStages = educationalStages.filter(stage => 
    userStages && userStages.includes(stage.stage)
  );

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${getApiBaseUrl()}/api/classrooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Classroom created successfully!" });
        router.push("/classrooms");
      } else {
        const data = await response.json();
        if (data.error) {
          setAlert({ type: "error", message: data.error });
        } else {
          setAlert({ type: "error", message: "Failed to create classroom. Please try again." });
        }
      }
    } catch (err) {
      setAlert({ type: "error", message: "Network error occurred while creating classroom." });
    }
  };

  return (
    <SidebarDemo ContentComponent={() => (
      <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}


        {/* Header Section */}
        <div className="w-full text-center mb-12 z-10">
          <br />
          <h1
            className={`text-4xl font-bold font-alfa-slab-one mb-4 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Create a New Classroom
          </h1>
        </div>

        {/* Example Button Usage */}
        <div className="flex justify-center mt-6">
          <button
            className={cn(
              "btn btn-md btn-primary",
              theme === "dark" ? "dark:btn-primary" : ""
            )}
            onClick={() => alert("Button clicked!")}
          >
            Add Classroom
          </button>
        </div>
  
        {/* Background Images */}
        {theme === "dark" ? (
          <>
            <img
              src="/static/bubbles black/5.svg"
              alt="Bubble"
              className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
            />
            <img
              src="/static/bubbles black/6.svg"
              alt="Bubble"
              className="absolute bottom-0 right-0 opacity-50 z-0"
            />
          </>
        ) : (
          <>
            <img
              src="/static/bubbles white/5.svg"
              alt="Bubble"
              className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
            />
            <img
              src="/static/bubbles white/6.svg"
              alt="Bubble"
              className="absolute bottom-0 right-0 opacity-50 z-0"
            />
          </>
        )}

        <div className="relative z-10 xl:mx-auto xl:w-full xl:max-w-6xl">
          <CreateClassroomForm onSubmit={handleSubmit} educationalStages={filteredEducationalStages} />
        </div>
        <div className="my-12"></div>
      </div>
    )} />
  );
}
