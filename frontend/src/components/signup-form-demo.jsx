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
    surname: ""
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
    <div className={cn("max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white")}>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" name="name" placeholder="Tyler" type="text" required value={formData.name} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" name="surname" placeholder="Durden" type="text" required value={formData.surname} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Your username</Label>
          <Input id="username" name="username" placeholder="superprof01" type="text" required value={formData.username} onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" required value={formData.email} onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required value={formData.password} onChange={handleChange} />
        </LabelInputContainer>

        <button
          className={cn("relative group/btn block w-full text-white rounded-md h-10 font-medium", theme === "dark" ? "bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" : "bg-gradient-to-br from-black to-neutral-600 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]")}
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
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
      {children}
    </div>
  );
};
