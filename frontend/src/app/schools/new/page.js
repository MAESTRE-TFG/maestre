"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { CreateSchoolForm } from "@/components/school-create-form";
import { useTheme } from "@/components/theme-provider";
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
          router.refresh();
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
                src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
                alt="MAESTRE Logo"
                className="w-20 h-20 drop-shadow-lg"
              />
              <div className="text-center">
                <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Create your school
                </h1>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  For other teachers to join <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>MAESTRE</span>
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
    )} />
  );
}
