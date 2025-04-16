"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter, useParams } from "next/navigation";

export function StudentCreateForm({ onSubmit }) {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
   
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    classroom: params.id,
  });

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "stages") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataCopy = { ...formData };
    formDataCopy.stages = formDataCopy.stages.join(", ");
    console.log(formDataCopy);
    onSubmit(formDataCopy);
  };

  const handleSelectStage = (etapa) => {
    setFormData((prev) => {
      const updatedStages = prev.stages.includes(etapa)
        ? prev.stages.filter((e) => e !== etapa) // Uncheck if already selected
        : [...prev.stages, etapa]; // Add if not selected

      return { ...prev, stages: updatedStages };
    });
  };

  return (
    <div
      className={cn(
        "max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
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
        <LabelInputContainer className="mb-8">
          <Label htmlFor="name">🏫 Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            name="surname"
            placeholder="Doe"
            type="text"
            required
            value={formData.surname}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </LabelInputContainer>

        <button
          className={cn(
            "btn btn-md btn-success w-full mt-4",
            theme === "dark" ? "dark:btn-success" : ""
          )}
          type="submit"
        >
          Create school &rarr;
          <BottomGradient />
        </button>
        <button
          className={cn(
            "btn btn-md btn-secondary w-full mt-4",
            theme === "dark" ? "dark:btn-secondary" : ""
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
}

const BottomGradient = ({ isCancel }) => {
  return (<>
    <span className={cn("group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0", 
      isCancel ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent" : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent")} />
    <span className={cn("group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10", 
      isCancel ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent")} />
  </>);
};

const LabelInputContainer = ({ children, className }) => {
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
