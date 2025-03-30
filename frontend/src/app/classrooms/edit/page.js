"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ClassroomEditForm } from "@/components/classroom-edit-form";
import { Modal } from "@/components/ui/modal";

const ClassroomEdit = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classroom, setClassroom] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    academic_course: "",
    academic_year: "",
    description: ""
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const searchParams = useSearchParams();
  const [userSchool, setUserSchool] = useState(null);
  const [userStages, setUserStages] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserSchool(parsedUser.school);
    } else {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
      return;
    }
  }, [router]);


  useEffect(() => {
    const fetchStages = async () => {
      if (userSchool) {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/schools/${userSchool}/`, {
            headers: {
              "Authorization": `Token ${localStorage.getItem('authToken')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserStages(data.stages);
          } else {
            setErrorMessage("Failed to fetch stages");
          }
        } catch (err) {
          setErrorMessage("Network error occurred");
        }
      }
    };
    fetchStages();
  }, [userSchool, setErrorMessage]);


  const educationalStages = [
    {
      stage: "Infantil",
      courses: ["1º Infantil", "2º Infantil", "3º Infantil"],
    },
    {
      stage: "Primaria",
      courses: ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria"],
    },
    {
      stage: "Secundaria",
      courses: ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
    },
    {
      stage: "Bachillerato",
      courses: ["1º Bachillerato", "2º Bachillerato"],
    },
    {
      stage: "FP",
      courses: ["1º FPB", "2º FPB"],
    },
    {
      stage: "Ciclo Formativo",
      courses: ["1º Grado Medio", "2º Grado Medio", "1º Grado Superior", "2º Grado Superior"]
    },
  ];

  const filteredEducationalStages = educationalStages.filter(stage => 
    userStages && userStages.includes(stage.stage)
  );

  useEffect(() => {
    if (searchParams.get("editMode") === "true") {
      setEditMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsClient(true);
    const classroomId = searchParams.get("id");
    if (classroomId) {
      axios
        .get(`${getApiBaseUrl()}/api/classrooms/${classroomId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          setClassroom(response.data);
          setFormData({
            name: response.data.name || "",
            academic_course: response.data.academic_course || "",
            academic_year: response.data.academic_year || "",
            description: response.data.description || "",
          });
        })
        .catch((error) => {
          setErrorMessage("Failed to fetch classroom data");
        });
    } else {
      router.push("/classrooms");
    }
  }, [router, searchParams]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      if (!classroom) {
        setErrorMessage("Classroom data is missing");
        return;
      }
      const yearPattern = /^\d{4}-\d{4}$/;
      if (formData.academic_year && !yearPattern.test(formData.academic_year)) {
        setErrorMessage("Academic Year must be in the format 'YYYY-YYYY'.");
        return;
      }
      const response = await axios.put(
        `${getApiBaseUrl()}/api/classrooms/${classroom.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setClassroom(response.data);
      router.push("/classrooms");
    } catch (err) {
      setErrorMessage("Failed to update classroom data");
    }
  }, [formData, classroom?.id, router]);

  const handleDelete = useCallback(async () => {
    if (!classroom) {
      setErrorMessage("Classroom data is missing");
      return;
    }
    if (nameInput === classroom.name) {
      try {
        await axios.delete(
          `${getApiBaseUrl()}/api/classrooms/${classroom.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        router.push("/classrooms");
      } catch (err) {
        setErrorMessage("Delete failed");
      }
    } else {
      alert("Classroom name does not match. Deletion cancelled.");
    }
  }, [router, classroom?.id, nameInput]);

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
        openDeleteModal={openDeleteModal}
        educationalStages={filteredEducationalStages}
      />
    ),
    [formData, handleChange, handleUpdate, openDeleteModal, filteredEducationalStages]
  );

  if (!isClient) return null;

  return (
    <div className="relative flex flex-col justify-center items-center py-12 sm:px-8 lg:px-8 overflow-auto">
      {/* Background Images */}
      {theme === "dark" ? (
        <>
          <img
            src="/static/bubbles black/6.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles black/5.svg"
            alt="Bubble"
            className="absolute bottom-0 right-0 opacity-50 z-0"
          />
        </>
      ) : (
        <>
          <img
            src="/static/bubbles white/6.svg"
            alt="Bubble"
            className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
          />
          <img
            src="/static/bubbles white/5.svg"
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
        {memoizedForm}
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
            To delete the classroom, please enter its name ({classroom?.name}):
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
};


export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomEdit} />;
}