import React from "react";
import { cn } from "@/lib/utils";
import { IconPlus, IconFileText } from "@tabler/icons-react";
import Alert from "@/components/ui/Alert";

const AddTermModal = ({
  showAddForm,
  setShowAddForm,
  newTermType,
  setNewTermType,
  newTermVersion,
  setNewTermVersion,
  uploadedMdFileName,
  setUploadedMdFileName,
  uploadedPdfFileName,
  setUploadedPdfFileName,
  setPdfFile,
  handleFileUpload,
  handleAddTerm,
  alert,
  setAlert,
  t,
  theme,
  existingTerms = [], // Pass the existing terms as a prop with a default value
}) => {
  if (!showAddForm) return null;

  // Define all term types
  const allTermTypes = [
    { value: "termsOfUse", label: t("addForm.availableTermTypes.termsOfUse") },
    { value: "privacyPolicy", label: t("addForm.availableTermTypes.privacyPolicy") },
    { value: "cookiePolicy", label: t("addForm.availableTermTypes.cookiePolicy") },
    { value: "licenses", label: t("addForm.availableTermTypes.licenses") },
  ];

  // Filter out term types that are already in use
  const usedTermTypes = existingTerms.map((term) => term.tag); // Get the tags of existing terms
  const availableTermTypes = allTermTypes.filter((type) => !usedTermTypes.includes(type.value));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={() => {
        setShowAddForm(false);
        setUploadedMdFileName(""); // Reset markdown file name on cancel
        setUploadedPdfFileName(""); // Reset PDF file name on cancel
        setPdfFile(null); // Reset the PDF file object
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
            <IconPlus className="h-10 w-10" />
          </div>
          <h3
            className={cn(
              "text-lg font-bold text-center",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {t("addForm.title")} 
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTerm();
          }}
        >
          {/* Term Type */}
          <div className="mb-4">
            <label className={cn("block text-sm font-bold mb-1", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.termTypeLabel")} 
            </label>
            <select
              value={newTermType}
              onChange={(e) => setNewTermType(e.target.value)}
              className={cn(
                "shadow appearance-none border rounded-md w-full py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
              )}
              required
            >
              <option value="">{t("addForm.selectTermType")} </option>
              {availableTermTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Markdown and PDF ontent */}
            <div className="mb-4">
               <label className="block text-sm font-medium mb-1">
                 {t("addForm.markdownContentLabel")} 
               </label>
               <label
                 htmlFor="md-file-upload"
                 className={`
                 flex items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer
                 ${theme === "dark" 
                   ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" 
                   : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"}
               `}
               >
                 <input
                   id="md-file-upload"
                   type="file"
                   accept=".md"
                   onChange={(e) => handleFileUpload(e.target.files[0], "md")}
                   className="hidden"
                 />
                 <div className="text-center">
                   <IconFileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto" />
                   <p className="mt-2 text-xs sm:text-sm font-medium">
                     {t("addForm.uploadMarkdown")} 
                   </p>
                 </div>
               </label>
               {uploadedMdFileName && (
                 <p className="mt-2 text-xs sm:text-sm text-blue-500 dark:text-blue-400">
                   {t("addForm.uploadedFile")}: <span className="font-medium">{uploadedMdFileName}</span> 
                 </p>
               )}
             </div>      
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1">
                 {t("addForm.pdfContentLabel")} 
               </label>
               <label
                 htmlFor="pdf-file-upload"
                 className={`
                 flex items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer
                 ${theme === "dark" 
                   ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" 
                   : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"}
               `}
                   >
                     <input
                       id="pdf-file-upload"
                       type="file"
                       accept=".pdf"
                       onChange={(e) => handleFileUpload(e.target.files[0], "pdf")}
                       className="hidden"
                     />
                     <div className="text-center">
                       <IconFileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto" />
                       <p className="mt-2 text-xs sm:text-sm font-medium">
                         {t("addForm.uploadPdf")} 
                       </p>
                     </div>
                   </label>
                   {uploadedPdfFileName && (
                     <p className="mt-2 text-xs sm:text-sm text-blue-500 dark:text-blue-400">
                       {t("addForm.uploadedFile")}: <span className="font-medium">{uploadedPdfFileName}</span> 
                     </p>
                   )}
                 </div>

          {/* Version */}
          <div className="mb-4">
            <label className={cn("block text-sm font-bold mb-1", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.versionLabel")} {/* Internationalized */}
            </label>
            <input
              type="text"
              value={newTermVersion || ""} // Ensure the value is always a string
              onChange={(e) => {
                const inputValue = e.target.value;
                setNewTermVersion(inputValue); // Update the state with the input value
              }}
              placeholder={t("addForm.versionPlaceholder")}
              className={cn(
                "shadow appearance-none border rounded-md w-full py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
              )}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setUploadedMdFileName(""); // Reset markdown file name on cancel
                setUploadedPdfFileName(""); // Reset PDF file name on cancel
                setPdfFile(null); // Reset the PDF file object
              }}
              className="btn-secondary py-1 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {t("buttons.cancel")} 
            </button>
            <button
              type="submit"
              className="btn-success py-1 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {t("buttons.save")} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTermModal;