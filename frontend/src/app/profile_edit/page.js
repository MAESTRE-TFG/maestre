"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback, use } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ProfileEditForm } from "@/components/profile_edit-form";
import { Label } from "@/components/ui/label";

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
    school: ""
  });
  const [error, setError] = useState(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(null);
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");

  useEffect(() => {
    // useEffect se ejecuta solo en el cliente
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      parsedUser.region && parsedUser.city && parsedUser.school ? 
        setIsProfileCompleted(true) : 
        setIsProfileCompleted(false);
      setCity(parsedUser.city);
      setFormData((prevData) => ({
        ...prevData,
        username: parsedUser.username,
        email: parsedUser.email,
        name: parsedUser.name,
        surname: parsedUser.surname,
        region: parsedUser.region,
        city: parsedUser.city,
        school: parsedUser.school
      }));
    } else {
      router.push("/signin");
    }
  }, [router]);

  useEffect(() => {
  const getSchools = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schools/?city=${formData.city}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSchools(response.data);
    } catch (err) {
      setError("Failed to fetch schools");
    }
  };

  if (formData.city) {
    getSchools();
  }
}, [formData.city]);

  useEffect(() => {
    const getSchoolById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/schools/${formData.school}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSchool(response.data);
      } catch (err) {
        setError("Failed to fetch school");
      }
    };

    if (formData.school) {
      getSchoolById();
    }
  }, [formData.school]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Si el campo modificado es "city", actualizamos el estado 'city'
    if (name === "city") {
      setCity(value);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);


  const handleUpdate = useCallback(async () => {
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
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
  }, [formData, user?.id]);

  const handleDelete = useCallback(async () => {
    const confirmationMessage = `¿Estás seguro de que deseas eliminar tu cuenta de MAESTRE? Esto eliminará también todos tus cursos y material subido a la plataforma. Esta acción NO se puede deshacer.\n\nPara borrar tu cuenta, escribe antes tu nombre de usuario (${user.username}):`;
    const userInput = prompt(confirmationMessage);

    if (userInput === user.username) {
      try {
        await axios.delete(
          `http://localhost:8000/api/users/${user.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/signin");
      } catch (err) {
        setError("Delete failed");
      }
    } else {
      alert("Username does not match. Account deletion cancelled.");
    }
  }, [router, user?.id, user?.username]);

  const memoizedForm = useMemo(
    () => (
      <ProfileEditForm
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        handleCancel={() => setEditMode(false)}
        schools={schools}
      />
    ),
    [formData, handleChange, handleUpdate, schools]
  );

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen overflow-y-auto items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Hello{" "}
          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            {user ? user.name : ""}
          </span>{" "}
          !
        </h1>
        <h4
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          See and edit your profile and data.
        </h4>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        `}</style>
      </div>
      <br />
      <div className="sm:mx-auto sm:w-full sm:max-w-full" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
        {error && <p className="text-red-500">{error}</p>}
        {editMode ? (
          memoizedForm
        ) : (
          <div
            className={cn(
              "max-w-lg w-full justify-center items-center mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
              theme === "dark" ? "bg-black" : "bg-white"
            )}
          >
            <div className="my-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 border border-gray-300 rounded-md p-4">
                <LabelInputContainer className="mb-4">
                  <Label>Username</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.username}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label>Email Address</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.email}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label>Name</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.name}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label>Surname</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.surname}
                  </p>
                </LabelInputContainer>
              </div>
              <div className="flex-1 border border-gray-300 rounded-md p-4">
                <LabelInputContainer className="mb-10">
                  <Label>Region</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.region}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-10">
                  <Label>City</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {user?.city}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label>School</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                    style={{ fontFamily: "inherit" }}
                  >
                    {school?.name}
                  </p>
                </LabelInputContainer>
              </div>
            </div>
            </div>
            <br />
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className={cn(
                  "relative group/btn block w-full rounded-md h-10 font-medium border border-transparent",
                  theme === "dark"
                    ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
                )}
                type="submit"
              >
                Edit &rarr;
                <BottomGradient />
              </button>
              {isProfileCompleted === false && (
                <button
                  onClick={() => router.push('/complete_profile')}
                  className={cn(
                    "relative group/btn block w-full rounded-md h-10 font-medium border border-transparent",
                    theme === "dark"
                      ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900"
                      : "text-black bg-gradient-to-br from-white to-neutral-100 border border-blue-300"
                  )}
                  type="button"
                >
                  Complete Profile &rarr;
                  <BottomGradient />
                </button>
              )}
            </div>
            <button
              onClick={handleDelete}
              className={cn(
                "relative group/btn block w-full mx-auto rounded-md h-10 font-medium border border-transparent mt-4",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
              )}
              type="submit"
            >
              Delete Account
              <BottomGradient isCancel />
            </button>
          </div>
        )}
      </div>
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