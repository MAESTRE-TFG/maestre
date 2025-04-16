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

// Import the prompt utility
import { buildExamPrompt } from "./utils/promptUtils";

const ExamMaker = () => {
  const { theme } = useTheme();
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
  const promptRef = useRef("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userMaterials, setUserMaterials] = useState([]);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileContentsRef = useRef('');

  // Fetch classrooms on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/login');
      return;
    }

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classrooms/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setClassrooms(response.data);
        setLoading(false);
      } catch (error) {
        addAlert("error", "Failed to fetch classrooms. Please try again later.");
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [router]);

  // Fetch user materials when classrooms are loaded
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user && classrooms.length > 0) {
      const fetchUserMaterials = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/materials/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // Filter materials by user's classrooms
          const userMaterials = response.data.filter(material =>
            classrooms.some(c => c.id.toString() === material.classroom.toString())
          );

          setUserMaterials(userMaterials);
        } catch (err) {
          addAlert("error", "Failed to fetch materials. Please try again later.");
        }
      };

      fetchUserMaterials();
    }
  }, [classrooms]);

  // Alert management
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);

    try {
      const token = localStorage.getItem('authToken');
      const processedFile = await processUploadedFile(file, token);

      setUploadedFiles([processedFile]);
      fileContentsRef.current = processedFile.content;
      addAlert("success", "File processed successfully!");
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Material selection handler
  const handleMaterialSelect = async (material) => {
    if (!material.file.toLowerCase().endsWith('.docx')) {
      addAlert("error", "Only DOCX files are supported for exam generation.");
      setShowMaterialsModal(false);
      return;
    }

    setIsProcessingFile(true);
    setShowMaterialsModal(false);

    try {
      const token = localStorage.getItem('authToken');
      const processedMaterial = await processMaterialFromClassroom(material, token);

      setUploadedFiles([processedMaterial]);
      fileContentsRef.current = processedMaterial.content;
      addAlert("success", "Material processed successfully!");
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    fileContentsRef.current = '';
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
  
    try {
      // Validate form data
      if (!formData.subject) {
        throw new Error("Please enter a subject.");
      }
  
      if (!formData.classroom) {
        throw new Error("Please select a classroom.");
      }
  
      // Get user data from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : {};
  
      // Build the prompt using the utility function
      const prompt = buildExamPrompt(formData, classrooms, fileContentsRef.current, user);
      
      console.log(prompt); // Log the prompt for debugging purpose
  
      // Generate the exam
      const token = localStorage.getItem('authToken');
      const result = await generateExam(prompt, formData.llmModel);
  
      setExamResult(result);
      setShowModal(true);
      addAlert("success", "Exam generated successfully!");
    } catch (error) {
      addAlert("error", `Failed to generate exam: ${error.message}`);
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
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className={cn(
          "container mx-auto py-8 px-4 sm:px-6 lg:px-8",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}>
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

          <div className="max-w-5xl mx-auto">
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              Exam Generator
            </h1>
            <p className={cn(
              "mb-8",
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            )}>
              Create customized exams for your students with AI assistance
            </p>

            <div className={cn(
              "p-6 rounded-xl shadow-lg",
              theme === "dark" ? "bg-zinc-900/90 border border-zinc-800" : "bg-white border border-gray-100"
            )}>
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
              />
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

export default function Main() {
  return <SidebarDemo ContentComponent={ExamMaker} />;
}