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
    <div className={cn("max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white")}>
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
      <form className="my-1" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
          <LabelInputContainer className="mb-4">
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="username">👤 Username</Label>
            <Input id="username" name="username" placeholder="Username" type="text" required value={formData.username || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="email">📧 Email Address</Label>
            <Input id="email" name="email" placeholder="Email" type="email" required value={formData.email || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="name">📛 Name</Label>
            <Input id="name" name="name" placeholder="Name" type="text" required value={formData.name || ""} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="surname">📝 Surname</Label>
            <Input id="surname" name="surname" placeholder="Surname" type="text" required value={formData.surname || ""} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        {isProfileComplete && (
          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            <LabelInputContainer className="mb-4">
              <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="region">🌍 Region</Label>
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
              <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="city">🏙️ City</Label>
              <Input id="city" name="city" placeholder="Sevilla" type="text" required value={formData.city || ""} onChange={handleChange} disabled={!isProfileComplete} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-5">
              <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="school">🏫 School</Label>
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
            <p style={{ fontFamily: "'Alfa Slab One', sans-serif" }} className={cn("text-sm mb-2", theme === "dark" ? "text-white" : "text-black")}>
              ¿Can't find your school?
            </p>
            <button
              onClick={() => router.push("/school_create")}
              className={cn("relative group/btn block w-full rounded-md h-10 font-medium border border-transparent", 
                theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
              )}
              type="submit"
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
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
          type="submit"
          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
        >
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
          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
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
      {React.Children.map(children, child => {
        if (child.type === Label) {
          return React.cloneElement(child, {
            style: { ...child.props.style, fontSize: "1.25rem" } // Increase font size
          });
        }
        return child;
      })}
    </div>
  );
};
