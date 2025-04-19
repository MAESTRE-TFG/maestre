import { useState } from "react";
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
  const t = useTranslations("LessonPlanner");
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  if (!showModal) return null;

  const filteredMaterials = userMaterials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className={cn(
          "w-full max-w-2xl rounded-xl shadow-lg overflow-hidden",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            {t("materialsModal.title")}
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
        
        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder={t("materialsModal.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full px-4 py-2 rounded-md border",
                "focus:outline-none focus:ring-2 focus:ring-offset-0",
                theme === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500/40" 
                  : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500/30"
              )}
            />
          </div>
          
          <div 
            className={cn(
              "overflow-y-auto",
              "max-h-[400px]",
              theme === "dark" ? "scrollbar-dark" : "scrollbar-light"
            )}
          >
            {filteredMaterials.length > 0 ? (
              <ul className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
                {filteredMaterials.map(material => (
                  <li key={material.id} className="py-3">
                    <button
                      onClick={() => handleMaterialSelect(material)}
                      disabled={isProcessingFile}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors",
                        "flex items-center",
                        theme === "dark" 
                          ? "hover:bg-gray-700" 
                          : "hover:bg-gray-100",
                        isProcessingFile && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex-1">
                        <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                          {material.name}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(material.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {t("materialsModal.noMaterials")}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium",
              theme === "dark" 
                ? "bg-gray-700 text-white hover:bg-gray-600" 
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            )}
          >
            {t("materialsModal.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;