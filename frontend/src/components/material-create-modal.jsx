import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";

const MaterialCreateModal = ({ 
  showModal, 
  setShowModal, 
  onMaterialCreate,
  isProcessing
}) => {
  const { theme } = useTheme();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetchClassrooms();
    }
  }, [showModal]);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setClassrooms(response.data);
      if (response.data.length > 0) {
        setSelectedClassroom(response.data[0].id);
      }
    } catch (err) {
      setError("Failed to fetch classrooms");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Set default material name from file name (without extension)
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setMaterialName(fileName);
    }
  };

  // Add drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      // Set default material name from file name (without extension)
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setMaterialName(fileName);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !materialName || !selectedClassroom) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', materialName);
      formData.append('classroom', selectedClassroom);

      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (onMaterialCreate) {
        onMaterialCreate(response.data);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to upload material: " + (err.response?.data?.detail || err.message));
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMaterialName("");
    setError(null);
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={() => {
        setShowModal(false);
        resetForm();
      }}
    >
      <div 
        className={cn(
          "p-6 rounded-xl max-w-2xl w-full mx-4 shadow-xl",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Icon */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center justify-center mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </div>
          <h3
            className={cn(
              "text-xl font-bold text-center",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Create New Material
          </h3>
        </div>
        
        {/* Modal Content */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchClassrooms();
                }}
                className="mt-2 text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              {/* Classroom Selection */}
              <div className="mb-4">
                <label className={cn(
                  "block text-sm font-bold mb-2",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  Select Classroom
                </label>
                {classrooms.length === 0 ? (
                  <p className="text-sm text-red-500">No classrooms available. Please create a classroom first.</p>
                ) : (
                  <select
                    value={selectedClassroom}
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                    className={cn(
                      "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                      theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-700"
                    )}
                    required
                  >
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Material Name */}
              <div className="mb-4">
                <label className={cn(
                  "block text-sm font-bold mb-2",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  Material Name
                </label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="Enter material name"
                  className={cn(
                    "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-700"
                  )}
                  required
                />
              </div>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className={cn(
                  "block text-sm font-bold mb-2",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  Upload File
                </label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-md p-6 text-center min-h-[180px] flex flex-col items-center justify-center",
                    theme === "dark" ? "border-gray-600" : "border-gray-300",
                    selectedFile ? "bg-green-500/10" : "",
                    isDragging ? "border-primary bg-primary/5" : ""
                  )}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {selectedFile.name}
                      </p>
                      <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="mt-3 px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className={`text-lg mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {isDragging ? "Drop your file here" : "Drag and drop your file here"}
                      </p>
                      <p className={`text-base mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        - or -
                      </p>
                      <label className="px-4 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors inline-block">
                        Browse Files
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-3">
                        Supported formats: PDF, DOCX, PPT, TXT
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={isProcessing}
                  className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || isLoading || classrooms.length === 0 || !selectedFile || !materialName}
                  className="btn-success py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>Create Material</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCreateModal;