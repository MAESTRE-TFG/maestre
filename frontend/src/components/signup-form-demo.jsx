"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function SignupForm({ onSubmit }) {
  const { theme } = useTheme();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    region: null,
    city: null,
    school: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
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
      <form className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12" onSubmit={handleSubmit} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
        <div className="space-y-6 md:space-y-8">
          <LabelInputContainer>
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="firstname">📛 Name</Label>
            <Input id="firstname" name="name" placeholder="Tyler" type="text" required value={formData.name} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="lastname">📝 Surname</Label>
            <Input id="lastname" name="surname" placeholder="Durden" type="text" required value={formData.surname} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="username">👤 Username</Label>
            <Input id="username" name="username" placeholder="superprof01" type="text" required value={formData.username} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        <div className="space-y-6 md:space-y-8">
          <LabelInputContainer>
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="email">📧 Email</Label>
            <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" required value={formData.email} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="password">🔒 Password</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required value={formData.password} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        <button
          className={cn("relative group/btn block w-full rounded-md h-12 font-medium border border-transparent col-span-2", 
            theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
            : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-green-300"
          )}
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>
                  
        <div className="text-center mt-6 col-span-2">
          <p style={{ fontFamily: "'Alfa Slab One', sans-serif" }} className={cn(theme === "dark" ? "text-white" : "text-black")}>
            Already have an account? 
          </p>
          <button
            className={cn("relative group/btn mt-4 block w-full rounded-md h-12 font-medium border border-transparent", 
              theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
            )}
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            onClick={() => window.location.href = "/profile/signin"}>
            Sign in
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (<>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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
