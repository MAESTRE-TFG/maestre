"use client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";
import { formatExamText, createPDFVersion } from "./utils/pdfUtils";
import {
  uploadPDFToClassroom,
  processUploadedFile,
  processMaterialFromClassroom,
  generateExam
} from "./utils/apiUtils";
import ExamForm from "./components/ExamForm";
import MaterialsModal from "./components/MaterialsModal";
import ExamResultModal from "./components/ExamResultModal";
import axios from "axios";
import Image from "next/image";
import { IconFileText, IconBrain } from "@tabler/icons-react";
import { buildExamPrompt } from "./utils/promptUtils";
import { getApiBaseUrl } from "@/lib/api";
import { useTranslations } from "next-intl";

const ExamMaker = ({ params }) => {
  const t = useTranslations("ExamMaker");
  const { theme } = useTheme();
  const locale = params?.locale || "es";
  const router = useRouter();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    numQuestions: 5,
    questionType: "multiple_choice",
    classroom: "",
    scoringStyle: "equal",
    customScoringDetails: "",
    additionalInfo: "",
    totalPoints: 10,
    llmModel: "llama3.2:3b",
    examName: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userMaterials, setUserMaterials] = useState([]);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileContentsRef = useRef("");

  // Fetch classrooms on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push(`/${locale}/signin`);
      return;
    }

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setClassrooms(response.data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }

        setLoading(false);
      } catch (error) {
        addAlert("error", t("alerts.fetchClassroomsError"));
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [router, t]);

  // Fetch user materials when classrooms are loaded
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user && classrooms.length > 0) {
      const fetchUserMaterials = async () => {
        try {
          const response = await axios.get(`${getApiBaseUrl()}/api/materials/`, {
            headers: {
              Authorization: `Token ${token}`
            }
          });

          // Filter materials by user's classrooms
          const userMaterials = response.data.filter(material =>
            classrooms.some(c => c.id.toString() === material.classroom.toString())
          );

          setUserMaterials(userMaterials);
        } catch (err) {
          addAlert("error", t("alerts.fetchMaterialsError"));
        }
      };

      fetchUserMaterials();
    }
  }, [classrooms, t]);

  // Alert management
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  // Form change handler
  const handleChange = e => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value
    }));
  };

  // File upload handler
  const handleFileUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);

    try {
      const token = localStorage.getItem("authToken");
      const processedFile = await processUploadedFile(file, token);

      setUploadedFiles([processedFile]);
      fileContentsRef.current = processedFile.content;
      addAlert("success", t("alerts.fileProcessedSuccess"));
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Material selection handler
  const handleMaterialSelect = async material => {
    if (!material.file.toLowerCase().endsWith(".docx")) {
      addAlert("error", t("alerts.unsupportedFileType"));
      setShowMaterialsModal(false);
      return;
    }

    setIsProcessingFile(true);
    setShowMaterialsModal(false);

    try {
      const token = localStorage.getItem("authToken");
      const processedMaterial = await processMaterialFromClassroom(material, token);

      setUploadedFiles([processedMaterial]);
      fileContentsRef.current = processedMaterial.content;
      addAlert("success", t("alerts.materialProcessedSuccess"));
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = id => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    fileContentsRef.current = "";
  };

  // Form submission handler
  const handleSubmit = async e => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Validate form data
      if (!formData.subject) {
        throw new Error(t("alerts.missingSubject"));
      }

      if (!formData.classroom) {
        throw new Error(t("alerts.missingClassroom"));
      }

      // Get user data from localStorage
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : {};

      // Build the prompt using the utility function
      const prompt = buildExamPrompt(formData, classrooms, fileContentsRef.current, user);

      // Generate the exam
      const token = localStorage.getItem("authToken");
      const result = await generateExam(prompt, formData.llmModel);

      setExamResult(result);
      setShowModal(true);
      addAlert("success", t("alerts.examGeneratedSuccess"));
    } catch (error) {
      addAlert("error", `${t("alerts.examGenerationFailed")}: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Alerts */}
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              type={alert.type}
              message={alert.message}
              onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
            />
          ))}
        </div>

        <div className="relative w-full flex-1 flex flex-col items-center py-12">
          {/* Header Section */}
          <div className="w-full max-w-4xl flex items-center mb-8 justify-center space-x-6">
            <div className="relative">
              <IconBrain className="w-20 h-20 drop-shadow-lg text-primary" />
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                <IconFileText className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
            <div className="text-center">
              <h1 className={`text-4xl font-extrabold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {t("header.title")}
              </h1>
              <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {t("header.subtitle")}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teacher Image Column */}
              <div className="hidden md:flex flex-col items-center justify-start">
                <div
                  className={cn(
                    "mt-6 p-4 rounded-xl shadow-md w-full",
                    theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white/80 border border-gray-100"
                  )}
                >
                  <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                    {t("header.featureTitle")}
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {t("header.featureDescription")}
                  </p>
                </div>

                <div className="relative w-full h-[700px] -mt-16 flex items-center justify-center">
                  <div className="animate-float relative w-96 h-full">
                    <Image
                      src="/static/teachers/6.webp"
                      alt={t("header.teacherImageAlt")}
                      layout="fill"
                      objectFit="contain"
                      className="drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="col-span-1 md:col-span-2">
                <div
                  className={cn(
                    "p-6 rounded-xl shadow-lg",
                    "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                    theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                  )}
                >
                  <ExamForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isGenerating={isGenerating}
                    classrooms={classrooms}
                    uploadedFiles={uploadedFiles}
                    handleFileUpload={handleFileUpload}
                    removeUploadedFile={removeUploadedFile}
                    isProcessingFile={isProcessingFile}
                    setShowMaterialsModal={setShowMaterialsModal}
                    userMaterials={userMaterials}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Modal */}
      <MaterialsModal
        showModal={showMaterialsModal}
        setShowModal={setShowMaterialsModal}
        userMaterials={userMaterials}
        handleMaterialSelect={handleMaterialSelect}
        isProcessingFile={isProcessingFile}
      />

      {/* Exam Result Modal */}
      <ExamResultModal
        showModal={showModal}
        setShowModal={setShowModal}
        examResult={examResult}
        formatExamText={formatExamText}
        createPDFVersion={createPDFVersion}
        uploadPDFToClassroom={uploadPDFToClassroom}
        formData={formData}
        addAlert={addAlert}
      />
    </div>
  );
};

// Add the floating animation keyframes
const styles = `
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;

export default function Main() {
  return (
    <>
      <style jsx global>{styles}</style>
      <SidebarDemo ContentComponent={ExamMaker} />
    </>
  );
}