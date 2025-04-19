"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import {
  IconUser,
  IconMail,
  IconIdBadge,
  IconEdit,
  IconLock,
  IconMapPin,
  IconSchool,
  IconWorld,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

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

export function ProfileEditForm({
  formData,
  handleChange,
  handleUpdate,
  handleCancel,
  schools,
  isProfileComplete,
  params,
}) {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslations("ProfileEditForm"); // Use translations for this component
  const locale = params?.locale || 'es';

  // State to toggle password visibility
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
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
          box-shadow: 0 0 0 3px
            ${theme === "dark"
              ? "rgba(136, 136, 136, 0.5)"
              : "rgba(0, 123, 255, 0.25)"};
        }
        option {
          background: ${theme === "dark" ? "#333" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
      `}</style>
      <form
        className="my-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
            {/* Personal Information Section */}
            <div className="flex flex-col gap-6 mb-8">
              {/* Username and Email in one row */}
              <div className="flex flex-col md:flex-row gap-6">
                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{
                      fontFamily: "'Alfa Slab One', sans-serif",
                      fontSize: "1rem",
                    }}
                    htmlFor="username"
                  >
                    <IconUser className="mr-2 h-5 w-5 text-blue-500" />
                    {t("fields.username.label")} 
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder={t("fields.username.placeholder")} // Internationalized
                    type="text"
                    required
                    value={formData.username || ""}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{
                      fontFamily: "'Alfa Slab One', sans-serif",
                      fontSize: "1rem",
                    }}
                    htmlFor="email"
                  >
                    <IconMail className="mr-2 h-5 w-5 text-green-500" />
                    {t("fields.email.label")} 
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder={t("fields.email.placeholder")} // Internationalized
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </LabelInputContainer>
              </div>

              {/* Name and Surname in one row */}
              <div className="flex flex-col md:flex-row gap-6">
                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                    htmlFor="name"
                  >
                    <IconIdBadge className="mr-2 h-5 w-5 text-purple-500" />
                    {t("fields.name.label")} 
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("fields.name.placeholder")} // Internationalized
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <LabelInputContainer className="flex-1">
                  <Label
                    className="flex items-center"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                    htmlFor="surname"
                  >
                    <IconEdit className="mr-2 h-5 w-5 text-amber-500" />
                    {t("fields.surname.label")} 
                  </Label>
                  <Input
                    id="surname"
                    name="surname"
                    placeholder={t("fields.surname.placeholder")} // Internationalized
                    type="text"
                    required
                    value={formData.surname || ""}
                    onChange={handleChange}
                  />
                </LabelInputContainer>
              </div>
            </div>
            <br />

            {/* Password Section */}
            <h3
              className={cn(
                "text-lg font-bold mt-4",
                theme === "dark" ? "text-white" : "text-gray-800"
              )}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              {t("password.changeTitle")} 
            </h3>
            <p
              className={cn(
                "text-sm mt-2",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              {t("password.changeDescription")} 
            </p>
            <br />
            <LabelInputContainer className="flex-1">
              <Label
                className="flex items-center"
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                htmlFor="oldPassword"
              >
                <IconLock className="mr-2 h-5 w-5 text-red-500" />
                {t("fields.oldPassword.label")} 
              </Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                placeholder={t("fields.oldPassword.placeholder")} // Internationalized
                type="password"
                value={formData.oldPassword || ""}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <br />
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <LabelInputContainer className="flex-1 relative">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="password"
                >
                  <IconLock className="mr-2 h-5 w-5 text-red-500" />
                  {t("fields.newPassword.label")} 
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder={t("fields.newPassword.placeholder")} // Internationalized
                  type={showNewPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </LabelInputContainer>
              <LabelInputContainer className="flex-1 relative">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="confirmPassword"
                >
                  <IconLock className="mr-2 h-5 w-5 text-red-500" />
                  {t("fields.confirmPassword.label")} 
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder={t("fields.confirmPassword.placeholder")} // Internationalized
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </LabelInputContainer>
            </div>
          </div>
          {isProfileComplete && (
            <div className="flex-1 md:w-1/2 border border-gray-300 rounded-md p-4">
              {/* Location Section */}
              <LabelInputContainer className="mb-4">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="region"
                >
                  <IconWorld className="mr-2 h-5 w-5 text-blue-500" />
                  {t("fields.region.label")} 
                </Label>
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
                    {t("fields.region.placeholder")} 
                  </option>
                  {COMUNIDADES.map((comunidad) => (
                    <option key={comunidad} value={comunidad}>
                      {comunidad}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>

              <LabelInputContainer className="mb-4">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="city"
                >
                  <IconMapPin className="mr-2 h-5 w-5 text-green-500" />
                  {t("fields.city.label")} 
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder={t("fields.city.placeholder")} // Internationalized
                  type="text"
                  required
                  value={formData.city || ""}
                  onChange={handleChange}
                  disabled={!isProfileComplete}
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-5">
                <Label
                  className="flex items-center"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  htmlFor="school"
                >
                  <IconSchool className="mr-2 h-5 w-5 text-purple-500" />
                  {t("fields.school.label")} 
                </Label>
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
                    {t("fields.school.placeholder")} 
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
              <p
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                className={cn(
                  "text-sm mb-2",
                  theme === "dark" ? "text-white" : "text-black"
                )}
              >
                {t("fields.school.notFound")} 
              </p>
              {/* Button to create a new school */}
              <button
                onClick={() => router.push(`/${locale}/schools/new`)}
                className={cn(
                  "btn btn-md btn-secondary w-full",
                  theme === "dark" ? "dark:btn-primary" : ""
                )}
                type="button"
              >
                {t("fields.school.createButton")} &rarr; 
              </button>
            </div>
          )}
        </div>
        {/* Update Profile and Cancel Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className={cn(
              "btn btn-md btn-secondary w-1/2",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
            type="button"
            onClick={handleCancel}
          >
            &larr; {t("buttons.cancel")} 
          </button>
          <button
            className={cn(
              "btn btn-md btn-success w-1/2",
              theme === "dark" ? "dark:btn-success" : ""
            )}
            type="submit"
          >
            {t("buttons.update")} &rarr; 
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
