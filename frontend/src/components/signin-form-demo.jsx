"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function SigninForm({ onSubmit }) {
  const { theme } = useTheme();
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
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
      <form className="my-8" onSubmit={handleSubmit} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
        <LabelInputContainer className="mb-4">
          <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="email">📧 Email Address</Label>
          <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" required value={formData.email} onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label style={{ fontFamily: "'Alfa Slab One', sans-serif" }} htmlFor="password">🔒 Password</Label>
          <Input id="password" name="password" placeholder="••••••••" type="password" required value={formData.password} onChange={handleChange} />
        </LabelInputContainer>

        <button
          className={cn("relative group/btn block w-full rounded-md h-10 font-medium border border-transparent", 
            theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
            : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
          )}
          type="submit">
          Sign in &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="text-center mt-4">
          <p className={cn(theme === "dark" ? "text-white" : "text-black")}>
            Don't have an account? 
          </p>
          <button
            className={cn("relative group/btn mt-2 block w-full rounded-md h-10 font-medium border border-transparent", 
              theme === "dark" ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-green-300"
            )}
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            onClick={() => window.location.href = "/signup"}>
            Sign up
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
            style: { ...child.props.style, fontSize: "1.25rem" } // Increase font size
          });
        }
        return child;
      })}
    </div>
  );
};

