"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import {
  IconUser,
  IconMail,
  IconLock,
  IconIdBadge,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import Alert from "@/components/ui/Alert";

export function SignupForm({ onSubmit, showAlert }) {
  const { theme } = useTheme();
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    region: null,
    city: null,
    school: null,
  });
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      showAlert("warning", "You must accept the Terms of Use and Privacy Policy to sign up.");
      return;
    }
    try {
      await onSubmit(formData);
    } catch (err) {
      showAlert("error", "An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');
        
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
        
        select:hover {
          background: ${theme === "dark" ? "#fff" : "#f9f9f9"};
          color: ${theme === "dark" ? "#000" : "#000"};
        }
        
        option {
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
      `}</style>

      <h2
        className={cn(
          "text-2xl font-bold text-center mb-6",
          theme === "dark" ? "text-white" : "text-black"
        )}
        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
      >
        Create Your Account
      </h2>

      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>

          <fieldset className="border rounded-lg p-4">
            <legend
              className={cn(
                "px-2 font-semibold",
                theme === "dark" ? "text-white" : "text-black"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Personal Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">
            <IconIdBadge className="inline-block mr-2 text-blue-500" /> Name
                </Label>
                <Input
            id="firstname"
            name="name"
            placeholder="Tyler"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={cn(
              theme === "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            )}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="lastname">
            <IconIdBadge className="inline-block mr-2 text-blue-500" /> Surname
                </Label>
                <Input
            id="lastname"
            name="surname"
            placeholder="Durden"
            type="text"
            required
            value={formData.surname}
            onChange={handleChange}
            className={cn(
              theme === "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-gray-100"
            )}
                />
              </LabelInputContainer>
            </div>
          </fieldset>

          {/* Account Information Section */}
          <fieldset className="border rounded-lg p-4">
            <legend className={cn(
              "px-2 font-semibold",
              theme === "dark" ? "text-white" : "text-black"
            )} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
              Account Information
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="username">
            <IconUser className="inline-block mr-2 text-green-500" /> Username
                </Label>
                <Input 
            id="username" 
            name="username" 
            placeholder="superprof01" 
            type="text" 
            required 
            value={formData.username} 
            onChange={handleChange} 
            className={cn(theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-gray-100")}
                />
              </LabelInputContainer>
              
              <LabelInputContainer>
                <Label htmlFor="email">
            <IconMail className="inline-block mr-2 text-red-500" /> Email
                </Label>
                <Input 
            id="email" 
            name="email" 
            placeholder="projectmayhem@fc.com" 
            type="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            className={cn(theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-gray-100")}
                />
              </LabelInputContainer>
              
              <LabelInputContainer className="md:col-span-2 relative">
                <Label htmlFor="password">
            <IconLock className="inline-block mr-2 text-purple-500" /> Password
                </Label>
                <Input 
            id="password" 
            name="password" 
            placeholder="••••••••" 
            type={showPassword ? "text" : "password"}
            required 
            value={formData.password} 
            onChange={handleChange} 
            className={cn(theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-gray-100")}
                />
                <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
            {showPassword ? (
              <IconEyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <IconEye className="h-5 w-5 text-gray-500" />
            )}
                </button>
              </LabelInputContainer>
            </div>
          </fieldset>

          {/* Terms and Conditions */}
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={handleTermsChange}
            required
            className="h-4 w-4"
          />
          <label
            htmlFor="terms"
            className={cn(theme === "dark" ? "text-white" : "text-black")}
          >
            I accept the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Submit Button */}
        <button
          className={cn(
            "btn btn-md btn-primary w-full",
            theme === "dark" ? "dark:btn-primary" : ""
          )}
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
                  
        {/* Sign In Option */}
        <div className="text-center mt-4">
          <p
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            className={cn(theme === "dark" ? "text-white" : "text-black")}
          >
            Already have an account?
          </p>
          <button
            className={cn(
              "btn btn-md btn-secondary w-full mt-2",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
            onClick={() => (window.location.href = "/profile/signin")}
          >
            Sign in
            <BottomGradient />
          </button>
        </div>
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