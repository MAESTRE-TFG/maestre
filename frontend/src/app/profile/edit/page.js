"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/Alert";

const ProfileEdit = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    region: "",
    city: "",
    school: "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [alert, setAlert] = useState(null); // State for managing alerts
  const [isProfileCompleted, setIsProfileCompleted] = useState(null);
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const searchParams = useSearchParams();

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto-dismiss after 5 seconds
  };

  useEffect(() => {
    if (searchParams.get("editMode") === "true") {
      setEditMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      parsedUser.region && parsedUser.city && parsedUser.school
        ? setIsProfileCompleted(true)
        : setIsProfileCompleted(false);
      setCity(parsedUser.city);
      setFormData((prevData) => ({
        ...prevData,
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        name: parsedUser.name || "",
        surname: parsedUser.surname || "",
        region: parsedUser.region || "",
        city: parsedUser.city || "",
        school: parsedUser.school || "",
      }));
    } else {
      router.push("/profile/signin");
    }
  }, [router]);

  useEffect(() => {
    const getSchools = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/schools/?city=${formData.city}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSchools(response.data);
      } catch (err) {
        showAlert("error", "Failed to fetch schools");
      }
    };

    if (formData.city) {
      getSchools();
    }
  }, [formData.city]);

  useEffect(() => {
    const getSchoolById = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/schools/${formData.school}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSchool(response.data);
      } catch (err) {
        showAlert("error", "Failed to fetch school");
      }
    };

    if (formData.school) {
      getSchoolById();
    }
  }, [formData.school]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Field length restrictions
    if (name === "username" && value.length > 30) {
      showAlert("warning", "Username cannot exceed 30 characters");
      return;
    }
    if (name === "email" && value.length > 255) {
      showAlert("warning", "Email cannot exceed 255 characters");
      return;
    }
    if (name === "name" && value.length > 30) {
      showAlert("warning", "First name cannot exceed 30 characters");
      return;
    }
    if (name === "surname" && value.length > 30) {
      showAlert("warning", "Last name cannot exceed 30 characters");
      return;
    }

    if (name === "password") {
      if (value.length < 8) {
        showAlert("warning", "Password must be at least 8 characters long");
        return;
      }
      if (!/[A-Z]/.test(value)) {
        showAlert("warning", "Password must contain at least one uppercase letter");
        return;
      }
      if (!/[a-z]/.test(value)) {
        showAlert("warning", "Password must contain at least one lowercase letter");
        return;
      }
      if (!/[0-9]/.test(value)) {
        showAlert("warning", "Password must contain at least one number");
        return;
      }
      if (!/[!@#$%^&*]/.test(value)) {
        showAlert("warning", "Password must contain at least one special character (!@#$%^&*)");
        return;
      }
    }

    if (name === "city") {
      setCity(value);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  }, []);

  const handleUpdate = useCallback(async () => {
    const updatePayload = {
      username: formData.username,
      email: formData.email,
      name: formData.name,
      surname: formData.surname,
      region: formData.region,
      city: formData.city,
      school: formData.school,
    };

    if (formData.password && formData.oldPassword) {
      if (formData.password !== formData.confirmPassword) {
        showAlert("error", "Passwords do not match");
        return;
      }
      updatePayload.password = formData.password;
      updatePayload.oldPassword = formData.oldPassword;
    }

    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/users/${user.id}/update/`,
        updatePayload,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const userToStore = {
        ...response.data,
        password: undefined,
        oldPassword: undefined,
        confirmPassword: undefined,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        oldPassword: "",
      }));

      setEditMode(false);
      showAlert("success", "Profile updated successfully");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Update failed");
    }
  }, [formData, user?.id]);

  const handleDelete = useCallback(async () => {
    if (usernameInput === user.username) {
      try {
        await axios.delete(
          `${getApiBaseUrl()}/api/users/${user.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/profile/signin");
        showAlert("success", "Account deleted successfully");
      } catch (err) {
        showAlert("error", "Delete failed");
      }
    } else {
      showAlert("error", "Username does not match. Account deletion cancelled.");
    }
  }, [router, user?.id, user?.username, usernameInput]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUsernameInput("");
  };

  const memoizedForm = useMemo(
    () => (
      <ProfileEditForm
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        handleCancel={() => setEditMode(false)}
        schools={schools}
        isProfileComplete={isProfileCompleted}
      />
    ),
    [formData, handleChange, handleUpdate, schools, isProfileCompleted]
  );

  if (!isClient) return null;

  return (
    <div className={cn(
      "min-h-screen pt-24 px-4 sm:px-6 md:px-8 relative",
      "bg-gradient-to-br from-blue-500/10 to-purple-500/5"
    )}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 pointer-events-none"></div>
      
      {/* Content container with max width for wider screens */}
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Floating alert */}
        {alert && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}
      
      <div className="relative w-full flex-1 flex flex-col items-center py-12">
        {/* Header Section with Logo */}
        <div className="w-full max-w-4xl flex items-center mb-8 justify-center md:justify-start space-x-6">
          <img
            src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
            alt="MAESTRE Logo"
            className="w-20 h-20 drop-shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Hello{" "}
              <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                {user ? user.name : ""}
              </span>{" "}
              !
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              See and edit your profile and data
            </p>
          </div>
        </div>
  
        <div className="w-full max-w-4xl">
          {editMode ? (
            memoizedForm
          ) : (
            <div className={cn(
              "bg-opacity-30 backdrop-filter backdrop-blur-lg",
              "rounded-xl shadow-xl p-8",
              "w-full",
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            )}>
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
                option {
                  background: ${theme === "dark" ? "#333" : "#fff"};
                  color: ${theme === "dark" ? "#fff" : "#000"};
                }`}
              </style>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className={cn(
                  "rounded-lg p-6",
                  theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-80"
                )}>
                  <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                    Personal Information
                  </h3>
                  
                  <LabelInputContainer className="mb-4">
                    <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="mr-2">👤</span>
                      <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Username</span>
                    </Label>
                    <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                      {user?.username}
                    </p>
                  </LabelInputContainer>
                  
                  <LabelInputContainer className="mb-4">
                    <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="mr-2">📧</span>
                      <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Email Address</span>
                    </Label>
                    <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                      {user?.email}
                    </p>
                  </LabelInputContainer>
                  
                  <LabelInputContainer className="mb-4">
                    <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="mr-2">📛</span>
                      <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Name</span>
                    </Label>
                    <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                      {user?.name}
                    </p>
                  </LabelInputContainer>
                  
                  <LabelInputContainer className="mb-4">
                    <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="mr-2">📝</span>
                      <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Surname</span>
                    </Label>
                    <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                      {user?.surname}
                    </p>
                  </LabelInputContainer>
                </div>
  
                {/* School Information */}
                {user.region && user.city && user.school && (
                  <div className={cn(
                    "rounded-lg p-6",
                    theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-80"
                  )}>
                    <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                      style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                      School Information
                    </h3>
                    
                    <LabelInputContainer className="mb-4">
                      <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="mr-2">🌍</span>
                        <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Region</span>
                      </Label>
                      <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                        {user?.region}
                      </p>
                    </LabelInputContainer>
                    
                    <LabelInputContainer className="mb-4">
                      <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="mr-2">🏙️</span>
                        <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>City</span>
                      </Label>
                      <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                        {user?.city}
                      </p>
                    </LabelInputContainer>
                    
                    <LabelInputContainer className="mb-4">
                      <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="mr-2">🏫</span>
                        <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>School</span>
                      </Label>
                      <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                        {school?.name}
                      </p>
                    </LabelInputContainer>
                  </div>
                )}
              </div>
  
              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className={cn(
                    "relative group/btn flex items-center justify-center rounded-md h-12 font-medium",
                    "transition-all duration-300 overflow-hidden",
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/30"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                  )}
                  type="submit"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">Edit Profile</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </span>
                  <BottomGradient />
                </button>
                
                {isProfileCompleted === false && (
                  <button
                    onClick={() => router.push('/profile/complete')}
                    className={cn(
                      "relative group/btn flex items-center justify-center rounded-md h-12 font-medium",
                      "transition-all duration-300 overflow-hidden",
                      theme === "dark"
                        ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:shadow-lg hover:shadow-green-500/30"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30"
                    )}
                    type="button"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">Complete Profile</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <BottomGradient />
                  </button>
                )}
                
                {/* Delete Account Button */}
                <button
                  onClick={openDeleteModal}
                  className={cn(
                    "relative group/btn flex items-center justify-center rounded-md h-12 font-medium",
                    "transition-all duration-300 overflow-hidden",
                    "col-span-1 md:col-span-2 mt-2",
                    theme === "dark"
                      ? "bg-gradient-to-r from-red-600 to-orange-700 text-white hover:shadow-lg hover:shadow-red-500/30"
                      : "bg-gradient-to-r from-red-500 to-orange-600 text-white hover:shadow-lg hover:shadow-red-500/30"
                  )}
                  type="button"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                >
                  <span className="relative z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete Account
                  </span>
                  <BottomGradient isCancel />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Delete Account Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Delete Account">
          <div className={cn(
            "p-6 rounded-lg",
            theme === "dark" ? "bg-gray-800" : "bg-white"
          )}>
            <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
            >
              Delete Account
            </h2>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              ¿Estás seguro de que deseas eliminar tu cuenta de MAESTRE? Esto eliminará también todos tus cursos y material subido a la plataforma. Esta acción NO se puede deshacer.
            </p>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Para borrar tu cuenta, escribe antes tu nombre de usuario ({user.username}):
            </p>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 mb-6",
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-red-500"
                  : "bg-white border-gray-300 text-black focus:ring-red-500"
              )}
              placeholder="Enter your username"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium",
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                )}
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    </div>
  );
};


const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};


const BottomGradient = ({ isCancel }) => {
  return (
    <>
      <span
        className={cn(
          "absolute inset-0 w-full h-full transition-all group-hover/btn:opacity-90",
          isCancel
            ? "opacity-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20 blur-xl"
            : "opacity-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 blur-xl"
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 w-full group-hover/btn:opacity-100 transition-all duration-500 opacity-0",
          isCancel
            ? "bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        )}
      />
    </>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}