"use client";

import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";
import { CompleteProfileForm } from "@/components/complete-profile-form";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";

const ProfileEdit = ( params ) => {
  const router = useRouter();
  const { theme } = useTheme();
  const t = useTranslations("ProfileCompletePage");
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
    school: ""
  });
  const [alert, setAlert] = useState(null);
  const [schools, setSchools] = useState([]);
  const [city, setCity] = useState("");

  const locale = params?.locale || 'es';

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    const storedFormData = localStorage.getItem("formData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prevData) => ({
        ...prevData,
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        name: parsedUser.name || t("defaultName"),
        surname: parsedUser.surname || t("defaultSurname"),
      }));
    } else {
      router.push(`/${locale}/profile/signin`);
    }
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setFormData((prevData) => ({
        ...prevData,
        ...parsedFormData,
        name: parsedFormData.name || t("defaultName"),
        surname: parsedFormData.surname || t("defaultSurname"),
      }));
      setCity(parsedFormData.city);
    }
  }, [router, t]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "city") {
      setCity(value);
    }
    if (name === "username" && value.length > 30) {
      showAlert("error", t("alerts.usernameTooLong"));
      return;
    }
    if (name === "email" && value.length > 255) {
      showAlert("error", t("alerts.emailTooLong"));
      return;
    }
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }, [formData, t]);

  const fetchSchools = useCallback(async () => {
    if (!city) return; 
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/schools/?city=${city}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setSchools(response.data);
    } catch (err) {
      showAlert("error", t("alerts.fetchSchoolsError"));
    }
  }, [city, t]);

  useEffect(() => {
    fetchSchools();
  }, [city, fetchSchools]);

  const handleComplete = useCallback(async () => {
    try {
      if (!formData.username || !formData.email || !formData.name || !formData.surname || !formData.region || !formData.city || !formData.school) {
        showAlert("error", t("alerts.allFieldsRequired"));
        return;
      }

      if (formData.username.length > 30) {
        showAlert("error", t("alerts.usernameTooLong"));
        return;
      }

      if (formData.email.length > 255) {
        showAlert("error", t("alerts.emailTooLong"));
        return;
      }

      const response = await axios.put(
        `${getApiBaseUrl()}/api/users/${user.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.removeItem("formData");
      setUser(response.data);
      setEditMode(false);
      showAlert("success", t("alerts.updateSuccess"));
    } catch (err) {
      showAlert("error", t("alerts.updateError", { error: err.response?.data?.message || err.message }));
    }
  }, [formData, user?.id, t]);

  const handleCreateSchool = useCallback(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    router.push(`/${locale}/schools/new`);
  }, [formData, router]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5 flex justify-center items-center">
      {/* Content container with max width for wider screens */}
      <div className="relative mx-auto max-w-4xl w-full">
        {/* Floating alert */}
        {alert && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}
        
        <div className="relative w-full flex-1 flex flex-col items-center py-12">
          {/* Header Section with Logo */}
          <div className="w-full max-w-4xl flex items-center mb-8 justify-center space-x-6">
            <img
              src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
              alt={t("header.logoAlt")}
              className="w-20 h-20 drop-shadow-lg"
            />
            <div className="text-center">
              <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t("header.title")}
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          `}</style>
          
          <div className="w-full">
            <CompleteProfileForm 
              formData={formData}
              handleChange={handleChange}
              handleComplete={handleComplete}
              handleCreateSchool={handleCreateSchool}
              schools={schools}
              buttonClassName="btn" 
              buttonSpacing="space-y-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  return <SidebarDemo ContentComponent={ProfileEdit} />;
}