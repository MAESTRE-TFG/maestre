"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

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

export function ProfileEditForm({ formData, handleChange, handleUpdate, handleCancel, schools, isProfileComplete }) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className={cn("max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white")}>
      <style jsx global>{
        `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`
      }</style>
      <form className="my-1" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 border border-gray-300 rounded-md p-4">
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" placeholder="Username" type="text" required value={formData.username || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="Email" type="email" required value={formData.email || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Name" type="text" required value={formData.name || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="surname">Surname</Label>
            <Input id="surname" name="surname" placeholder="Surname" type="text" required value={formData.surname || ""} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        {isProfileComplete && (
          <div className="flex-1 border border-gray-300 rounded-md p-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="region">Your Region</Label>
              <select
                id="region"
                name="region"
                required
                value={formData.region || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={!isProfileComplete}
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
            <LabelInputContainer className="mb-4">
              <Label htmlFor="city">Your City</Label>
              <Input id="city" name="city" placeholder="Sevilla" type="text" required value={formData.city || ""} onChange={handleChange} disabled={!isProfileComplete} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-5">
              <Label htmlFor="school">Your School</Label>
              <select
                id="school"
                name="school"
                required
                value={formData.school || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={!isProfileComplete}
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
            <p className={cn("text-sm mb-2", theme === "dark" ? "text-white" : "text-black")}>
              ¿Can't find your school?
            </p>
            <button
              onClick={() => router.push("/school_create")}
              className={cn("relative group/btn block w-full rounded-md h-10 font-medium border border-transparent", 
                theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
              )}
              type="submit">
              Create one &rarr;
            <BottomGradient />
          </button>
          </div>
        )}
      </div>
        <button
          className={cn("relative group/btn block w-full rounded-md h-10 font-medium border border-transparent", 
            theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
            : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
          )}
          type="submit">
          Update &rarr;
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
          onClick={handleCancel}>
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

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
