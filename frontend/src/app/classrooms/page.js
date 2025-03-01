"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Label } from "@/components/ui/label";

const ClassroomsList = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

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
    router.push(`/classrooms/edit?id=${classId}&editMode=true`);
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
            src="/static/bubbles black/5.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles black/6.svg"
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
        <div className="flex justify-between items-center sticky top-0 bg-inherit">
          <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
          >
            My Classes
          </h1>
          {classes.length > 0 && (
            <button
            className={cn(
              "mt-4 px-8 py-4 rounded-md text-lg font-medium",
              theme === "dark"
                ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                : "text-black bg-blue-200"
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
                "mt-4 px-8 py-4 rounded-md text-lg font-medium",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-blue-200"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Create New Classroom + 
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {classes.map((classroom) => (
              <div
                key={classroom.id}
                className={cn(
                  "max-w-6xl w-full mx-auto rounded-none md:rounded-2xl p-8 md:p-16 shadow-input",
                  theme === "dark" ? "bg-black text-white" : "bg-green-900 text-white",
                  "min-w-[600px] border-4 border-white text-center"
                )}
                style={{
                  fontFamily: "'Alfa Slab One', sans-serif",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                  backgroundImage: "url('https://res.cloudinary.com/danielmeilleurimg/tictactoe/chalkboard-250')",
                  backgroundSize: "cover"
                }}
              >
                <div className="flex flex-col justify-center items-center">
                  <div>
                    <Label className="text-2xl font-bold text-white">{classroom.name}</Label>
                    <br></br><br></br>
                    <p className="text-lg text-white">{classroom.description}</p>
                    <br></br>
                    <p className="text-md text-white">Course: {classroom.academic_course}</p>
                    <p className="text-md text-white">Año: {classroom.academic_year}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(classroom.id)}
                    className={cn(
                      "relative group/btn block rounded-md h-12 font-medium border border-transparent mt-4",
                      theme === "dark"
                        ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        : "text-black bg-blue-200"
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