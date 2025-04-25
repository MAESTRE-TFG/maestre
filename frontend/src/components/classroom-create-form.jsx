"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";
import {
  IconSchool,
  IconBook,
  IconCalendar,
  IconFileDescription,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl"; // Import the translation hook

export const CreateClassroomForm = ({ onSubmit, educationalStages }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslations("ClassroomCreateForm"); // Use translations for this component
  const [formData, setFormData] = useState({
    name: "",
    academic_course: "",
    description: "",
    academic_year: "",
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    if (!formData.name.trim()) {
      setAlert({ type: "warning", message: t("alerts.nameRequired") });
      return;
    }
    if (formData.name.length > 30) {
      setAlert({ type: "warning", message: t("alerts.nameTooLong") });
      return;
    }

    // Validate description
    if (!formData.description.trim()) {
      setAlert({ type: "warning", message: t("alerts.descriptionRequired") });
      return;
    }
    if (formData.description.length > 255) {
      setAlert({ type: "warning", message: t("alerts.descriptionTooLong") });
      return;
    }

    // Validate academic year
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(formData.academic_year)) {
      setAlert({ type: "warning", message: t("alerts.invalidAcademicYear") });
      return;
    }

    try {
      await onSubmit(formData);
      setAlert({ type: "success", message: t("alerts.success") });
    } catch (err) {
      const errorMsg = err.message || t("alerts.error");
      setAlert({ type: "error", message: errorMsg });
    }
  };

  return (
    <div
      className={cn(
        "max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        select {
          appearance: none;
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
          border: 1px solid ${theme === "dark" ? "#555" : "#ccc"};
          padding: 0.5rem;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        select:focus {
          outline: none;
          border-color: ${theme === "dark" ? "#888" : "#007bff"};
          box-shadow: 0 0 0 3px
            ${theme === "dark"
              ? "rgba(136, 136, 136, 0.5)"
              : "rgba(0, 123, 255, 0.25)"};
        }
        option {
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
      `}</style>

      <form 
        className="my-1" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            {/* Classroom Information Section */}
            <div className="flex flex-col gap-6 mb-8">
              {/* Name and Academic Course in one row */}
              <div className="flex flex-col md:flex-row gap-6">
                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                    htmlFor="name"
                  >
                    <IconSchool className="mr-2 h-5 w-5 text-blue-500" />
                    {t("fields.name.label")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("fields.name.placeholder")}
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                    htmlFor="academic_course"
                  >
                    <IconBook className="mr-2 h-5 w-5 text-purple-500" />
                    {t("fields.academicCourse.label")}
                  </Label>
                  <select
                    id="academic_course"
                    name="academic_course"
                    required
                    value={formData.academic_course}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      {t("fields.academicCourse.placeholder")}
                    </option>
                    {educationalStages.map((stage) => (
                      <optgroup key={stage.stage} label={stage.stage}>
                        {stage.courses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </LabelInputContainer>
              </div>

              {/* Academic Year */}
              <LabelInputContainer className="flex-1">
                <Label
                  className="flex items-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                  htmlFor="academic_year"
                >
                  <IconCalendar className="mr-2 h-5 w-5 text-green-500" />
                  {t("fields.academicYear.label")}
                </Label>
                <Input
                  id="academic_year"
                  name="academic_year"
                  placeholder={t("fields.academicYear.placeholder")}
                  type="text"
                  required
                  value={formData.academic_year}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>
          </div>

          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            {/* Description Section */}
            <h3
              className={cn(
                "text-lg font-extrabold mb-4",
                theme === "dark" ? "text-white" : "text-gray-800"
              )}
            >
              {t("sections.description.title")}
            </h3>

            <LabelInputContainer className="mb-4">
              <Label
                className="flex items-center"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                htmlFor="description"
              >
                <IconFileDescription className="mr-2 h-5 w-5 text-amber-500" />
                {t("fields.description.label")}
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder={t("fields.description.placeholder")}
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={cn(
                  "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                )}
              />
            </LabelInputContainer>
          </div>
        </div>

        {/* Create Classroom and Cancel Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className={cn(
              "btn btn-md btn-secondary w-1/2",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
            type="button"
            onClick={() => router.back()}
          >
            <span className="font-bold flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="rotate-180 transition-transform group-hover:-translate-x-1"
              >
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
              {t("buttons.cancel")}
            </span>
          </button>
          <button
            className={cn(
              "btn btn-md btn-success w-1/2",
              theme === "dark" ? "dark:btn-success" : ""
            )}
            type="submit"
          >
            <span className="font-bold flex items-center gap-2">
              {t("buttons.create")}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {React.Children.map(children, (child) => {
        if (child.type === Label) {
          return React.cloneElement(child, {
            style: { ...child.props.style, fontSize: "0.875rem" }, // Adjusted font size to make labels smaller
          });
        }
        return child;
      })}
    </div>
  );
};
