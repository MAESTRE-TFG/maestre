"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect, useContext } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { ErrorContext } from "@/context/ErrorContext";

export default function CreateClassroom() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/signup');
      return;
    }

    const fetchClassrooms = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/classrooms/", {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch classrooms");
        }
      } catch (err) {
        console.error("Failed to fetch classrooms", err);
        setErrorMessage("Failed to fetch classrooms");
      }
    };

    fetchClassrooms();
  }, [router]);

  const educationalStages = [
    {
      stage: "Primary",
      courses: ["1º Primary", "2º Primary", "3º Primary", "4º Primary", "5º Primary", "6º Primary"],
    },
    {
      stage: "Secondary",
      courses: ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
    },
    {
      stage: "High School",
      courses: ["1º Bachillerato", "2º Bachillerato"],
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/api/classrooms/", {
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
        setErrorMessage(data.detail || "Failed to create classroom");
      }
    } catch (err) {
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <SidebarDemo ContentComponent={() => (
      <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
      {/* Background Images */}
      {theme === "dark" ? (
        <>
          <img
            src="/static/bubbles black/1.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles black/3.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      ) : (
        <>
          <img
            src="/static/bubbles white/1.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles white/3.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      )}
      {/* End of Background Images */}
      <div className="relative z-10 my-12"></div>
      <br></br>
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
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
        <br />
        <div className="relative z-10 xl:mx-auto xl:w-full xl:max-w-6xl">
          <CreateClassroomForm onSubmit={handleSubmit} setErrorMessage={setErrorMessage} educationalStages={educationalStages} />
        </div>
        <div className="my-12"></div>
      </div>
    )} />
  );
}