"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

export const CreateClassroomForm = ({ onSubmit, setErrorMessage, educationalStages }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    academic_course: "",
    description: "",
    academic_year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(formData.academic_year)) {
      const errorMsg = "Academic Year must be in the format 'YYYY-YYYY'.";
      setErrorMessage(errorMsg);
      return;
    }
    try {
      await onSubmit(formData);
      setErrorMessage(null);
    } catch (err) {
      const errorMsg = err.message || "An error occurred while submitting the form.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className={cn("max-w-6xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white")}>
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
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-6 mb-10">
          <LabelInputContainer className="flex-1">
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1rem" }} htmlFor="name">🏫 Classroom Name</Label>
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
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1rem" }} htmlFor="academic_course">📚 Academic Course</Label>
            <select
              id="academic_course"
              name="academic_course"
              required
              value={formData.academic_course}
              onChange={handleChange}
              className={cn(
                "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                theme === "dark"
                  ? "bg-black border-gray-700 text-white"
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
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1rem" }} htmlFor="academic_year">📅 Academic Year</Label>
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
        <LabelInputContainer className="mb-8">
          <Label style={{ fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1rem" }} htmlFor="description">📝 Sample Description</Label>
          <textarea
            id="description"
            name="description"
            placeholder=" Description"
            value={formData.description}
            onChange={handleChange}
            className={cn(
              "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              theme === "dark"
                ? "bg-black border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            )}
          />
        </LabelInputContainer>
        <button
          className={cn(
            "relative group/btn block w-full rounded-md h-10 font-medium border border-transparent",
            theme === "dark"
              ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
          )}
          type="submit"
          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
        >
          Create Classroom &rarr;
          <BottomGradient />
        </button>
        <button
          className={cn(
            "relative group/btn block w-full mx-auto rounded-md h-10 font-medium border border-transparent mt-4",
            theme === "dark"
              ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-red-300"
          )}
          type="button"
          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
          onClick={() => router.back()}
        >
          &larr; Cancel
          <BottomGradient isCancel />
        </button>
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
