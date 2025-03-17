"use client";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { useState, useEffect } from 'react';

const MaterialsList = () => {
  const { theme } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showEditTagsModal, setShowEditTagsModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [selectedMaterialTags, setSelectedMaterialTags] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchMaterials();
    fetchTags();
  }, [selectedTags]);

  // Add new state for loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update fetchMaterials function
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedTags.length > 0) {
        const response = await axios.get('http://localhost:8000/api/tags/filtered_documents_user/', {
          params: {
            tags: selectedTags.join(',') // Convert array to comma-separated string
          },
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          }
        });
        setMaterials(response.data);
      } else {
        const response = await axios.get('http://localhost:8000/api/materials/', {
          params: {
            all: true // Add a flag to get all materials
          },
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          }
        });
        setMaterials(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch materials. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update fetchTags function
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tags/user_tags/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to fetch tags. Please try again later.');
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag.name) 
        ? prev.filter(name => name !== tag.name)
        : [...prev, tag.name]
    );
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tags/${tagId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      // Remove the deleted tag from selected tags if it was selected
      const deletedTag = tags.find(tag => tag.id === tagId);
      if (deletedTag && selectedTags.includes(deletedTag.name)) {
        setSelectedTags(prev => prev.filter(name => name !== deletedTag.name));
      }
      
      // Refresh tags and materials
      await Promise.all([fetchTags(), fetchMaterials()]);
    } catch (error) {
      setError('Failed to delete tag. Please try again later.');
      console.error('Error deleting tag:', error);
    }
  };

  // Update the return JSX to handle loading and error states
  if (!isClient) return null;

  return (
    <div className="relative flex flex-col justify-center items-center py-8 sm:px-8 lg:px-8 overflow-auto">
      {/* Floating Title */}
      <div className="fixed top-0 left-0 w-full z-10 bg-inherit backdrop-blur-md">
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
          <div className="h-12"></div>
          <div className="flex justify-center items-center sticky top-0 bg-inherit px-4">
            <h1 className={cn(
              "text-3xl font-extrabold",
              theme === "dark" ? "text-white" : "text-dark"
            )}>
              My Materials
            </h1>
          </div>
        </div>
      </div>

      {/* Background Images */}
      {theme === "dark" ? (
        <img
          src="/static/bubbles black/5.svg"
          alt="Bubble"
          className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
        />
      ) : (
        <img
          src="/static/bubbles white/5.svg"
          alt="Bubble"
          className="absolute top-0 left-0 w-1/2 opacity-50 z-0"
        />
      )}

      <div className="relative my-8" style={{ height: "250px" }}></div>

      {/* Main Content */}
      <div className="relative xl:mx-auto xl:w-full xl:max-w-6xl">
        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <>
            {/* Tags Filter Section */}
            <div className="flex flex-wrap gap-2 items-center mb-6">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-800")}>
                  Filter by Tags:
                </span>
                <button
                  onClick={() => setDeleteMode(!deleteMode)}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    deleteMode 
                      ? "bg-red-500 text-white" 
                      : theme === "dark" 
                        ? "bg-neutral-700 text-neutral-300" 
                        : "bg-gray-200 text-gray-600"
                  )}
                  title={deleteMode ? "Exit Delete Mode" : "Enter Delete Mode"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center">
                  {deleteMode ? (
                    <>
                      <button
                        onClick={() => handleTagSelect(tag)}
                        className={cn(
                          "px-3 py-1 rounded-l-full transition-colors font-bold text-white",
                          selectedTags.includes(tag.name) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                        )}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className={cn(
                          "p-1 rounded-r-full transition-colors bg-red-500 hover:bg-red-600",
                          selectedTags.includes(tag.name) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                        )}
                        style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}
                        title="Delete Tag"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleTagSelect(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full transition-colors font-bold text-white",
                        selectedTags.includes(tag.name) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      )}
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map(material => (
                <div key={material.id} className={cn(
                  "p-4 rounded-lg border",
                  theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"
                )}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={cn(
                        "font-bold mb-1",
                        theme === "dark" ? "text-white" : "text-gray-800"
                      )}>
                        {material.name}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        theme === "dark" ? "text-neutral-400" : "text-gray-600"
                      )}>
                        {material.classroom?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMaterial(material);
                          setSelectedMaterialTags(material.tags?.map(tag => tag.id) || []);
                          setShowEditTagsModal(true);
                        }}
                        className={cn(
                          "p-2 rounded-full hover:bg-opacity-80",
                          theme === "dark" ? "hover:bg-neutral-700" : "hover:bg-gray-200"
                        )}
                        title="Manage Tags"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                          "h-5 w-5",
                          theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                        )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {material.tags?.map(tag => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 text-sm rounded-full font-bold text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="my-8"></div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={MaterialsList} />;
}