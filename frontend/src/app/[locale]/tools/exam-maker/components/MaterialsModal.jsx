import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
const MaterialsModal = ({ 
  showModal, 
  setShowModal, 
  userMaterials, 
  handleMaterialSelect,
  isProcessingFile
}) => {
  const { theme } = useTheme();
  const t = useTranslations("ExamMaker");

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        "relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl",
        theme === "dark" ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-200"
      )}>
        {/* Modal Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          theme === "dark" ? "border-zinc-700" : "border-gray-200"
        )}>
          <h3 className="text-xl font-semibold">{t("materialsModal.title")}</h3> 
          <button
            onClick={() => setShowModal(false)}
            disabled={isProcessingFile}
            className={cn(
              "p-1.5 rounded-full hover:bg-opacity-10 transition-colors",
              theme === "dark" ? "hover:bg-white text-gray-300" : "hover:bg-black text-gray-600",
              isProcessingFile && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          {userMaterials.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                {t("materialsModal.noMaterials")} 
              </p>
              <p className="text-sm mt-2 text-gray-500">
                {t("materialsModal.uploadPrompt")} 
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {userMaterials.map(material => (
                <button
                  key={material.id}
                  onClick={() => handleMaterialSelect(material)}
                  disabled={isProcessingFile || !material.file.toLowerCase().endsWith('.docx')}
                  className={cn(
                    "flex items-center p-3 rounded-lg border transition-colors text-left",
                    theme === "dark" 
                      ? "border-zinc-700 hover:bg-zinc-800" 
                      : "border-gray-200 hover:bg-gray-50",
                    (isProcessingFile || !material.file.toLowerCase().endsWith('.docx')) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                      "h-8 w-8",
                      material.file.toLowerCase().endsWith('.docx') ? "text-blue-500" : "text-gray-400"
                    )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {material.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {material.file.split('/').pop()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className={cn(
          "flex items-center justify-end gap-3 p-4 border-t",
          theme === "dark" ? "border-zinc-700" : "border-gray-200"
        )}>
          <button
            onClick={() => setShowModal(false)}
            disabled={isProcessingFile}
            className="btn btn-secondary px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          >
            {t("buttons.cancel")} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;