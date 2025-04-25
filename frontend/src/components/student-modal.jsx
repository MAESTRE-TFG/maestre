import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const StudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  editMode,
  studentName,
  studentSurname,
  handleNameChange,
  handleSurnameChange,
  isSubmitting,
  theme,
}) => {
  const t = useTranslations("StudentModal");

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
        <div className="flex items-center justify-center mb-4 text-[rgb(25,65,166)]">
          {editMode ? (
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>

        <h3
          className={cn(
            "text-xl font-bold mb-4 text-center",
            theme === "dark" ? "text-white" : "text-gray-800"
          )}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {editMode ? t("editStudent") : t("addStudent")}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="mb-4">
            <label
              className={cn(
                "block text-sm font-bold mb-2",
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            >
              {t("nameLabel")}
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              className={cn(
                "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              )}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className={cn(
                "block text-sm font-bold mb-2",
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            >
              {t("surnameLabel")}
            </label>
            <input
              type="text"
              value={studentSurname}
              onChange={(e) => handleSurnameChange(e.target.value)}
              className={cn(
                "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              )}
              required
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {t("cancelButton")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-success py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {isSubmitting
                ? t("processing")
                : editMode
                ? t("saveChanges")
                : t("addStudent")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;