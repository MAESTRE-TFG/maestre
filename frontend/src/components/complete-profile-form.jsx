"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { IconWorld, IconMapPin, IconSchool } from "@tabler/icons-react";

const COMUNIDADES = [
  "Andalucía",
  "Aragón",
  "Asturias",
  "Baleares",
  "Canarias",
  "Cantabria",
  "Castilla-La Mancha",
  "Castilla y León",
  "Cataluña",
  "Comunidad Valenciana",
  "Extremadura",
  "Galicia",
  "Madrid",
  "Murcia",
  "Navarra",
  "País Vasco",
  "La Rioja",
  "Ceuta",
  "Melilla",
];

export function CompleteProfileForm({ formData, handleChange, handleComplete, handleCreateSchool, schools, error }) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <div className={cn("max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md")}>
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
      <form className="my-8" onSubmit={(e) => { e.preventDefault(); handleComplete(); }}>
        <h2 className={cn("text-2xl font-bold mb-6 text-center mx-auto", theme === "dark" ? "text-white" : "text-gray-800")}>
          Complete Your Profile
        </h2>
        
        <div className="flex flex-col md:flex-row md:gap-4 w-full">
          <LabelInputContainer className="mb-5 md:mb-0 md:w-1/2">
            <Label htmlFor="region" className="flex items-center gap-2">
              <IconWorld className="h-4 w-4 text-blue-500" /> Region
            </Label>
            <select
              id="region"
              name="region"
              required
              value={formData.region}
              onChange={handleChange}
              className="block w-full h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select a community
              </option>
              {COMUNIDADES.map((comunidad) => (
                <option key={comunidad} value={comunidad}>
                  {comunidad}
                </option>
              ))}
            </select>
          </LabelInputContainer>
          
          <LabelInputContainer className="mb-5 md:w-1/2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 text-green-500" /> City
            </Label>
            <Input 
              id="city" 
              name="city" 
              placeholder="Sevilla" 
              type="text" 
              required 
              value={formData.city} 
              onChange={handleChange}
              className="h-10" 
            />
          </LabelInputContainer>
        </div>
        
        <LabelInputContainer className="mb-6">
          <Label htmlFor="school" className="flex items-center gap-2">
            <IconSchool className="h-4 w-4 text-purple-500" /> School
          </Label>
          <select
            id="school"
            name="school"
            required
            value={formData.school}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Select a school
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </LabelInputContainer>
        
        <p className={cn("text-sm mb-4 text-center", theme === "dark" ? "text-white" : "text-black")}>
          Can't find your school?
        </p>
        
        <div className="flex flex-col space-y-8">
          <button
            onClick={handleCreateSchool}
            className="btn btn-secondary py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
            type="button"
          >
              Create School
            <BottomGradient />
          </button>
          
          <button
            onClick={() => router.push("/profile/edit")}
            className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
            type="submit"
          >
            Complete Profile &rarr;
            <BottomGradient />
          </button>
          
          <button
            className="btn btn-danger py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
            type="button"
            onClick={handleCancelClick}
          >
             &larr; Cancel
            <BottomGradient isCancel />
          </button>
        </div>
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
