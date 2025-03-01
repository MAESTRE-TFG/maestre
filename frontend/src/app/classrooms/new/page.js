"use client";

import { useRouter } from "next/navigation";
import { CreateClassroomForm } from "@/components/classroom-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";

export default function CreateClassroom() {
  const router = useRouter();
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const [hasClassrooms, setHasClassrooms] = useState(false);

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

    // Check if there are existing classrooms
    const fetchClassrooms = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/classrooms/", {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHasClassrooms(data.length > 0);
        }
      } catch (err) {
        console.error("Failed to fetch classrooms", err);
      }
    };

    fetchClassrooms();
  }, [router]);

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
        setError(data.detail || "Failed to create classroom");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <SidebarDemo ContentComponent={() => (
      <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
        <br></br>
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
            <h1
              className={cn(
                "fixed top-0 left-0 right-0 mt-6 text-center text-3xl font-extrabold text-zinc-100",
                theme === "dark" ? "text-white" : "text-dark"
              )}
            >
              Create a New Classroom
            </h1>
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          `}</style>
        </div>
        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-4xl">
          <CreateClassroomForm onSubmit={handleSubmit} />
        </div>
      </div>
    )} />
  );
}