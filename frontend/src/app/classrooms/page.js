"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Label } from "@/components/ui/label";

const ClassroomsList = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.id)
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
          params: {
            creator: user.id 
          },
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setClasses(response.data);
      } catch (err) {
        setErrorMessage("Failed to fetch classes");
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

  const truncateDescription = (description) => {
    return description.length > 40 ? `${description.substring(0, 60)}...` : description;
  };

  if (!isClient) return null;

  return (
    <div className="relative flex flex-col justify-center items-center py-8 sm:px-8 lg:px-8 overflow-auto">
      {/* Floating Div */}
      <div className="fixed top-0 left-0 w-full z-10 bg-inherit backdrop-blur-md">
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
          <div className="h-12"></div>
          <div className="flex justify-center items-center sticky top-0 bg-inherit px-4 space-x-4">
            <h1
              className={cn(
                "text-3xl font-extrabold text-zinc-100",
                theme === "dark" ? "text-white" : "text-dark"
              )}
            >
              My Classes
            </h1>
            <div className="h-12"></div>
            {classes.length > 0 && (
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-lg font-medium border border-green-500",
                  theme === "dark"
                    ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                )}
                onClick={() => router.push("/classrooms/new")}
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
              >
                Create Classroom +
                <BottomGradient isCreate={true} />
              </button>
            )}
            <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
            `}</style>
          </div>
        </div>
      </div>
      {/* End of Floating Div */}
      {/* Background Images */}
      {theme === "dark" ? (
        <>
          <img
            src="/static/bubbles black/5.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
        </>
      ) : (
        <>
          <img
            src="/static/bubbles white/5.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
        </>
      )}
      {/* End of Background Images */}
      <div className="relative my-8" style={{ height: "250px" }}></div>
      <div className="relative xl:mx-auto xl:w-full xl:max-w-6xl">
        {classes.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-bold">No classes found.</p>
            <button
              onClick={handleCreate}
              className={cn(
                "mt-4 px-8 py-4 rounded-md text-lg font-medium border border-green-500 mt-4",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Create New Classroom + 
              <BottomGradient isCreate={true} />
            </button>
          </div>
        ) : (
          <div className={`grid ${classes.length === 1 ? "justify-center" : "grid-cols-1 md:grid-cols-2"} gap-6`}>
            {classes.map((classroom) => (
              <div
                key={classroom.id}
                className={cn(
                  "max-w-full w-full mx-auto rounded-none md:rounded-2xl p-8 md:p-16 shadow-input relative",
                  theme === "dark" ? "bg-black text-white" : "bg-green-900 text-white",
                  "border-4 border-white text-center"
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
                    <Label 
                      className="text-2xl font-bold text-white cursor-pointer hover:underline" 
                      onClick={() => router.push(`/classrooms/${classroom.id}`)}
                    >
                      {classroom.name}
                    </Label>
                    <br></br><br></br>
                    <p className="text-lg text-white">{truncateDescription(classroom.description)}</p>
                    <br></br>
                    <p className="text-md text-white">Course: {classroom.academic_course}</p>
                    <p className="text-md text-white">Year: {classroom.academic_year}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(classroom.id)}
                    className={cn(
                      "absolute bottom-4 right-4 rounded-md h-10 px-6 font-medium border border-green-400",
                      theme === "dark"
                        ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                    )}
                    type="button"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    Edit &rarr;
                    <BottomGradient isCreate={false} />
                  </button>
                  <button
                    onClick={() => router.push(`/classrooms/${classroom.id}`)}
                    className={cn(
                      "absolute bottom-4 left-4 rounded-md h-10 px-6 font-medium border border-green-400",
                      theme === "dark"
                        ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                    )}
                    type="button"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    Open class
                    <BottomGradient isCreate={false} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomsList} />;
}

const BottomGradient = ({ isCreate }) => {
  return (<>
    <span className={cn("group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0", 
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent")} />
    <span className={cn("group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10", 
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent")} />
  </>);
};