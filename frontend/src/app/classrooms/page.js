"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

const ClassroomsList = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [hasClassrooms, setHasClassrooms] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classrooms/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setClasses(response.data);
      } catch (err) {
        setError("Failed to fetch classes");
      }
    };
    fetchClasses();
  }, []);

  const handleEdit = (classId) => {
    router.push(`/classrooms/edit/${classId}`);
  };

  const handleCreate = () => {
    router.push("/classrooms/new");
  };

  if (!isClient) return null;

  return (
    <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
      {/* Background Images */}
      {theme === "dark" ? (
        <>
          <img
            src="/static/bubbles black/1.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles black/3.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      ) : (
        <>
          <img
            src="/static/bubbles white/1.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles white/3.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      )}
      {/* End of Background Images */}
      <div className="relative z-10 my-12"></div>
      <br></br>
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
        <div className="h-12"></div>
        <div className="flex justify-between items-center">
          <h1
            className={cn(
              "mt-6 text-center text-3xl font-extrabold text-zinc-100 mx-auto",
              theme === "dark" ? "text-white" : "text-dark"
            )}
          >
            My Classes
          </h1>
          {hasClassrooms && (
            <button
              className={cn(
                "ml-4 px-4 py-2 rounded-md text-sm font-medium",
                theme === "dark"
                  ? "text-white bg-zinc-800"
                  : "text-black bg-gray-200"
              )}
              onClick={() => router.push("/classrooms/new")}
            >
              + Create Classroom
            </button>
          )}
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          `}</style>
        </div>
      </div>
      <br />
      <div className="relative z-10 xl:mx-auto xl:w-full xl:max-w-6xl">
        {error && <p className="text-red-500">{error}</p>}
        {classes.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-bold">No classes found.</p>
            <button
              onClick={handleCreate}
              className={cn(
                "mt-4 px-6 py-3 rounded-md text-lg font-medium",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Create New Classroom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {classes.map((classroom) => (
              <div
                key={classroom.id}
                className={cn(
                  "max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
                  theme === "dark" ? "bg-black" : "bg-white",
                  "min-w-[300px]"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-lg font-bold">{classroom.name}</Label>
                    <p>{classroom.description}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(classroom.id)}
                    className={cn(
                      "relative group/btn block rounded-md h-10 font-medium border border-transparent",
                      theme === "dark"
                        ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
                    )}
                    type="button"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    Edit &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="my-12"></div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomsList} />;
}