"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import Alert from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

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
            <div className="w-full max-w-4xl flex items-center mb-8 justify-center md:justify-start space-x-6">
              <img
                src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
                alt="MAESTRE Logo"
                className="w-20 h-20 drop-shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Create a New Classroom
                </h1>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Set up your <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>MAESTRE</span> classroom
                </p>
              </div>
            </div>
            
            <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
            `}</style>
            
            <div className="w-full max-w-4xl">
              <CreateClassroomForm onSubmit={handleSubmit} educationalStages={filteredEducationalStages} />
            </div>
          </div>
        </div>
      </div>
    )} />
  );
}
