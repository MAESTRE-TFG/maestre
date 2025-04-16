import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const ExamResultModal = ({ 
  showModal, 
  setShowModal, 
  examResult, 
  formatExamText, 
  createPDFVersion, 
  uploadPDFToClassroom, 
  formData,
  addAlert 
}) => {
  const { theme } = useTheme();

  const handleSavePDF = async () => {
    try {
      const doc = await createPDFVersion(examResult);
      const pdfBlob = doc.output('blob');
      
      // Create a filename based on subject and exam name, limited to 30 characters
      let fileName = `${formData.subject || 'Exam'}.pdf`.replace(/\s+/g, '_');
      
      // Ensure filename is no more than 30 characters (including .pdf extension)
      if (fileName.length > 30) {
        // Keep the .pdf extension and truncate the rest
        fileName = fileName.substring(0, 26) + '.pdf';
      }
      
      // Get the auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Upload to classroom
      const success = await uploadPDFToClassroom(pdfBlob, formData.classroom, fileName, token);
      
      if (success) {
        addAlert("success", "PDF saved to classroom materials successfully!");
      }
      
      // Close the modal after saving
      setShowModal(false);
    } catch (error) {
      addAlert("error", "Failed to save PDF: " + (error.message || "Unknown error"));
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const doc = await createPDFVersion(examResult);
      
      // Create a filename based on subject and exam name, limited to 30 characters
      let fileName = `${formData.subject || 'Exam'}.pdf`.replace(/\s+/g, '_');
      
      // Ensure filename is no more than 30 characters (including .pdf extension)
      if (fileName.length > 30) {
        // Keep the .pdf extension and truncate the rest
        fileName = fileName.substring(0, 26) + '.pdf';
      }
      
      // Download the PDF
      doc.save(fileName);
      addAlert("success", "PDF downloaded successfully!");
      
      // Close the modal after downloading
      setShowModal(false);
    } catch (error) {
      addAlert("error", "Failed to download PDF: " + (error.message || "Unknown error"));
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        "relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl",
        theme === "dark" ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-200"
      )}>
        {/* Modal Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          theme === "dark" ? "border-zinc-700" : "border-gray-200"
        )}>
          <h3 className="text-xl font-semibold">Generated Exam</h3>
          <button
            onClick={() => setShowModal(false)}
            className={cn(
              "p-1.5 rounded-full hover:bg-opacity-10 transition-colors",
              theme === "dark" ? "hover:bg-white text-gray-300" : "hover:bg-black text-gray-600"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div 
            className={cn(
              "p-6 rounded-lg border",
              theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-gray-50 border-gray-200"
            )}
            dangerouslySetInnerHTML={{ __html: formatExamText(examResult) }}
          />
        </div>
        
        {/* Modal Footer */}
        <div className={cn(
          "flex items-center justify-end gap-3 p-4 border-t",
          theme === "dark" ? "border-zinc-700" : "border-gray-200"
        )}>
          <button
            onClick={() => setShowModal(false)}
            className={cn(
              "px-4 py-2 rounded-lg border font-medium transition-colors",
              theme === "dark" 
                ? "border-zinc-700 hover:bg-zinc-800" 
                : "border-gray-300 hover:bg-gray-100"
            )}
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center",
              "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handleSavePDF}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center",
              "bg-indigo-600 hover:bg-indigo-700 text-white"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save to Classroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultModal;