"use client";

import { getApiBaseUrl } from "@/lib/api";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link'; // Add this import

const MaterialsList = () => {
  const { theme } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const TAG_COLORS = [
    { name: 'Purple', value: '#A350C4' },
    { name: 'Orange', value: '#E58914' },
    { name: 'Coral', value: '#FA5C2B' },
    { name: 'Teal', value: '#44AF9E' },
    { name: 'Green', value: '#118E6C' },
    { name: 'Blue', value: '#4777DA' },
    { name: 'Light Blue', value: '#8ABAEA' },
    { name: 'Black', value: '#000000' },
    { name: 'Grey', value: '#808080' }
  ];

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMaterialTags, setSelectedMaterialTags] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showEditTagsModal, setShowEditTagsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [creatingTagFromEdit, setCreatingTagFromEdit] = useState(false);

  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [newTagName, setNewTagName] = useState('');

  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (material) => {
    setFileToEdit(material);
    setNewFileName(material.name);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    try {
      // Get the original file extension if it exists
      const originalName = fileToEdit.name;
      const hasExtension = originalName.includes('.');
      let updatedFileName = newFileName;

      if (hasExtension) {
        const originalExtension = originalName.split('.').pop();
        // Make sure the new name has the same extension
        if (!newFileName.endsWith(`.${originalExtension}`)) {
          // If user removed or changed extension, restore it
          const nameWithoutExtension = newFileName.split('.')[0];
          updatedFileName = `${nameWithoutExtension}.${originalExtension}`;
        }
      }

      const response = await axios.patch(
        `${getApiBaseUrl()}/api/materials/${fileToEdit.id}/`,
        { name: updatedFileName },
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem("authToken")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the material in the materials state
      setMaterials(prevMaterials =>
        prevMaterials.map(m => m.id === fileToEdit.id ? { ...m, name: updatedFileName } : m)
      );
    } catch (error) {
      setError('Failed to update material name. Please try again.');
      console.error('Error updating material name:', error);
    } finally {
      setShowEditModal(false);
      setFileToEdit(null);
    }
  };

  // Add these functions to handle deleting material
  const handleDelete = (material) => {
    setFileToDelete(material);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/materials/${fileToDelete.id}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }
      });

      // Remove the deleted material from the materials state
      setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== fileToDelete.id));
    } catch (error) {
      setError('Failed to delete material. Please try again.');
      console.error('Error deleting material:', error);
    } finally {
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const handleClassroomSelect = (classroom) => {
    setSelectedClassroom(prev => prev?.id === classroom.id ? null : classroom);
  };

  // Update fetchMaterials function
  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedTags.length > 0) {
        // Change from sending tag names to sending tag_names parameter
        params.tag_names = selectedTags.join(',');
      }
      if (selectedClassroom) {
        params.classroom_id = selectedClassroom.id;
      }
      const response = await axios.get(`${getApiBaseUrl()}/api/materials/`, {
        params,
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });
      // Log the request and response for debugging
      console.log('Request params:', params);
      console.log('Response data:', response.data);
      
      setMaterials(response.data.map(material => ({
        ...material,
        classroom: material.classroom || null
      })));
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch materials. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTags, selectedClassroom]);

  useEffect(() => {
    setIsClient(true);
    fetchMaterials();
    fetchTags();
    fetchClassrooms();
  }, [selectedTags, selectedClassroom, fetchMaterials]);

  // Update fetchTags function
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/tags/user_tags/`, {
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

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Failed to fetch classrooms. Please try again later.');
    }
  };

  // Update handleCreateTag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${getApiBaseUrl()}/api/tags/`, {
        name: newTagName,
        color: selectedColor
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchTags();

      // If creating from edit modal, add the new tag to the material
      if (creatingTagFromEdit && editingMaterial) {
        const newTagId = response.data.id;
        setSelectedMaterialTags(prev => [...prev, newTagId]);
        setShowTagModal(false);
        setShowEditTagsModal(true);
      } else {
        setShowTagModal(false);
      }

      setNewTagName('');
      setSelectedColor(TAG_COLORS[0].value);
    } catch (error) {
      if (error.response?.data?.includes('15 tags')) {
        setError('You have reached the maximum limit of 15 tags.');
      } else {
        setError('Error creating tag. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setCreatingTagFromEdit(false);
    }
  };


  const handleTagSelect = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag.name)
        ? prev.filter(name => name !== tag.name)
        : [...prev, tag.name]
    );
  };

  const handleUpdateMaterialTags = async () => {
    try {
      const response = await axios.patch(
        `${getApiBaseUrl()}/api/materials/${editingMaterial.id}/`,
        {
          tag_ids: selectedMaterialTags  // Changed from tags to tag_ids to match serializer
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the materials list with the updated material
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.id === editingMaterial.id
            ? response.data
            : material
        )
      );

      setShowEditTagsModal(false);
    } catch (error) {
      console.error('Error updating material tags:', error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/tags/${tagId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });

      // Remove the tag from selected tags if it was selected
      const deletedTag = tags.find(tag => tag.id === tagId);
      if (deletedTag && selectedTags.includes(deletedTag.name)) {
        setSelectedTags(prev => prev.filter(name => name !== deletedTag.name));
      }

      // Refresh tags list and materials to update UI
      await Promise.all([
        fetchTags(),
        fetchMaterials()
      ]);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the return JSX to handle loading and error states
  if (!isClient) return null;

  return (
    <div className="relative flex flex-col justify-center items-center py-8 sm:px-8 lg:px-8 overflow-auto">

      {/* Header Section */}
      <div className="w-full text-center mb-12">
        <br></br>
        <h1 className={`text-4xl font-bold font-alfa-slab-one mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          My Materials
        </h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          See all your uploaded materials at a glace.
        </p>
      </div>

      {/* Background Images */}
      {theme === "dark" ? (
        <img
          src="/static/bubbles black/5.svg"
          alt="Bubble"
          className="absolute top-100 left-10 w-1/2 opacity-50 z-0"
        />
      ) : (
        <img
          src="/static/bubbles white/5.svg"
          alt="Bubble"
          className="absolute top-100 left-10 w-1/2 opacity-50 z-0"
        />
      )}

      {/* Main Content */}
      {/* <div className="relative xl:mx-auto xl:w-full xl:max-w-6xl"> */}
      <div className="relative xl:mx-auto xl:w-full xl:max-w-6xl h-[calc(100vh)] overflow-y-auto">
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

            {/* Classroom Filter Section */}
            <div className="flex flex-wrap gap-2 items-center mb-6">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-800")}>
                  Filter by Classroom:
                </span>
              </div>
              {classrooms.map(classroom => (
                <button
                  key={classroom.id}
                  onClick={() => handleClassroomSelect(classroom)}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors font-bold",
                    selectedClassroom?.id === classroom.id ? "ring-2 ring-offset-2 ring-blue-500" : ""
                  )}
                  style={{ backgroundColor: selectedClassroom?.id === classroom.id ? '#4777DA' : '#E5E7EB' }}
                >
                  {classroom.name}
                </button>
              ))}
            </div>
              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
                  <div className={cn(
                    "p-6 rounded-lg w-[32rem]",
                    theme === "dark" ? "bg-neutral-800" : "bg-white"
                  )} onClick={e => e.stopPropagation()}>
                    <h3 className={cn(
                      "text-xl font-bold mb-4",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      Delete Material
                    </h3>
                    <p className="mb-6 text-neutral-600 dark:text-neutral-300">
                      Are you sure you want to delete `{fileToDelete?.name}`?
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="font-bold py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="font-bold py-2 px-4 rounded bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Tags Modal */}
              {showEditTagsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditTagsModal(false)}>
                  <div className={cn(
                    "p-6 rounded-lg w-[32rem]",
                    theme === "dark" ? "bg-neutral-800" : "bg-white"
                  )} onClick={e => e.stopPropagation()}>
                    <h3 className={cn(
                      "text-xl font-bold mb-4",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      Manage Tags for {editingMaterial?.name}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => {
                              const newSelectedTags = selectedMaterialTags.includes(tag.id)
                                ? selectedMaterialTags.filter(id => id !== tag.id)
                                : [...selectedMaterialTags, tag.id];

                              setSelectedMaterialTags(newSelectedTags);
                            }}
                            className={cn(
                              "px-3 py-1 rounded-full transition-colors font-bold",
                              selectedMaterialTags.includes(tag.id)
                                ? "ring-2 ring-offset-2 ring-blue-500"
                                : ""
                            )}
                            style={{ backgroundColor: tag.color }}
                          >
                            <span className="text-white">{tag.name}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setCreatingTagFromEdit(true);
                            setShowEditTagsModal(false);
                            setShowTagModal(true);
                          }}
                          className={cn(
                            "px-3 py-1 rounded-full border-2 border-dashed transition-colors",
                            theme === "dark"
                              ? "border-neutral-600 text-neutral-400 hover:border-neutral-500"
                              : "border-gray-300 text-gray-600 hover:border-gray-400"
                          )}
                        >
                          + Create New Tag
                        </button>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowEditTagsModal(false)}
                          className={cn(
                            "px-4 py-2 rounded",
                            theme === "dark"
                              ? "bg-neutral-700 text-white hover:bg-neutral-600"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          )}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateMaterialTags}
                          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Tag Modal */}
              {showTagModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTagModal(false)}>
                  <div className={cn(
                    "p-6 rounded-lg w-96",
                    theme === "dark" ? "bg-neutral-800" : "bg-white"
                  )} onClick={e => e.stopPropagation()}>
                    <h3 className={cn(
                      "text-xl font-bold mb-4",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      Create New Tag
                    </h3>
                    <form onSubmit={handleCreateTag}>
                      {error && (
                        <div className="mb-4 p-2 rounded bg-red-100 text-red-600 text-sm">
                          {error}
                        </div>
                      )}
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className={cn(
                          "w-full p-2 rounded border mb-4",
                          theme === "dark"
                            ? "bg-neutral-700 border-neutral-600 text-white"
                            : "bg-white border-gray-300 text-gray-800"
                        )}
                        placeholder="Enter tag name"
                        required
                        onClick={e => e.stopPropagation()}
                      />
                      <div className="mb-4">
                        <label className={cn(
                          "block mb-2 font-medium",
                          theme === "dark" ? "text-white" : "text-gray-800"
                        )}>
                          Select Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {TAG_COLORS.map(color => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setSelectedColor(color.value)}
                              className={cn(
                                "w-8 h-8 rounded-full transition-all duration-200",
                                selectedColor === color.value
                                  ? "border-4 border-blue-500 shadow-lg scale-110"
                                  : "border-2 border-transparent hover:scale-105"
                              )}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowTagModal(false);
                            if (creatingTagFromEdit) {
                              setShowEditTagsModal(true);
                            }
                          }}
                          className={cn(
                            "px-4 py-2 rounded",
                            theme === "dark"
                              ? "bg-neutral-700 text-white hover:bg-neutral-600"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          )}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                        >
                          {isSubmitting ? 'Creating...' : 'Create Tag'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Name Modal */}
              {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                  <div className={cn(
                    "p-6 rounded-lg w-[32rem]",
                    theme === "dark" ? "bg-neutral-800" : "bg-white"
                  )} onClick={e => e.stopPropagation()}>
                    <h3 className={cn(
                      "text-xl font-bold mb-4",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      Edit Material Name
                    </h3>
                    <p className="mb-4 text-neutral-600 dark:text-neutral-300">
                      Enter a new name for the material:
                    </p>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="w-full p-2 mb-6 border rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="font-bold py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmEdit}
                        className="font-bold py-2 px-4 rounded bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="group mb-6 relative max-w-2xl">
                <svg className="icon absolute left-4 top-1/2 transform -translate-y-1/2 fill-current text-gray-500" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="input w-full h-12 pl-12 pr-4 border-2 border-blue-400 rounded-lg outline-none bg-gray-200 text-gray-800 transition duration-300 ease-in-out focus:border-blue-400 focus:bg-white focus:shadow-lg"
                  placeholder="Search materials..."
                />
              </div>

            <div className="w-full mt-6">
              {filteredMaterials.length > 0 ? (
                <div className="relative w-full max-w-xl mx-auto">
                  {filteredMaterials.map((material, idx) => (
                    <div
                      key={material.id}
                      className={cn(
                        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                        "shadow-sm",
                        theme === "dark" ? "border border-neutral-800" : "border border-gray-200"
                      )}
                    >
                      <div className="flex justify-between w-full items-center gap-4">
                        <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                          {material.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMaterial(material);
                              setSelectedMaterialTags(material.tags?.map(tag => tag.id) || []);
                              setShowEditTagsModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Manage Tags"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 dark:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(material);
                            }}
                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Edit Name"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {material.file && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileUrl = material.file.startsWith('http')
                                  ? material.file
                                  : `${getApiBaseUrl()}${material.file}`;
                                window.open(fileUrl, '_blank');
                              }}
                              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title="Download File"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(material);
                            }}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                            title="Delete Material"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                        <div className="flex flex-wrap gap-1 mt-1 md:mt-0">
                          {material.tags?.map(tag => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 text-xs rounded-full font-bold text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {material.classroom?.name && (
                            <span className="px-2 py-0.5 text-xs rounded-full font-bold text-white bg-gray-500">
                              {material.classroom.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  No materials found. Add material to one of your <Link href="/classrooms" className="text-blue-500 hover:underline">classrooms</Link> and come back later ;)
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={MaterialsList} />;
}

