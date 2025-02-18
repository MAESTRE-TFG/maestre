"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // useEffect se ejecuta solo en el cliente
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username,
        email: parsedUser.email,
        name: parsedUser.name,
        surname: parsedUser.surname,
      });
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
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
      />
    ),
    [formData, handleChange, handleUpdate]
  );

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {error && <p className="text-red-500">{error}</p>}
        {editMode ? (
          memoizedForm
        ) : (
          <div
            className={cn(
              "max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
              theme === "dark" ? "bg-black" : "bg-white"
            )}
          >
            <div className="my-8">
              <LabelInputContainer className="mb-4">
                <Label>Username</Label>
                <p
                  className={cn(
                    theme === "dark" ? "text-white" : "text-black"
                  )}
                  style={{ fontFamily: "inherit" }}
                >
                  {user?.username}
                </p>
              </LabelInputContainer>
              <br />
              <LabelInputContainer className="mb-4">
                <Label>Email Address</Label>
                <p
                  className={cn(
                    theme === "dark" ? "text-white" : "text-black"
                  )}
                  style={{ fontFamily: "inherit" }}
                >
                  {user?.email}
                </p>
              </LabelInputContainer>
              <br />
              <LabelInputContainer className="mb-4">
                <Label>Name</Label>
                <p
                  className={cn(
                    theme === "dark" ? "text-white" : "text-black"
                  )}
                  style={{ fontFamily: "inherit" }}
                >
                  {user?.name}
                </p>
              </LabelInputContainer>
              <br />
              <LabelInputContainer className="mb-4">
                <Label>Surname</Label>
                <p
                  className={cn(
                    theme === "dark" ? "text-white" : "text-black"
                  )}
                  style={{ fontFamily: "inherit" }}
                >
                  {user?.surname}
                </p>
              </LabelInputContainer>
              <br />
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