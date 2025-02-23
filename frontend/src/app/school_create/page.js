"use client";

import { useRouter } from "next/navigation";
import { CreateSchoolForm } from "@/components/school-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function CreateSchool() {
  const router = useRouter();
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);


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
  }, [router]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.region && parsedUser.city && parsedUser.school){
        setEditMode(true);
      }
    }
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/api/schools/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`, // Añade el token de autenticación en el encabezado
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editMode) {
          router.push("/profile_edit?editMode=true");
        }
        else {
          router.push("/complete_profile");
        }
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to create school");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Create your school for other teachers to join too
        </h1>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        `}</style>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <CreateSchoolForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
