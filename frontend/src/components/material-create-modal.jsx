import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl"; // Import the translation hook

const MaterialCreateModal = ({ 
  showModal, 
  setShowModal, 
  onMaterialCreate,
  isProcessing
}) => {
  const { theme } = useTheme();
  const t = useTranslations("MaterialsPage"); // Use translations for this component
  const [classrooms, setClassrooms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    if (showModal) {
      fetchClassrooms();
    }
  }, [showModal]);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setClassrooms(response.data);
      if (response.data.length > 0) {
        setSelectedClassroom(response.data[0].id);
      }
    } catch (err) {
      showAlert("error", t("alerts.fetchMaterialsError")); // Reused from MaterialsPage
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileName = file.name.split(".").slice(0, -1).join(".");
      setMaterialName(fileName);
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const fileName = file.name.split(".").slice(0, -1).join(".");
      setMaterialName(fileName);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !materialName || !selectedClassroom) {
      showAlert("warning", t("alerts.missingFields")); // New translation key
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", materialName);
      formData.append("classroom", String(selectedClassroom));

      const token = localStorage.getItem("authToken");
      if (!token) {
        showAlert("error", t("alerts.notLoggedIn")); // New translation key
        return;
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/api/materials/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          timeout: 30000,
        }
      );

      if (onMaterialCreate) {
        onMaterialCreate(response.data);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      if (err.response?.status === 401) {
        showAlert("error", t("alerts.sessionExpired"));
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else if (err.response?.status === 400) {
        const errorDetail =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          (typeof err.response?.data === "object"
            ? Object.entries(err.response.data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : err.response?.data);

        showAlert("error", `${t("alerts.uploadError")}: ${errorDetail || t("alerts.invalidData")}`);
      } else if (err.code === "ECONNABORTED") {
        showAlert("error", t("alerts.timeout"));
      } else {
        showAlert("error", `${t("alerts.uploadError")}: ${err.message || t("alerts.unknownError")}`);
      }
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMaterialName("");
    setAlert(null);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={() => {
        setShowModal(false);
        resetForm();
      }}
    >
      <div
        className={cn(
          "p-4 rounded-lg max-w-md w-full mx-4 shadow-lg",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center justify-center mb-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <h3
            className={cn(
              "text-lg font-bold text-center",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {t("createMaterial")}
          </h3>
        </div>

        <div className="mb-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : classrooms.length === 0 ? (
            <p className="text-sm text-red-500">{t("alerts.noClassrooms")}</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-3">
                <label className={cn("block text-sm font-bold mb-1", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                  {t("selectClassroom")} {/* New translation key */}
                </label>
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className={cn(
                    "shadow appearance-none border rounded-md w-full py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
                  )}
                  required
                >
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className={cn("block text-sm font-bold mb-1", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                  {t("materialName")}
                </label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder={t("materialNamePlaceholder")}
                  className={cn(
                    "shadow appearance-none border rounded-md w-full py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
                  )}
                  required
                />
              </div>

              <div className="mb-4">
                <label className={cn("block text-sm font-bold mb-1", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                  {t("uploadFile")} {/* Reused from FileUpload */}
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-md p-4 text-center min-h-[120px] flex flex-col items-center justify-center",
                    theme === "dark" ? "border-gray-600" : "border-gray-300",
                    selectedFile ? "bg-green-500/10" : "",
                    isDragging ? "border-primary bg-primary/5" : ""
                  )}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {selectedFile.name}
                      </p>
                      <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="mt-2 px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:underline"
                        type="button"
                      >
                        {t("removeFile")} {/* New translation key */}
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {isDragging ? t("dropIt") : t("dragOrDrop")}
                      </p>
                      <label className="px-3 py-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors inline-block">
                        {t("browseFiles")}
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">{t("supportedFormats")}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={isProcessing}
                  className="btn-secondary py-1 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                >
                  {t("cancel")} {/* Reused from MaterialsPage */}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || isLoading || classrooms.length === 0 || !selectedFile || !materialName}
                  className="btn-success py-1 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                >
                  {isProcessing ? t("creating") : t("createMaterial")} {/* Reused and new keys */}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCreateModal;