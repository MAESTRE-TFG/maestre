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

export const CreateClassroomForm = ({ onSubmit, educationalStages }) => {
  const { theme } = useTheme();
  const router = useRouter();
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
      setAlert({ type: "warning", message: "Name is required and cannot be empty." });
      return;
    }
    if (formData.name.length > 30) {
      setAlert({ type: "warning", message: "Name cannot exceed 30 characters." });
      return;
    }

    // Validate description
    if (!formData.description.trim()) {
      setAlert({ type: "warning", message: "Description is required and cannot be empty." });
      return;
    }
    if (formData.description.length > 255) {
      setAlert({ type: "warning", message: "Description cannot exceed 255 characters." });
      return;
    }

    // Validate academic year
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(formData.academic_year)) {
      setAlert({ type: "warning", message: "Academic Year must be in the format 'YYYY-YYYY'." });
      return;
    }

    try {
      await onSubmit(formData);
      setAlert({ type: "success", message: "Classroom created successfully!" });
    } catch (err) {
      const errorMsg = err.message || "An error occurred while submitting the form.";
      setAlert({ type: "error", message: errorMsg });
    }
  };

  return (
    <div className={cn("max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", 
      theme === "dark" ? "bg-black" : "bg-white")}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <style jsx global>{
        `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');
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
          box-shadow: 0 0 0 3px ${theme === "dark" ? "rgba(136, 136, 136, 0.5)" : "rgba(0, 123, 255, 0.25)"};
        }
        option {
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
        }`
      }</style>
      
      <form className="my-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                theme === "dark" ? "text-white" : "text-gray-700"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Classroom Information
            </h3>
            
            <div className="flex flex-col gap-6">
              <LabelInputContainer className="flex-1">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="name"
                >
                  <IconSchool className="mr-2 h-5 w-5 text-blue-500" />
                  Classroom Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Applied Maths 1º ESO"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </LabelInputContainer>

              <LabelInputContainer className="flex-1">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="academic_course"
                >
                  <IconBook className="mr-2 h-5 w-5 text-purple-500" />
                  Academic Course
                </Label>
                <select
                  id="academic_course"
                  name="academic_course"
                  required
                  value={formData.academic_course}
                  onChange={handleChange}
                  className={cn(
                    "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  )}
                >
                  <option value="" disabled>Select Academic Course</option>
                  {educationalStages.map((stage) => (
                    <optgroup key={stage.stage} label={stage.stage}>
                      {stage.courses.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </LabelInputContainer>

              <LabelInputContainer className="flex-1">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="academic_year"
                >
                  <IconCalendar className="mr-2 h-5 w-5 text-green-500" />
                  Academic Year
                </Label>
                <Input
                  id="academic_year"
                  name="academic_year"
                  placeholder="YYYY-YYYY"
                  type="text"
                  required
                  value={formData.academic_year}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>
          </div>
          
          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                theme === "dark" ? "text-white" : "text-gray-700"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Classroom Description
            </h3>
            
            <LabelInputContainer className="mb-4">
              <Label
                className="flex items-center"
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                htmlFor="description"
              >
                <IconFileDescription className="mr-2 h-5 w-5 text-amber-500" />
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your classroom"
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
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            className="btn btn-secondary py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
            onClick={() => router.back()}
          >
             &larr; Cancel
          </button>
          <button
            className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
          >
            Create Classroom
          </button>
        </div>
      </form>
    </div>
  );
};

const BottomGradient = ({ isCancel }) => {
  return (
    <>
      <span
        className={cn(
          "group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
          isCancel
            ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        )}
      />
      <span
        className={cn(
          "group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
          isCancel
            ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        )}
      />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {React.Children.map(children, (child) => {
        if (child.type === Label) {
          return React.cloneElement(child, {
            style: { ...child.props.style, fontSize: "1.25rem" },
          });
        }
        return child;
      })}
    </div>
  );
};
