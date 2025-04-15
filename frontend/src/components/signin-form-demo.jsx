"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { IconUser, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react"; // Import necessary icons

export function SigninForm({ onSubmit }) {
  const { theme } = useTheme();
  const [formData, setFormData] = React.useState({
    emailOrUsername: "",
    password: ""
  });
  const [showPassword, setShowPassword] = React.useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "max-w-md w-full mx-auto rounded-none md:rounded-xl p-4 md:p-6 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
      <form
        className="my-4"
        onSubmit={handleSubmit}
      >
        <LabelInputContainer className="mb-6">
          <Label
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            htmlFor="emailOrUsername"
          >
            <IconUser className="inline-block mr-2" /> Email or Username
          </Label>
          <Input
            id="emailOrUsername"
            name="emailOrUsername"
            placeholder="email@example.com or username"
            type="text"
            required
            value={formData.emailOrUsername}
            onChange={handleChange}
            className={cn(
              theme === "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            )}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-6 relative">
          <Label
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            htmlFor="password"
          >
            <IconLock className="inline-block mr-2" /> Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"} // Toggle input type
            required
            value={formData.password}
            onChange={handleChange}
            className={cn(
              theme === "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            )}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <IconEyeOff className="h-5 w-5" />
            ) : (
              <IconEye className="h-5 w-5" />
            )}
          </button>
        </LabelInputContainer>

        <button
          className={cn(
            "btn btn-md btn-primary w-full",
            theme === "dark" ? "dark:btn-primary" : ""
          )}
          type="submit"
        >
          Sign in &rarr;
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

        <div className="text-center mt-2">
          <p className={cn(theme === "dark" ? "text-white" : "text-black")}>
            Don't have an account?
          </p>
          <button
            className={cn(
              "btn btn-md btn-success w-full mt-2",
              theme === "dark" ? "dark:btn-success" : ""
            )}
            onClick={() => (window.location.href = "/profile/signup")}
          >
            Sign up
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

