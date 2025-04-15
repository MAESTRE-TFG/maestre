"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import {
  IconSchool,
  IconBook,
  IconCalendar,
  IconFileDescription,
  IconTrash,
} from "@tabler/icons-react";

export function ClassroomEditForm({ formData, handleChange, handleUpdate, openDeleteModal, educationalStages }) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className={cn("max-w-6xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", 
      theme === "dark" ? "bg-black" : "bg-white")}>
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
      
      <form className="my-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 md:w-2/5 border border-gray-300 rounded-md p-4">
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                theme === "dark" ? "text-white" : "text-gray-800"
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
                  value={formData.name || ""}
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
                  value={formData.academic_course || ""}
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
                  value={formData.academic_year || ""}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>
          </div>
          
          <div className="flex-1 md:w-3/5 border border-gray-300 rounded-md p-4">
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                theme === "dark" ? "text-white" : "text-gray-800"
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
                value={formData.description || ""}
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
        
        {/* Update and Cancel Buttons in one row */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className={cn(
              "btn btn-md btn-secondary w-1/3",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
            type="button"
            onClick={() => router.back()}
          >
            &larr; Cancel
          </button>
          <button
            className={cn(
              "btn btn-md btn-success w-1/3",
              theme === "dark" ? "dark:btn-success" : ""
            )}
            type="submit"
          >
            Update Classroom &rarr;
          </button>
        </div>
        
        {/* Delete Button */}
        <div className="flex justify-center mt-4">
          <button
            className={cn(
              "btn btn-md btn-danger w-1/2",
              theme === "dark" ? "dark:btn-danger" : ""
            )}
            type="button"
            onClick={openDeleteModal}
          >
            <IconTrash className="mr-2 h-5 w-5" /> Delete Classroom
          </button>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {React.Children.map(children, child => {
        if (child.type === Label) {
          return React.cloneElement(child, {
            style: { ...child.props.style, fontSize: "1.25rem" }
          });
        }
        return child;
      })}
    </div>
  );
};
