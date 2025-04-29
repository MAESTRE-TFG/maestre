"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { IconWorld, IconMapPin, IconSchool } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

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

export function CompleteProfileForm({ formData, handleChange, handleComplete, handleCreateSchool, schools, params }) {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslations("CompleteProfileForm");

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <div
      className={cn(
        "max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
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
          handleComplete();
        }}
      >
        <h2 className={cn("text-2xl font-bold mb-6 text-center mx-auto", theme === "dark" ? "text-white" : "text-gray-800")}>
          {t("title")} {/* Internationalized */}
        </h2>

        <div className="flex flex-col md:flex-row md:gap-6 w-full">
          <LabelInputContainer className="mb-5 md:mb-0 flex-1">
            <Label 
              htmlFor="region" 
              className="flex items-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <IconWorld className="mr-2 h-5 w-5 text-green-500" /> {t("fields.region.label")} 
            </Label>
            <select
              id="region"
              name="region"
              required
              value={formData.region}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                {t("fields.region.placeholder")} 
              </option>
              {COMUNIDADES.map((comunidad) => (
                <option key={comunidad} value={comunidad}>
                  {comunidad}
                </option>
              ))}
            </select>
          </LabelInputContainer>

          <LabelInputContainer className="mb-5 flex-1">
            <Label 
              htmlFor="city" 
              className="flex items-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <IconMapPin className="mr-2 h-5 w-5 text-purple-500" /> {t("fields.city.label")} 
            </Label>
            <Input
              id="city"
              name="city"
              placeholder={t("fields.city.placeholder")} 
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-6 mt-2">
          <Label 
            htmlFor="school" 
            className="flex items-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            <IconSchool className="mr-2 h-5 w-5 text-amber-500" /> {t("fields.school.label")} 
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
              {t("fields.school.placeholder")} 
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        <div className="flex justify-center gap-4 mt-8">
          <button
            className={cn(
              "btn btn-md btn-secondary w-1/2",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
            type="button"
            onClick={handleCancelClick}
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
              {t("buttons.completeProfile")}
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
        
        <div className="flex flex-col mt-4">
          <p
            className={cn(
              "text-sm mb-4 text-center",
              theme === "dark" ? "text-white" : "text-black"
            )}
          >
            {t("fields.school.notFound")} 
          </p>
          <button
            onClick={handleCreateSchool}
            className={cn(
              "btn btn-md w-full",
              theme === "dark" ? "dark:btn-primary" : "btn-primary"
            )}
            type="button"
          >
            <span className="font-bold">
              {t("fields.school.createButton")}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

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
            style: { ...child.props.style, fontSize: "0.875rem" }, // Adjusted font size to match school-create-form
          });
        }
        return child;
      })}
    </div>
  );
};
