import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const EditMaterialModal = ({
  isOpen,
  onClose,
  onConfirm,
  newFileName,
  setNewFileName,
  theme,
}) => {
  const t = useTranslations("EditMaterialModal");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={cn(
          "p-6 rounded-xl max-w-md w-full mx-4",
          theme === "dark" ? "bg-gray-800" : "bg-white",
          "shadow-xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-4 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>

        <h3
          className={cn(
            "text-xl font-bold mb-2 text-center",
            theme === "dark" ? "text-white" : "text-gray-800"
          )}
        >
          {t("editMaterialName")}
        </h3>

        <p
          className={cn(
            "mb-6 text-center",
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}
        >
          {t("editMaterialNameDescription")}
        </p>

        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className={cn(
            "w-full p-2 rounded border mb-6",
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-800"
          )}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialModal;