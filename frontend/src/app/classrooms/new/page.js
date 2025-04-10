"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";

export default function CreateClassroom() {
  const router = useRouter();
  const { theme } = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);
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
            setErrorMessage("Failed to fetch stages");
          }
        } catch (err) {
          setErrorMessage("Network error occurred");
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
        router.push("/classrooms");
      } else {
        const data = await response.json();
        setErrorMessage("Failed to create classroom");
      }
    } catch (err) {
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <SidebarDemo ContentComponent={() => (
      <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
        {/* Floating Div */}
        <div className="fixed top-0 left-0 w-full z-20 bg-inherit">
          <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-full">
            <div className="h-12"></div>
            <h1
              className={cn(
                "mt-6 text-center text-3xl font-extrabold text-zinc-100",
                theme === "dark" ? "text-white" : "text-dark"
              )}
            >
              Create a New Classroom
            </h1>
            <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
            `}</style>
          </div>
        </div>
        {/* End of Floating Div */}
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
        {/* End of Background Images */}
        <div className="relative z-10 my-12" style={{ height: "300px" }}></div>
        <div className="relative z-10 xl:mx-auto xl:w-full xl:max-w-6xl">
          <CreateClassroomForm onSubmit={handleSubmit} setErrorMessage={setErrorMessage} educationalStages={filteredEducationalStages} />
        </div>
        <div className="my-12"></div>
      </div>
    )} />
  );
}
