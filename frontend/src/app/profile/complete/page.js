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
    <div className="flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <div className="my-12"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-full"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded-md md:rounded-2xl">
        <h4
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Complete your profile to fully enjoy <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>MAESTRE</span>
        </h4>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        `}</style>
      </div>
      <br />
      <CompleteProfileForm 
        formData={formData}
        handleChange={handleChange}
        handleComplete={handleComplete}
        handleCreateSchool={handleCreateSchool}
        schools={schools}
      />
    </div>
  );
}

export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}