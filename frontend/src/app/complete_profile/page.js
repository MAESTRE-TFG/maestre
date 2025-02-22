"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback, use } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ProfileEditForm } from "@/components/profile_edit-form";
import { CompleteProfileForm } from "@/components/complete-profile-form";

const ProfileEdit = () => {
  const router = useRouter();
  const { theme } = useTheme();
  // Inicializamos sin usar window en el constructor
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
    school: ""   // Se inicializa como string vacío
  });
  const [error, setError] = useState(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(null);
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");

  useEffect(() => {
    // useEffect se ejecuta solo en el cliente
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prevData) => ({
        ...prevData,
        username: parsedUser.username,
        email: parsedUser.email,
        name: parsedUser.name,
        surname: parsedUser.surname,
      }));
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Si el campo modificado es "city", actualizamos el estado 'city'
    if (name === "city") {
      setCity(value);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/schools/?city=${city}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setSchools(response.data);
      } catch (err) {
        setError("Error fetching schools");
      }
    };

    if (city) {
      fetchSchools();
    }
  }, [city]);

  const handleComplete = useCallback(async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${user.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
  }, [formData, user?.id]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
        schools={schools}
      />
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const BottomGradient = ({ isCancel }) => {
  return (
    <>
      <span
        className={cn(
          "group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
          isCancel
            ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        )}
      />
      <span
        className={cn(
          "group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
          isCancel
            ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        )}
      />
    </>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}