"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ClassroomEditForm } from "@/components/classroom_edit-form";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

const ClassroomEdit = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classroom, setClassroom] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    academic_course: "",
    description: "",
    academic_year: ""
  });
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("editMode") === "true") {
      setEditMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsClient(true);
    const fetchClassroom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/classrooms/${searchParams.get("id")}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const classroomData = response.data;
        setClassroom(classroomData);
        setFormData({
          name: classroomData.name || "",
          academic_course: classroomData.academic_course || "",
          description: classroomData.description || "",
          academic_year: classroomData.academic_year || ""
        });
      } catch (err) {
        setError("Failed to fetch classroom details");
        router.push("/signin");
      }
    };

    fetchClassroom();
  }, [router, searchParams]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/classrooms/${classroom.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setClassroom(response.data);
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
  }, [formData, classroom?.id]);

  const handleDelete = useCallback(async () => {
    if (nameInput === classroom.name) {
      try {
        await axios.delete(
          `http://localhost:8000/api/classrooms/${classroom.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        router.push("/classrooms");
      } catch (err) {
        setError("Delete failed");
      }
    } else {
      alert("Classroom name does not match. Deletion cancelled.");
    }
  }, [router, classroom?.id, classroom?.name, nameInput]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setNameInput("");
  };

  const memoizedForm = useMemo(
    () => (
      <ClassroomEditForm
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
        <h1
          className={cn(
            "mt-6 text-center text-3xl font-extrabold text-zinc-100",
            theme === "dark" ? "text-white" : "text-dark"
          )}
        >
          Edit Classroom{" "}
          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            {classroom ? classroom.name : ""}
          </span>
        </h1>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        `}</style>
      </div>
      <br />
      <div className="relative z-10 xl:mx-auto xl:w-full xl:max-w-6xl">
        {error && <p className="text-red-500">{error}</p>}
        {editMode ? (
          memoizedForm
        ) : (
          <div className={cn("max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white", "min-w-[300px]")}>
            <style jsx global>{
              `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');
              select {
                appearance: none;
                background: ${theme === "dark" ? "#333" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
                border: 1px solid ${theme === "dark" ? "#555" : "#ccc"};
                padding: 0.5rem;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
              }
              select:focus {
                outline: none;
                border-color: ${theme === "dark" ? "#888" : "#007bff"};
                box-shadow: 0 0 0 3px ${theme === "dark" ? "rgba(136, 136, 136, 0.5)" : "rgba(0, 123, 255, 0.25)"};
              }
              option {
                background: ${theme === "dark" ? "#333" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
              }`
            }</style>
            <div className="my-1">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
                <LabelInputContainer className="mb-4">
                  <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}>🏫 Classroom Name</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                  >
                    {classroom?.name}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}>📚 Academic Course</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                  >
                    {classroom?.academic_course}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}>📝 Description</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                  >
                    {classroom?.description}
                  </p>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}>📅 Academic Year</Label>
                  <p
                    className={cn(theme === "dark" ? "text-white" : "text-black")}
                  >
                    {classroom?.academic_year}
                  </p>
                </LabelInputContainer>
              </div>
            </div>
            </div>
            <br/>
            <button
              onClick={() => setEditMode(true)}
              className={cn(
                "relative group/btn block w-full rounded-md h-10 font-medium border border-transparent mb-4",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
              )}
              type="submit"
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Edit &rarr;
              <BottomGradient />
            </button>
            <button
              onClick={openDeleteModal}
              className={cn(
                "relative group/btn block w-full mx-auto rounded-md h-10 font-medium border border-transparent mt-4",
                theme === "dark"
                  ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-red-300"
              )}
              type="submit"
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Delete Classroom
              <BottomGradient isCancel />
            </button>
          </div>
        )}
        <br />
      </div>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Delete Classroom">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4"
            style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }}
          >
            Delete Classroom</h2>
          <p className="mb-4">
            Are you sure you want to delete this classroom? This action cannot be undone.
          </p>
          <p className="mb-4">
            To delete the classroom, please enter its name ({classroom.name}):
          </p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className={cn(
              "relative group/btn block w-full mx-auto rounded-md h-10 font-medium border border-orange-500 mt-4",
              theme === "dark"
                ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            )}
          />
          <br></br>
          <div className="flex justify-end">
            <button
              onClick={closeDeleteModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <div className="my-12"></div>
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
  return <SidebarDemo ContentComponent={ClassroomEdit} />;
}