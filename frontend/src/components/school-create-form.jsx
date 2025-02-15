"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useEffect } from "react";

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
  const user = JSON.stringify(localStorage.getItem("user"));
  const [formData, setFormData] = React.useState({
    name: "",
    community: "",
    city: "",
    stages: [],
    user : user
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
    formDataCopy.stages = formDataCopy.stages.join(", "); // Convertir stages en una cadena separada por comas
    console.log(formDataCopy);
    onSubmit(formDataCopy);
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Escuelas Profesionales"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="community">Community</Label>
          <select
            id="community"
            name="community"
            required
            value={formData.community}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        <LabelInputContainer className="mb-8">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Sevilla"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="stages">Stages</Label>
          <select
            id="stages"
            name="stages"
            multiple
            required
            value={formData.stages}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {ETAPAS.map((etapa) => (
              <option key={etapa} value={etapa}>
                {etapa}
              </option>
            ))}
          </select>
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
          Create school &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
