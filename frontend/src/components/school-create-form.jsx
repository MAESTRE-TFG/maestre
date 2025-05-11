"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";
import {
  IconBuilding,
  IconWorld,
  IconMapPin,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl"; // Import the translation hook

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

const ETAPAS = [
  "Infantil",
  "Primaria",
  "Secundaria",
  "Bachillerato",
  "FP",
  "Ciclo Formativo",
];

export function CreateSchoolForm({ onSubmit }) {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslations("SchoolCreateForm"); // Use translations for this component
  const user = JSON.stringify(localStorage.getItem("user"));
  const [formData, setFormData] = React.useState({
    name: "",
    community: "",
    city: "",
    stages: [],
    user: user || "",
  });
  const [alert, setAlert] = useState(null);

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

    // Validate name length
    if (formDataCopy.name.length > 50) {
      setAlert({ type: "warning", message: t("alerts.nameTooLong") });
      return;
    }


    // Validate city is not null
    if (!formDataCopy.city) {
      setAlert({ type: "warning", message: t("alerts.cityRequired") });
      return;
    }

    if (formDataCopy.city.length > 50) {
      setAlert({ type: "warning", message: t("alerts.nameTooLong") });
      return;
    }

    if (formDataCopy.stages.length <= 0) {
      setAlert({ type: "warning", message: t("alerts.stagesRequired") });
      return;
    }

    formDataCopy.stages = formDataCopy.stages.join(", ");
    if (!formDataCopy.name || !formDataCopy.community || !formDataCopy.city) {
      setAlert({ type: "warning", message: t("alerts.allFieldsRequired") });
      return;
    }
    try {
      onSubmit(formDataCopy);
      setAlert({ type: "success", message: t("alerts.success") });
    } catch (error) {
      setAlert({ type: "error", message: t("alerts.error") });
    }
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
        "max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
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
          box-shadow: 0 0 0 3px ${theme === "dark" ? "rgba(136, 136, 136, 0.5)" : "rgba(0, 123, 255, 0.25)"};
        }
        option {
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
      `}</style>
      <form
        className="my-1"
        onSubmit={handleSubmit}
      >
        <h2 className={cn("text-2xl font-bold mb-6 text-center mx-auto", theme === "dark" ? "text-white" : "text-gray-800")}>
          {t("title")} {/* Internationalized */}
        </h2>

        {/* Name Field */}
        <LabelInputContainer className="mb-5">
          <Label 
            htmlFor="name" 
            className="flex items-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            <IconBuilding className="mr-2 h-5 w-5 text-blue-500" />
            {t("fields.name.label")} {/* Internationalized */}
          </Label>
          <Input
            id="name"
            name="name"
            placeholder={t("fields.name.placeholder")} // Internationalized
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Region Field */}
          <LabelInputContainer className="flex-1">
            <Label 
              htmlFor="community" 
              className="flex items-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <IconWorld className="mr-2 h-5 w-5 text-green-500" />
              {t("fields.community.label")} {/* Internationalized */}
            </Label>
            <select
              id="community"
              name="community"
              required
              value={formData.community}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                {t("fields.community.placeholder")} {/* Internationalized */}
              </option>
              {COMUNIDADES.map((comunidad) => (
                <option key={comunidad} value={comunidad}>
                  {comunidad}
                </option>
              ))}
            </select>
          </LabelInputContainer>

          {/* City Field */}
          <LabelInputContainer className="flex-1">
            <Label 
              htmlFor="city" 
              className="flex items-center"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <IconMapPin className="mr-2 h-5 w-5 text-purple-500" />
              {t("fields.city.label")} {/* Internationalized */}
            </Label>
            <Input
              id="city"
              name="city"
              placeholder={t("fields.city.placeholder")} // Internationalized
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        {/* Stages Field */}
        <LabelInputContainer className="mb-6 mt-6">
          <Label 
            htmlFor="stages" 
            className="flex items-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            <IconCalendarEvent className="mr-2 h-5 w-5 text-amber-500" />
            {t("fields.stages.label")} {/* Internationalized */}
          </Label>
          <div className="flex flex-wrap gap-2">
            {ETAPAS.map((etapa) => (
              <button
                key={etapa}
                type="button"
                onClick={() => handleSelectStage(etapa)}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all border",
                  theme === "dark"
                    ? formData.stages.includes(etapa)
                      ? "bg-white text-dark shadow-md"
                      : "bg-zinc-800 border-transparent text-white hover:bg-gray-100 hover:text-zinc-900"
                    : formData.stages.includes(etapa)
                      ? "bg-black text-white shadow-md"
                      : "bg-white border-gray-300 text-zinc-700 hover:bg-zinc-800 hover:text-gray-100"
                )}
              >
                {etapa}
              </button>
            ))}
          </div>
        </LabelInputContainer>

        <div className="flex justify-center gap-4 mt-8">
          {/* Cancel Button */}
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
          
          {/* Submit Button */}
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
}

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
