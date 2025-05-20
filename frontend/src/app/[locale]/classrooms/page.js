"use client";

import { useRouter, useParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import Alert from "@/components/ui/Alert";
import Image from "next/image";
import { IconSchool } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const ClassroomsList = () => {
  const t = useTranslations('ClassroomsPage');
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [alert, setAlert] = useState(null);

  const routeParams = useParams();
  const locale = routeParams?.locale || 'es';

  const classroomImages = [
    "/static/classrooms/classroom_01.webp",
    "/static/classrooms/classroom_02.webp",
    "/static/classrooms/classroom_03.webp",
    "/static/classrooms/classroom_04.webp",
    "/static/classrooms/classroom_05.webp",
  ];

  const assignRandomImages = (classrooms) => {
    let availableImages = [...classroomImages];
    return classrooms.map((classroom) => {
      if (availableImages.length === 0) {
        availableImages = [...classroomImages];
      }
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages[randomIndex];
      availableImages.splice(randomIndex, 1);
      return {
        ...classroom,
        imageUrl: selectedImage,
      };
    });
  };

  useEffect(() => {
    setIsClient(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
          params: {
            creator: user.id,
          },
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        const classroomsWithImages = assignRandomImages(response.data);
        setClasses(classroomsWithImages);
      } catch (err) {
        setAlert({ type: "error", message: t("alerts.fetchError") });
      }
    };
    fetchClasses();
  }, [t]);

  const handleEdit = (classId) => {
    router.push(`/${locale}/classrooms/edit?id=${classId}&editMode=true`);
  };

  const handleCreate = () => {
    router.push(`/${locale}/classrooms/new`);
  };

  const truncateDescription = (description) => {
    return description.length > 40 ? `${description.substring(0, 60)}...` : description;
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      <div className="relative mx-auto max-w-7xl w-full">
        {alert && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="relative w-full flex-1 flex flex-col items-center py-14">
          <div className="w-full max-w-4xl flex flex-col items-center mb-8">
            <div className="flex items-center gap-4">
              <IconSchool className={`w-16 h-16 drop-shadow-lg text-primary`} />
              <div className="text-center">
                <h1 className={`text-4xl font-extrabold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {t("header.title")}
                </h1>
                <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t("header.subtitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16">
            {classes.length === 0 ? (
              <div
                className={cn(
                  "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                  "rounded-xl shadow-xl p-8 text-center",
                  "w-full max-w-2xl mx-auto",
                  theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                )}
              >
                <p className={`text-lg font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {t("noClasses")}
                </p>
                  <button
                    onClick={handleCreate}
                    className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
                  >
                    {t("createClassButton")}
                  </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  {classes.length < 5 && (
                    <button
                      className={cn(
                        "px-4 py-3 rounded-full font-medium text-white transition-all",
                        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                        "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
                        "flex items-center gap-2"
                      )}
                      onClick={handleCreate}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      {t("createClassButton")}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full">
                  {classes.map((classroom) => (
                    <div key={classroom.id} className="w-full min-w-0 flex">
                      <CardContainer className="inter-var w-full" containerClassName="py-10 w-full">
                        <CardBody
                          className={cn(
                            "relative group/card border h-auto rounded-xl p-6 w-full",
                            "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                            theme === "dark"
                              ? "dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] bg-gray-800 border-gray-700"
                              : "hover:shadow-xl hover:shadow-blue-500/[0.1] bg-white border-gray-100"
                          )}
                        >
                          <div className="flex flex-col justify-center items-center">
                            <CardItem
                              translateZ="50"
                              className={`text-2xl font-bold cursor-pointer hover:underline mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                              onClick={() => router.push(`/${locale}/classrooms/${classroom.id}`)}
                            >
                              {classroom.name}
                            </CardItem>

                            <CardItem translateZ="60" className="w-full mb-4 h-40 relative">
                              <Image
                                src={classroom.imageUrl}
                                alt={t("imageAlt", { name: classroom.name })}
                                fill
                                className="object-cover rounded-lg group-hover/card:shadow-xl"
                              />
                            </CardItem>

                            <CardItem
                              as="p"
                              translateZ="40"
                              className={`text-lg mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {truncateDescription(classroom.description)}
                            </CardItem>

                            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                              <CardItem
                                translateZ="30"
                                translateX="-5"
                                className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                  {t("courseLabel")}
                                </p>
                                <p className={`text-md font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                                  {classroom.academic_course}
                                </p>
                              </CardItem>
                              <CardItem
                                translateZ="30"
                                translateX="5"
                                className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                              >
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                  {t("yearLabel")}
                                </p>
                                <p className={`text-md font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                                  {classroom.academic_year}
                                </p>
                              </CardItem>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                              <CardItem
                                translateZ="40"
                                translateY="5"
                                as="button"
                                onClick={() => router.push(`/${locale}/classrooms/${classroom.id}`)}
                                className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center flex-1"
                              >
                                {t("openClassButton")}
                              </CardItem>
                              <CardItem
                                translateZ="40"
                                translateY="5"
                                as="button"
                                onClick={() => handleEdit(classroom.id)}
                                className="btn btn-secondary py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center flex-1"
                              >
                                {t("editButton")}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-transform group-hover:translate-x-1"
                                >
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                              </CardItem>
                            </div>
                          </div>
                        </CardBody>
                      </CardContainer>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomsList} />;
};