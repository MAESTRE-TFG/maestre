"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

export const CreateClassroomForm = ({ onSubmit }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    academic_course: "",
    description: "",
    academic_year: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={cn(
        "max-w-screen-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
      `}</style>
      <form
        className="my-8"
        onSubmit={handleSubmit}
        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
      >
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <div className="flex flex-wrap -mx-2 mb-10">
          <LabelInputContainer className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <Label htmlFor="name">Classroom Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter classroom name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <Label htmlFor="academic_course">Academic Course</Label>
            <Input
              id="academic_course"
              name="academic_course"
              placeholder="Enter academic course"
              type="text"
              required
              value={formData.academic_course}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="w-full md:w-1/3 px-2">
            <Label htmlFor="academic_year">Academic Year</Label>
            <Input
              id="academic_year"
              name="academic_year"
              placeholder="Enter academic year"
              type="text"
              required
              value={formData.academic_year}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            required
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
