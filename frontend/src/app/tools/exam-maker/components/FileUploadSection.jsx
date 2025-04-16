import { Label } from "@/components/ui/label";
import LabelInputContainer from "./LabelInputContainer";

const FileUploadSection = ({ 
  uploadedFiles, 
  handleFileUpload, 
  removeUploadedFile, 
  isProcessingFile, 
  setShowMaterialsModal, 
  theme 
}) => {
  return (
    <LabelInputContainer>
      <Label className="flex items-center text-sm font-medium mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="red">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Reference Materials
      </Label>
      
      {uploadedFiles.length > 0 ? (
        <div className={`p-3 rounded-md border ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
          {uploadedFiles.map(file => (
            <div key={file.id} className="flex items-center justify-between mb-2 last:mb-0">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {file.name} {file.isFromClassroom && "(From Classroom)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeUploadedFile(file.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className={`relative border-2 border-dashed rounded-lg p-4 text-center ${theme === 'dark' ? 'border-zinc-700 hover:border-zinc-500' : 'border-gray-300 hover:border-gray-400'}`}>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".docx"
              disabled={isProcessingFile}
            />
            <div className="space-y-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Upload a file</span> or drag and drop
              </div>
              <p className="text-xs text-gray-500">.docx files only (max 5MB)</p>
            </div>
          </div>
          
          <div className="text-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>or</span>
          </div>
          
          <button
            type="button"
            onClick={() => setShowMaterialsModal(true)}
            className={`w-full py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
              theme === 'dark' 
                ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Select from Classroom Materials
          </button>
        </div>
      )}
      
      {isProcessingFile && (
        <div className="mt-2 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Processing file...</span>
        </div>
      )}
    </LabelInputContainer>
  );
};

export default FileUploadSection;