"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateSchoolForm } from "@/components/school-create-form";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import Alert from "@/components/ui/Alert";

export default function CreateSchool() {
  const router = useRouter();
  const { theme } = useTheme();
  const [alert, setAlert] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ type: "error", message: "You must sign up to create a school." });
      router.push('/profile/signup');
      return;
    }
  }, [router]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.region && parsedUser.city && parsedUser.school) {
        setAlert({ type: "info", message: "Edit mode enabled for your school." });
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
        setAlert({ type: "success", message: "School created successfully!" });
        if (editMode) {
          router.push("/profile/edit?editMode=true");
        } else {
          router.push("/profile/complete");
        }
      } else {
        const data = await response.json();
        setAlert({ type: "error", message: data.detail || "Failed to create school." });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Network error occurred." });
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
        <div className="w-full text-center mb-12">
          <br></br>
          <h1 className={`text-4xl font-bold font-alfa-slab-one mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Create your school for other teachers to join too!
          </h1>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CreateSchoolForm onSubmit={handleSubmit} />
        </div>
        <div className="my-12"></div>
      </div>
    )} />
  );
}
