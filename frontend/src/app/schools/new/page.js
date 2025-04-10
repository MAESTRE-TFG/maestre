"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateSchoolForm } from "@/components/school-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";

export default function CreateSchool() {
  const router = useRouter();
  const { theme } = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
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
      const response = await fetch(`${getApiBaseUrl()}/api/schools/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editMode) {
          router.push("/profile/edit?editMode=true");
        }
        else {
          router.push("/profile/complete");
        }
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || "Failed to create school");
      }
    } catch (err) {
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <SidebarDemo ContentComponent={() => (
      <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
        <br></br>
        <br></br>
        <br></br>
        <div className="relative z-10 my-12"></div>
        <br></br>
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
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
        <div className="my-12"></div>
      </div>
    )} />
  );
}
