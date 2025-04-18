"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/Alert";
import {
  IconUser,
  IconMail,
  IconIdBadge,
  IconEdit,
  IconMapPin,
  IconSchool,
  IconTrash,
} from "@tabler/icons-react";


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
  const [usernameInput, setUsernameInput] = useState("");
  const searchParams = useSearchParams();
  const [isDeleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Function to close the delete account modal
  const closeDeleteAccountModal = () => {
    setDeleteAccountModalOpen(false);
    setUsernameInput(""); // Clear the username input when closing the modal
  };

    const handleSignout = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          try {
            // Change the Authorization header format to match what your backend expects
            await axios.post(`${getApiBaseUrl()}/api/users/signout/`, {}, {
              headers: {
                'Authorization': `Token ${token}`  // Changed from Bearer to Token
              }
            });
          } catch (apiError) {
            console.error('API error during signout:', apiError);
            // Continue with local logout even if API call fails
          }
        }
        
        // Always clear local storage and state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        
        // Show success alert
        setAlert({ type: "success", message: "You have successfully logged out." });
  
        // Redirect to home page after a short delay
        setTimeout(() => {
          setAlert(null); // Clear the alert after a few seconds
          router.push("/");
        }, 3000);
        
      } catch (error) {
        console.error('Error during signout process:', error);
        
        // Ensure we still clear data even if there's an error
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    };
  

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
  
    // Update the form data without triggering warnings
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  
    // Handle city updates separately
    if (name === "city") {
      setCity(value);
    }
  }, []);
  
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
  
    // Validate the password field on blur
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
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showAlert("error", "Invalid email format");
      return;
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
    setDeleteAccountModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteAccountModalOpen(false);
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
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      {/* Content container with max width for wider screens */}
      <div className="relative mx-auto w-full">
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
  
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Personal Information - now spans more columns on larger screens */}
                  <div className={cn(
                    "rounded-lg p-6 md:col-span-7",
                    theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-80"
                  )}>
                    <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                      style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconUser className="mr-2 h-5 w-5 text-blue-500" />
                          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Username</span>
                        </Label>
                        <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                          {user?.username}
                        </p>
                      </LabelInputContainer>
                      
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconMail className="mr-2 h-5 w-5 text-green-500" />
                          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Email Address</span>
                        </Label>
                        <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                          {user?.email}
                        </p>
                      </LabelInputContainer>
                      
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconIdBadge className="mr-2 h-5 w-5 text-purple-500" />
                          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Name</span>
                        </Label>
                        <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                          {user?.name}
                        </p>
                      </LabelInputContainer>
                      
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconEdit className="mr-2 h-5 w-5 text-amber-500" />
                          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Surname</span>
                        </Label>
                        <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                          {user?.surname}
                        </p>
                      </LabelInputContainer>
                    </div>
                  </div>
  
                  {/* School Information - now spans fewer columns on larger screens */}
                  {user && user.region && user.city && user.school && (
                    <div className={cn(
                      "rounded-lg p-6 md:col-span-5",
                      theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-80"
                    )}>
                      <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                        School Information
                      </h3>
                      
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconMapPin className="mr-2 h-5 w-5 text-red-500" />
                          <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>City</span>
                        </Label>
                        <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-black")}>
                          {user?.city}
                        </p>
                      </LabelInputContainer>
                      
                      <LabelInputContainer className="mb-4">
                        <Label className={`flex items-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          <IconSchool className="mr-2 h-5 w-5 text-purple-500" />
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
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 justify center">
                  {/* Edit Profile Button */}
                  <button
                    onClick={() => setEditMode(true)}
                    className={cn(
                      "btn btn-md btn-primary",
                      theme === "dark" ? "dark:btn-primary" : ""
                    )}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">Edit Profile</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </span>
                  </button>
                  
                  {/* Complete Profile Button */}
                  {isProfileCompleted === false && (
                    <button
                      onClick={() => router.push('/profile/complete')}
                      className={cn(
                        "btn btn-md btn-success",
                        theme === "dark" ? "dark:btn-success" : ""
                      )}
                      style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">Complete Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  )}
                  
                  {/* Delete Account Button */}
                  <button
                    onClick={openDeleteModal}
                    className={cn(
                      "btn btn-md btn-danger",
                      theme === "dark" ? "dark:btn-danger" : ""
                    )}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete Account
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Delete Account Modal */}
          <Modal isOpen={isDeleteAccountModalOpen} onClose={closeDeleteAccountModal}>
  <div title=" ">
    {/* Header Section */}
    <div className={cn("p-6", theme === "dark" ? "bg-[#f08060]" : "bg-[#f08060]")}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <IconTrash className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Confirm Account Deletion
        </h2>
      </div>
    </div>

    {/* Content Section */}
      <div className="p-6">
        <p
        className={cn(
          "mb-6 text-base",
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        )}
        >
        Are you sure you want to delete your account? This action is irreversible, and all your data will be permanently removed.
        </p>
        <p
        className={cn(
          "mb-6 text-base",
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        )}
        >
        To confirm, please type your username below:
        </p>
        <input
        type="text"
        placeholder="Enter your username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        className={cn(
          "w-full px-4 py-2 mb-6 border rounded-md",
          theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"
        )}
        />
        <div className="flex items-center justify-between gap-3">
        {/* Sign Out Button */}
        <button
          onClick={handleSignout}
          className={cn(
          "btn btn-md",
          theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          )}
        >
          Sign Out
        </button>

        <div className="flex items-center gap-3">
          {/* Cancel Button */}
          <button
            onClick={closeDeleteAccountModal}
            className={cn(
              "btn btn-md btn-secondary",
              theme === "dark" ? "dark:btn-secondary" : ""
            )}
          >
            Cancel
          </button>

          {/* Confirm Delete Button */}
          <button
            onClick={handleDelete}
            disabled={usernameInput !== user?.username} // Disable button if username doesn't match
            className={cn(
              "btn btn-md btn-danger",
              usernameInput === user?.username ? "" : "opacity-50 cursor-not-allowed",
              theme === "dark" ? "dark:btn-danger" : ""
            )}
          >
            Delete Account
          </button>
        </div>
      </div>
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


export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}