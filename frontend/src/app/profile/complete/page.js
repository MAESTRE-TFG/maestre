"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CompleteProfileForm } from "@/components/complete-profile-form";
import Alert from "@/components/ui/Alert";
import {
  IconUser,
  IconMail,
  IconIdBadge,
  IconEdit,
  IconWorld,
  IconMapPin,
  IconSchool,
} from "@tabler/icons-react"; // Import necessary icons

const ProfileEdit = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    region: "",
    city: "",
    school: ""
  });
  const [alert, setAlert] = useState(null); // State for managing alerts
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto-dismiss after 5 seconds
  };

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    const storedFormData = localStorage.getItem("formData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prevData) => ({
        ...prevData,
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        name: parsedUser.name || "Default Name",
        surname: parsedUser.surname || "Default Surname",
      }));
    } else {
      router.push("/profile/signin");
    }
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setFormData((prevData) => ({
        ...prevData,
        ...parsedFormData,
        name: parsedFormData.name || "Default Name",
        surname: parsedFormData.surname || "Default Surname",
      }));
      setCity(parsedFormData.city);
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "city") {
      setCity(value);
    }
    if (name === "username" && value.length > 30) {
      showAlert("error", "Username cannot exceed 30 characters.");
      return;
    }
    if (name === "email" && value.length > 255) {
      showAlert("error", "Email cannot exceed 255 characters.");
      return;
    }
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }, [formData]);

  const fetchSchools = useCallback(async () => {
    if (!city) return; 
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/schools/?city=${city}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setSchools(response.data);
    } catch (err) {
      showAlert("error", "Error fetching schools. Please try again later.");
    }
  }, [city]);

  useEffect(() => {
    fetchSchools();
  }, [city, fetchSchools]);

  const handleComplete = useCallback(async () => {
    try {
      if (!formData.username || !formData.email || !formData.name || !formData.surname || !formData.region || !formData.city || !formData.school) {
        showAlert("error", "All fields are required.");
        return;
      }

      if (formData.username.length > 30) {
        showAlert("error", "Username cannot exceed 30 characters.");
        return;
      }

      if (formData.email.length > 255) {
        showAlert("error", "Email cannot exceed 255 characters.");
        return;
      }

      const response = await axios.put(
        `${getApiBaseUrl()}/api/users/${user.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.removeItem("formData");
      setUser(response.data);
      setEditMode(false);
      showAlert("success", "Profile updated successfully.");
    } catch (err) {
      showAlert("error", `Update failed: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
    }
  }, [formData, user?.id]);

  useEffect(() => {
    const handleRouteChange = () => {
      const storedFormData = localStorage.getItem("formData");
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }
      if (city) {
        fetchSchools();
      }
    };

    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [city, router.events, fetchSchools]);

  const handleCreateSchool = useCallback(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    router.push("/schools/new");
  }, [formData, router]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">

      {/* Content container with max width for wider screens */}
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Floating alert */}
        {alert && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
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
                Complete your profile
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                To fully enjoy <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>MAESTRE</span>
              </p>
            </div>
          </div>
          
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          `}</style>
          
          <div className="w-full max-w-4xl">
            <CompleteProfileForm 
              formData={formData}
              handleChange={handleChange}
              handleComplete={handleComplete}
              handleCreateSchool={handleCreateSchool}
              schools={schools}
              buttonClassName="btn" 
              buttonSpacing="space-y-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}