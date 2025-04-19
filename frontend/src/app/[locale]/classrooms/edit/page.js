"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ClassroomEditForm } from "@/components/classroom-edit-form";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";

const ClassroomEdit = () => {
  const t = useTranslations("ClassroomEditPage");
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
  const [alert, setAlert] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const searchParams = useSearchParams();
  const [userSchool, setUserSchool] = useState(null);
  const [userStages, setUserStages] = useState(null);
  const params = useParams();
  const locale = params.locale || "es";

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const validateFormData = () => {
    if (formData.name.length > 30) {
      showAlert("warning", t("alerts.nameTooLong"));
      return false;
    }
    if (formData.academic_course.length > 30) {
      showAlert("warning", t("alerts.courseTooLong"));
      return false;
    }
    if (formData.description.length > 255) {
      showAlert("warning", t("alerts.descriptionTooLong"));
      return false;
    }
    if (formData.description.length < 1) {
      showAlert("warning", t("alerts.descriptionEmpty"));
      return false;
    }
    const yearPattern = /^\d{4}-\d{4}$/;
    if (formData.academic_year && !yearPattern.test(formData.academic_year)) {
      showAlert("warning", t("alerts.invalidYearFormat"));
      return false;
    }
    return true;
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserSchool(parsedUser.school);
    } else {
      localStorage.removeItem("authToken");
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/profile/signup");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchStages = async () => {
      if (userSchool) {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/schools/${userSchool}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserStages(data.stages);
          } else {
            showAlert("error", t("alerts.fetchStagesError"));
          }
        } catch (err) {
          showAlert("error", t("alerts.networkError"));
        }
      }
    };
    fetchStages();
  }, [userSchool, t]);

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
      courses: ["1º Grado Medio", "2º Grado Medio", "1º Grado Superior", "2º Grado Superior"],
    },
  ];

  const filteredEducationalStages = educationalStages.filter((stage) =>
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
        .catch(() => {
          showAlert("error", t("alerts.fetchClassroomError"));
        });
    } else {
      router.push("/classrooms");
    }
  }, [router, searchParams, t]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!validateFormData()) return;

    try {
      if (!classroom) {
        showAlert("error", t("alerts.missingClassroomData"));
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
      showAlert("success", t("alerts.updateSuccess"));
      router.push(`/${locale}/classrooms`);
    } catch (err) {
      showAlert("error", t("alerts.updateError"));
    }
  }, [formData, classroom?.id, router, t, locale]);

  const handleDelete = useCallback(async () => {
    if (!classroom) {
      showAlert("error", t("alerts.missingClassroomData"));
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
        showAlert("success", t("alerts.deleteSuccess"));
        router.push(`/${locale}/classrooms`);
      } catch (err) {
        showAlert("error", t("alerts.deleteError"));
      }
    } else {
      showAlert("error", t("alerts.nameMismatch"));
    }
  }, [router, classroom?.id, nameInput, t, locale]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setNameInput("");
  };

  const memorizedForm = useMemo(
    () => (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClassroomEditForm
          formData={formData}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          openDeleteModal={openDeleteModal}
          educationalStages={filteredEducationalStages}
        />
      </div>
    ),
    [formData, handleChange, handleUpdate, openDeleteModal, filteredEducationalStages]
  );

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="relative px-4 z-10 sm:mx-auto sm:w-full sm:max-w-full">
        <h1
          className={cn(
            "mt-6 text-center text-4xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          {t("header.title")}{" "}
          <span
            className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
          >
            {classroom ? classroom.name : ""}
          </span>
        </h1>
        <p
          className={cn(
            "mt-2 text-center text-sm",
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}
        >
          {t("header.subtitle")}
        </p>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          .text-gradient {
            background-size: 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -webkit-text-fill-color: transparent;
            -moz-text-fill-color: transparent;
          }
        `}</style>
      </div>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDeleteModal}
        >
          <div
            className={cn(
              "p-6 rounded-xl max-w-md w-full mx-4",
              theme === "dark" ? "bg-gray-800" : "bg-white",
              "shadow-xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h3
              className={cn(
                "text-xl font-bold mb-2 text-center",
                theme === "dark" ? "text-white" : "text-gray-800"
              )}
            >
              {t("deleteModal.title")}
            </h3>

            <p
              className={cn(
                "mb-6 text-center",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {t("deleteModal.description", { name: classroom?.name })}
            </p>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t("deleteModal.placeholder", { name: classroom?.name })}
              className={cn(
                "w-full px-4 py-2 mb-4 border rounded-md",
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              )}
            />

            <div className="flex justify-center gap-3">
              <button
                onClick={closeDeleteModal}
                className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
              >
                {t("deleteModal.cancel")}
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  router.push(`/${locale}/classrooms`);
                }}
                className="btn-danger py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
              >
                {t("deleteModal.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <br />
      {memorizedForm}

      <div className="my-12"></div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomEdit} />;
};