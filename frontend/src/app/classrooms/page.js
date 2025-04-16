"use client";

import { useRouter } from "next/navigation";
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

const ClassroomsList = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const classroomImages = [
    "/static/classrooms/classroom_01.webp",
    "/static/classrooms/classroom_02.webp",
    "/static/classrooms/classroom_03.webp",
    // "/static/classrooms/classroom_04.webp",
    // "/static/classrooms/classroom_05.webp",
  ];

  // Function to assign unique random images to classrooms
  const assignRandomImages = (classrooms) => {
    // Create a copy of the images array to work with
    let availableImages = [...classroomImages];
    
    return classrooms.map(classroom => {
      // If we've used all images, reset the available images
      if (availableImages.length === 0) {
        availableImages = [...classroomImages];
      }
      
      // Select a random image from the available ones
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages[randomIndex];
      
      // Remove the selected image from available images
      availableImages.splice(randomIndex, 1);
      
      // Return classroom with the image
      return {
        ...classroom,
        imageUrl: selectedImage
      };
    });
  };

  useEffect(() => {
    setIsClient(true);
    const user = JSON.parse(localStorage.getItem('user'));
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
        // Assign random images to the classrooms
        const classroomsWithImages = assignRandomImages(response.data);
        setClasses(classroomsWithImages);
      } catch (err) {
        setAlert({ type: "error", message: "Failed to fetch classes. Please try again later." });
      }
    };
    fetchClasses();
  }, []);

  const handleEdit = (classId) => {
    router.push(`/classrooms/edit?id=${classId}&editMode=true`);
  };

  const handleCreate = () => {
    router.push("/classrooms/new");
  };

  const truncateDescription = (description) => {
    return description.length > 40 ? `${description.substring(0, 60)}...` : description;
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      {/* Content container with max width for wider screens */}
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Floating alert */}
        {alert && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}
        
        <div className="relative w-full flex-1 flex flex-col items-center py-12">
          {/* Header Section with Logo */}
          <div className="w-full max-w-4xl flex items-center mb-8 justify-center space-x-6">
            <IconSchool 
              className={`w-20 h-20 drop-shadow-lg text-primary`}
            />
            <div className="text-center">
              <h1 className={`text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                My Classrooms
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your classes
              </p>
            </div>
          </div>
          
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
          `}</style>
          
          <div className="w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16">
            {classes.length === 0 ? (
              <div className={cn(
                "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                "rounded-xl shadow-xl p-8 text-center",
                "w-full max-w-2xl mx-auto", // Added max-width and horizontal auto margins
                theme === "dark"
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-100"
              )}>
                <p className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  No classes found
                </p>
                <button
                  onClick={handleCreate}
                  className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center w-full mx-auto max-w-sm"
                >
                  Create New Classroom +
                  <BottomGradient isCreate={true} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <button
                    className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center px-6"
                    onClick={() => router.push("/classrooms/new")}
                  >
                    Create Classroom +
                    <BottomGradient isCreate={true} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                  {classes.map((classroom) => (
                    <CardContainer key={classroom.id} className="inter-var" containerClassName="py-10">
                      <CardBody 
                        className={cn(
                          "relative group/card border h-auto rounded-xl p-6",
                          "bg-opacity-30 backdrop-filter backdrop-blur-lg",
                          "w-full sm:w-[500px]", // Increased fixed width for all cards
                          theme === "dark" 
                            ? "dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] bg-gray-800 border-gray-700" 
                            : "hover:shadow-xl hover:shadow-blue-500/[0.1] bg-white border-gray-100"
                        )}
                      >
                        <div className="flex flex-col justify-center items-center">
                          <CardItem 
                            translateZ="50"
                            className={`text-2xl font-bold cursor-pointer hover:underline mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                            onClick={() => router.push(`/classrooms/${classroom.id}`)}
                          >
                            {classroom.name}
                          </CardItem>
                          
                          <CardItem
                            translateZ="60"
                            className="w-full mb-4 h-40 relative"
                          >
                            <Image
                              src={classroom.imageUrl}
                              alt={`${classroom.name} classroom`}
                              fill
                              className="object-cover rounded-lg group-hover/card:shadow-xl"
                            />
                          </CardItem>
                          
                          <CardItem
                            as="p"
                            translateZ="40"
                            className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                          >
                            {truncateDescription(classroom.description)}
                          </CardItem>
                          
                          <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <CardItem
                              translateZ="30"
                              translateX="-5"
                              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                            >
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Course</p>
                              <p className={`text-md font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{classroom.academic_course}</p>
                            </CardItem>
                            <CardItem
                              translateZ="30"
                              translateX="5"
                              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                            >
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Year</p>
                              <p className={`text-md font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{classroom.academic_year}</p>
                            </CardItem>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <CardItem
                              translateZ="40"
                              translateY="5"
                              as="button"
                              onClick={() => router.push(`/classrooms/${classroom.id}`)}
                              className="btn btn-success py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center flex-1"
                            >
                              Open Class
                              <BottomGradient />
                            </CardItem>
                            <CardItem
                              translateZ="40"
                              translateY="5"
                              as="button"
                              onClick={() => handleEdit(classroom.id)}
                              className="btn btn-secondary py-2 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center flex-1"
                            >
                              Edit &rarr;
                              <BottomGradient />
                            </CardItem>
                          </div>
                        </div>
                      </CardBody>
                    </CardContainer>
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
}

const BottomGradient = ({ isCreate }) => {
  return (
    <>
      <span
        className={cn(
          "group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
          isCreate
            ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        )}
      />
      <span
        className={cn(
          "group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
          isCreate
            ? "bg-gradient-to-r from-transparent via-green-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        )}
      />
    </>
  );
};