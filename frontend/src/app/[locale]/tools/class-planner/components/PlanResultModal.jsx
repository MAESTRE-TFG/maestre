import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

const PlanResultModal = ({ 
  showModal, 
  setShowModal, 
  planResult, 
  formData,
  addAlert
}) => {
  const t = useTranslations("LessonPlanner");
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("plan");
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!showModal || !planResult) return null;

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(planResult.plan);
      addAlert("success", t("planResultModal.copySuccess"));
    } catch (error) {
      addAlert("error", t("planResultModal.copyError"));
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Ensure generatePDF is implemented to return a valid URL
      const pdfUrl = await generatePDF(planResult.plan);
  
      if (!pdfUrl) {
        throw new Error("Failed to generate PDF");
      }
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'lesson-plan.pdf');
  
      // Append to the body, click and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      addAlert("success", t("planResultModal.downloadSuccess"));
    } catch (error) {
      addAlert("error", t("planResultModal.downloadError"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadToClassroom = async () => {
    setIsUploading(true);
    try {
      // This would be implemented in a real application
      // For now, we'll just simulate success
      setTimeout(() => {
        addAlert("success", t("planResultModal.uploadSuccess"));
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      addAlert("error", t("planResultModal.uploadError"));
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className={cn(
          "w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex flex-col",
          theme === "dark" ? "bg-gray-800" : "bg-white",
          "h-[80vh]"
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            {formData.planName || t("planResultModal.defaultTitle")}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "plan"
                ? theme === "dark"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-indigo-500 text-indigo-600"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("plan")}
          >
            {t("planResultModal.tabs.plan")}
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "metadata"
                ? theme === "dark"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-indigo-500 text-indigo-600"
                : theme === "dark"
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("metadata")}
          >
            {t("planResultModal.tabs.metadata")}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "plan" ? (
            <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: planResult.plan
                    ? planResult.plan.replace(/\n/g, '<br />')
                    : t("planResultModal.noPlanAvailable")
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("planResultModal.metadata.subject")}
                </h4>
                <p className={`text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {formData.subject}
                </p>
              </div>
              
              <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("planResultModal.metadata.theme")}
                </h4>
                <p className={`text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {formData.theme}
                </p>
              </div>
              
              <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("planResultModal.metadata.numLessons")}
                </h4>
                <p className={`text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {formData.numLessons}
                </p>
              </div>
              
              <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("planResultModal.metadata.playfulnessLevel")}
                </h4>
                <p className={`text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {formData.playfulnessLevel}%
                </p>
              </div>
              
              <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("planResultModal.metadata.generatedWith")}
                </h4>
                <p className={`text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {formData.llmModel}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 justify-end">
          <button
            onClick={handleCopyToClipboard}
            disabled={isCopying}
            className="btn btn-secondary btn-sm flex items-center"
          >
            {isCopying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("planResultModal.buttons.copying")}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {t("planResultModal.buttons.copy")}
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn btn-primary btn-sm flex items-center"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("planResultModal.buttons.downloading")}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t("planResultModal.buttons.download")}
              </>
            )}
          </button>
          
          <button
            onClick={handleUploadToClassroom}
            disabled={isUploading}
            className="btn btn-success btn-sm flex items-center"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("planResultModal.buttons.uploading")}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t("planResultModal.buttons.uploadToClassroom")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanResultModal;