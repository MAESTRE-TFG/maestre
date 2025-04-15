"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Label } from "@/components/ui/label";
import Alert from "@/components/ui/Alert";

const ClassroomsList = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
          params: {
            creator: user.id,
          },
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setClasses(response.data);
      } catch (err) {
        setAlert({ type: "error", message: "Failed to fetch classes. Please try again later." });
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
    <div className="relative flex flex-col justify-center items-center py-8 sm:px-8 lg:px-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {/* Header Section */}
      <div className="w-full text-center mb-12 z-10">
        <br></br>
        <h1 className={`text-4xl font-bold font-alfa-slab-one mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          My Classrooms
        </h1>
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
      <div className="relative xl:mx-auto xl:w-full xl:max-w-6xl">
        {classes.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-bold">No classes found.</p>
            <button
              onClick={handleCreate}
              className={cn(
                "btn btn-md btn-primary", // Use the new btn styles
                theme === "dark" ? "dark:btn-primary" : ""
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Create New Classroom +
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
                      "btn btn-md btn-secondary", // Use the new btn styles
                      theme === "dark" ? "dark:btn-secondary" : ""
                    )}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    Edit &rarr;
                  </button>
                  <button
                    onClick={() => router.push(`/classrooms/${classroom.id}`)}
                    className={cn(
                      "btn btn-md btn-success", // Use the new btn styles
                      theme === "dark" ? "dark:btn-success" : ""
                    )}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    Open Class
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
  return (
    <>
      <span
        className={cn(
          "group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
          isCreate
            ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        )}
      />
      <span
        className={cn(
          "group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
          isCreate
            ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        )}
      />
    </>
  );
};