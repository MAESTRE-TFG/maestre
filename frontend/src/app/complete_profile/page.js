"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback, use } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CompleteProfileForm } from "@/components/complete-profile-form";

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
  const [error, setError] = useState(null);
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");

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
        name: parsedUser.name || "Default Name", // Set default value if name is empty
        surname: parsedUser.surname || "Default Surname", // Set default value if surname is empty
      }));
    } else {
      router.push("/signin");
    }
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setFormData((prevData) => ({
        ...prevData,
        ...parsedFormData,
        name: parsedFormData.name || "Default Name", // Set default value if name is empty
        surname: parsedFormData.surname || "Default Surname", // Set default value if surname is empty
      }));
      setCity(parsedFormData.city);
      console.log("Parsed form data:", parsedFormData);
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "city") {
      setCity(value);
    }
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }, [formData]);

  const fetchSchools = useCallback(async () => {
    if (!city) return; 
    try {
      const response = await axios.get(`http://localhost:8000/api/schools/?city=${city}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setSchools(response.data);
    } catch (err) {
      console.error("Error fetching schools:", err); // Log the error for debugging
      setError("Error fetching schools. Please try again later.");
    }
  }, [city]);

  useEffect(() => {
    fetchSchools();
  }, [city, fetchSchools]);

  const handleComplete = useCallback(async () => {
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.put(
        `http://localhost:8000/api/users/${user.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.removeItem("formData");
      setUser (response.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError("Update failed");
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
    router.push("/school_create");
  }, [formData, router]);

  if (!isClient) return null;

  return (
    <div className="flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
            {/* Background Images */}
            {theme === "dark" ? (
        <>
          <img
            src="/static/bubbles black/3.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles black/4.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      ) : (
        <>
          <img
            src="/static/bubbles white/3.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles white/4.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      )}
      {/* End of Background Images */}
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
      {error && <div className="text-red-500">{error}</div>}
      <CompleteProfileForm 
        formData={formData}
        handleChange={handleChange}
        handleComplete={handleComplete}
        handleCreateSchool={handleCreateSchool}
        schools={schools}
        error={error}
      />
    </div>
  );
}


export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}