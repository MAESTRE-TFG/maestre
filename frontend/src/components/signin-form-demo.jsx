"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { IconUser, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function SigninForm({ onSubmit, params }) {
  const { theme } = useTheme();
  const locale = params?.locale || 'es';

  const t = useTranslations("SigninForm");
  const [formData, setFormData] = React.useState({
    emailOrUsername: "",
    password: ""
  });
  const [showPassword, setShowPassword] = React.useState(false);

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
            <IconUser
              className={cn(
                "inline-block mr-2",
                theme === "dark" ? "text-cyan-400" : "text-[rgb(25,65,166)]"
              )}
            />{" "}
            {t("fields.emailOrUsername.label")}
          </Label>
          <Input
            id="emailOrUsername"
            name="emailOrUsername"
            placeholder={t("fields.emailOrUsername.placeholder")}
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
            <IconLock
              className={cn(
                "inline-block mr-2",
                theme === "dark" ? "text-cyan-400" : "text-[rgb(25,65,166)]"
              )}
            />{" "}
            {t("fields.password.label")}
          </Label>
          <Input
            id="password"
            name="password"
            placeholder={t("fields.password.placeholder")}
            type={showPassword ? "text" : "password"}
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
              <IconEyeOff
                className={cn(
                  "h-5 w-5",
                  theme === "dark" ? "text-cyan-400" : "text-[rgb(25,65,166)]"
                )}
              />
            ) : (
              <IconEye
                className={cn(
                  "h-5 w-5",
                  theme === "dark" ? "text-cyan-400" : "text-[rgb(25,65,166)]"
                )}
              />
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
          {t("buttons.signin")} &rarr;
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

        <div className="text-center mt-2">
          <p className={cn(theme === "dark" ? "text-white" : "text-black")}>
            {t("noAccount")}
          </p>
          <button
            className={cn(
              "btn btn-md btn-success w-full mt-2",
              theme === "dark" ? "dark:btn-success" : ""
            )}
            onClick={() => (window.location.href = `/${locale}/profile/signup`)}
          >
            {t("buttons.signup")}
          </button>
        </div>
      </form>
    </div>
  );
}


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

