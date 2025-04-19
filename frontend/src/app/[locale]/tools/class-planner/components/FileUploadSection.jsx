import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FileUploadSection = ({ 
  uploadedFiles, 
  handleFileUpload, 
  removeUploadedFile, 
  isProcessingFile, 
  setShowMaterialsModal,
  theme 
}) => {
  const t = useTranslations("LessonPlanner");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="flex items-center text-sm font-medium mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="blue">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t("fileUpload.title")}
        </Label>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {t("fileUpload.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
              "transition-colors duration-200",
              theme === 'dark' 
                ? "border-gray-600 hover:border-gray-500 bg-gray-700/30" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className={`mb-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                {t("fileUpload.dragDrop")}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("fileUpload.supportedFormats")}
              </p>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept=".docx" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={isProcessingFile}
            />
          </label>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowMaterialsModal(true)}
            disabled={isProcessingFile}
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg",
              "transition-colors duration-200",
              theme === 'dark' 
                ? "border-gray-600 hover:border-gray-500 bg-gray-700/30" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50",
              isProcessingFile ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
              </svg>
              <p className={`mb-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                {t("buttons.browseClassroomMaterials")}
              </p>
            </div>
          </button>
        </div>
      </div>

      {isProcessingFile && (
        <div className={`flex items-center justify-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t("fileUpload.processing")}
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {t("fileUpload.uploadedFiles")}
          </p>
          <ul className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {uploadedFiles.map(file => (
              <li key={file.id} className="py-2 flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(file.id)}
                  className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;