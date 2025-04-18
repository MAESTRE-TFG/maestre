"use client";

import { getApiBaseUrl } from "@/lib/api";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import Alert from "@/components/ui/Alert";
import { IconBooks} from "@tabler/icons-react";
import MaterialCreateModal from "@/components/material-create-modal";
import EditMaterialModal from "@/components/material-edit-modal";
import { useTranslations } from "next-intl";

const MaterialsList = () => {
  const { theme } = useTheme();

  const t = useTranslations("MaterialPage");

  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showNewMaterialModal, setShowNewMaterialModal] = useState(false); 

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setAlerts((prev) => prev.filter((alert) => alert.id !== id)), 5000);
  };

  const handleMaterialCreate = (newMaterial) => {
    setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
    addAlert("success", t("alerts.createdSuccess"));
  };

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

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);

  const toggleMaterialSelection = (materialId) => {
    setSelectedMaterials((prevSelected) =>
      prevSelected.includes(materialId)
        ? prevSelected.filter((id) => id !== materialId)
        : [...prevSelected, materialId]
    );
  };

  const confirmDeleteSelected = () => {
    setShowDeleteSelectedModal(true);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedMaterials.map((materialId) =>
          axios.delete(`${getApiBaseUrl()}/api/materials/${materialId}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          })
        )
      );
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => !selectedMaterials.includes(material.id))
      );
      addAlert("success", t("alerts.deleteSelectedSuccess"));
      setSelectedMaterials([]);
    } catch (error) {
      addAlert("error", t("alerts.deleteSelectedError"));
    } finally {
      setShowDeleteSelectedModal(false);
    }
  };

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
      addAlert("success", t("alerts.editSuccess"));
    } catch (error) {
      addAlert("error", t("alerts.editError"));
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
      addAlert("success", t("alerts.deleteSuccess"));
    } catch (error) {
      addAlert("error", t("alerts.deleteError"));
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

      setMaterials(response.data.map(material => ({
        ...material,
        classroom: material.classroom || null
      })));
    } catch (error) {
      const errorMessage = error.response?.data?.error || t("fetchMaterialsError");
      addAlert("error", errorMessage);
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
      addAlert("error", t("alerts.fetchTagsError"));
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
      addAlert("error", t("alerts.fetchClassroomsError"));
    }
  };

  // Update handleCreateTag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      addAlert("success", t("alerts.tagCreateSuccess"));
    } catch (error) {
      if (error.response?.data?.includes('15 tags')) {
        addAlert("error", t("alerts.tagLimit"));
      } else {
        addAlert("error", t("alerts.tagCreateError"));
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
      addAlert("success", t("alerts.tagUpdateSuccess"));
    } catch (error) {
      addAlert("error", t("alerts.tagUpdateError"));
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
      addAlert("success", t("alerts.tagDeleteSuccess"));
    } catch (error) {
      addAlert("error", t("alerts.tagDeleteError"));
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
    <div className="flex-col justify-center items-center py-8 px-4 sm:px-8 lg:px-8 overflow-auto w-screen min-h-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">

      {/* Alert Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
          />
        ))}
      </div>

      { /* New Material Modal */ }
      <MaterialCreateModal
        showModal={showNewMaterialModal}
        setShowModal={setShowNewMaterialModal}
        onMaterialCreate={handleMaterialCreate}
        isProcessing={false}
      />

      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto text-center mb-12 flex flex-col items-center">

        <div className="w-full max-w-4xl flex flex-col items-center mb-8 space-y-6">
          <IconBooks 
            className={`w-20 h-20 drop-shadow-lg text-primary`}
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

        { /* Add New Material Button */}
        {classrooms.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              className={cn(
          "px-6 py-3 rounded-full font-medium text-white transition-all",
          "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
          "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
          "flex items-center gap-2"
              )}
              onClick={() => setShowNewMaterialModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t("createMaterial")}
            </button>
          </div>
        )}
      </div>


      {/* Main Content */}
      <div className="relative w-full max-w-6xl mx-auto">

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.6 }}></div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-8 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className={cn(
                    "w-full h-14 pl-14 pr-4 rounded-xl outline-none transition duration-300",
                    "text-gray-800 placeholder-gray-500",
                    "border-2 focus:border-blue-500",
                    theme === "dark" 
                      ? "bg-gray-800 border-gray-700 text-white focus:bg-gray-900" 
                      : "bg-white border-gray-200 focus:bg-white shadow-md focus:shadow-lg"
                  )}
                  placeholder={t("searchPlaceholder")}
                />
                <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Filters Section - Tags */}
            <div className="mb-8 flex flex-col items-center">
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium text-lg", theme === "dark" ? "text-white" : "text-gray-800")}>
                    {t("filterByTags")}
                  </span>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      deleteMode 
                        ? "bg-red-500 text-white" 
                        : theme === "dark" 
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    )}
                    title={deleteMode ? t("exitDeleteMode") : t("enterDeleteMode")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center">
                      {deleteMode ? (
                        <div className="flex rounded-full overflow-hidden">
                          <button
                            onClick={() => handleTagSelect(tag)}
                            className={cn(
                              "px-3 py-1 transition-colors font-medium text-white",
                              selectedTags.includes(tag.name) ? "ring-2 ring-offset-1 ring-blue-300" : ""
                            )}
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            title="Delete Tag"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600 dark:text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTagSelect(tag)}
                          className={cn(
                            "px-3 py-1 rounded-full transition-colors font-medium text-white shadow-sm",
                            selectedTags.includes(tag.name) ? "ring-2 ring-offset-1 ring-blue-300" : ""
                          )}
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Classrooms Filter */}
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium text-lg", theme === "dark" ? "text-white" : "text-gray-800")}>
                    {t("filterByClassroom")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classrooms.map(classroom => (
                    <button
                      key={classroom.id}
                      onClick={() => handleClassroomSelect(classroom)}
                      className={cn(
                        "px-3 py-1 rounded-full transition-colors font-medium shadow-sm",
                        selectedClassroom?.id === classroom.id 
                          ? "bg-blue-500 text-white" 
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {classroom.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
                <div 
                  className={cn(
                    "p-6 rounded-xl max-w-md w-full mx-4",
                    theme === "dark" ? "bg-gray-800" : "bg-white",
                    "shadow-xl"
                  )} 
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center mb-4 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <h3 className={cn(
                    "text-xl font-bold mb-2 text-center",
                    theme === "dark" ? "text-white" : "text-gray-800"
                  )}>
                    {t("deleteMaterial")}
                  </h3>
                  
                  <p className={cn(
                    "mb-6 text-center",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}>
                    {t("deleteMaterialConfirmation")} <span className="font-semibold">{fileToDelete?.name}</span>?
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="btn-danger py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            { /* Edit Tags Modal */ }
            {showEditTagsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditTagsModal(false)}>
              <div 
                className={cn(
                "p-6 rounded-xl max-w-md w-full mx-4",
                theme === "dark" ? "bg-gray-800" : "bg-white",
                "shadow-xl"
                )} 
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-center mb-4 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" clipRule="evenodd" />
                </svg>
                </div>
                
                <h3 className={cn(
                "text-xl font-bold mb-2 text-center",
                theme === "dark" ? "text-white" : "text-gray-800"
                )}>
                {t("manageTags")} {editingMaterial?.name}
                </h3>
                
                <div className={cn(
                "mb-6 text-center",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
                )}>
                {t("selectOrCreateTags")}
                </div>
                
                <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
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
                    "px-3 py-1 rounded-full transition-colors font-medium text-white",
                    selectedMaterialTags.includes(tag.id)
                      ? "ring-2 ring-offset-1 ring-blue-300"
                      : "",
                    "shadow-sm"
                    )}
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </button>
                  ))}
                  <button
                  onClick={() => {
                    setCreatingTagFromEdit(true);
                    setShowEditTagsModal(false);
                    setShowTagModal(true);
                    }}
                    className={cn(
                    "px-3 py-1 rounded-full border-2 border-dashed transition-colors flex items-center gap-1",
                    theme === "dark"
                    ? "border-gray-600 text-gray-400 hover:border-gray-500"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                    )}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {t("createTag")}
                    </button>
                  </div>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowEditTagsModal(false)}
                    className="btn-secondary py-2 rounded-full flex items-center justify-center flex-1"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleUpdateMaterialTags}
                    className="btn-primary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                  >
                    {t("saveChanges")}
                  </button>
                  </div>
                  </div>
                  </div>
                )}
                
                  {showTagModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTagModal(false)}>
                    <div 
                    className={cn(
                      "p-6 rounded-xl max-w-md w-full mx-4",
                      theme === "dark" ? "bg-gray-800" : "bg-white",
                      "shadow-xl"
                    )} 
                    onClick={e => e.stopPropagation()}
                    >
                    <div className="flex items-center justify-center mb-4 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className={cn(
                      "text-xl font-bold mb-2 text-center",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      {t("createNewTag")}
                    </h3>
                    
                    <form onSubmit={handleCreateTag}>
                      
                      <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className={cn(
                        "w-full p-2 rounded border mb-4",
                        theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                      )}
                      placeholder="Enter tag name"
                      required
                      onClick={e => e.stopPropagation()}
                      />
                      <div className="mb-4">
                      <label className={cn(
                        "block mb-2 font-medium text-center",
                        theme === "dark" ? "text-white" : "text-gray-800"
                      )}>
                        {t("selectColor")}
                      </label>
                      <div className="grid grid-cols-5 gap-2 justify-center">
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
                      <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                        setShowTagModal(false);
                        if (creatingTagFromEdit) {
                          setShowEditTagsModal(true);
                        }
                        }}
                        className="btn-secondary py-2 rounded-full flex items-center justify-center flex-1"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        disabled={isSubmitting}
                        className="btn-primary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                      >
                        {isSubmitting ? 'Creating...' : t("createTag")}
                      </button>
                      </div>
                    </form>
                    </div>
                  </div>
                  )}

              { /* Edit Material Modal */}
                {showEditModal && (
                  <EditMaterialModal
                  isOpen={showEditModal}
                  onClose={() => setShowEditModal(false)}
                  onConfirm={confirmEdit}
                  newFileName={newFileName}
                  setNewFileName={setNewFileName}
                  theme={theme}
                />
                )}


            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-4">

                {selectedMaterials.length > 0 && (
                  <div className="ml-4">
                    <button
                      onClick={confirmDeleteSelected}
                      className={cn("px-3 py-1 rounded-md text-sm font-medium", theme === "dark" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-700 text-white")}
                    >
                      {t("deleteSelected")} ({selectedMaterials.length})
                    </button>
                  </div>
                )}
              </div>
              {filteredMaterials.length > 0 ? (
                <div className="relative w-full max-w-xl mx-auto">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className={cn(
                        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                        "shadow-sm",
                        theme === "dark" ? "border border-neutral-800" : "border border-gray-200"
                      )}
                    >
                      <div className="flex justify-between w-full items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material.id)}
                            onChange={() => toggleMaterialSelection(material.id)}
                            className="form-checkbox"
                          />
                          <p
                            className="text-base font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer underline"
                            onClick={() => {
                              const fileUrl = material.file.startsWith('http')
                                ? material.file
                                : `${getApiBaseUrl()}${material.file}`;
                              window.open(fileUrl, '_blank');
                            }}>
                            {material.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMaterial(material);
                              setSelectedMaterialTags(material.tags?.map(tag => tag.id) || []);
                              setShowEditTagsModal(true);
                            }}
                            className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                            title="Manage Tags"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(material);
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            title="Edit Name"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="Download File"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(material);
                            }}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            title="Delete Material"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
                  {t("noMaterialsFound")}
                </div>
              )}
            </div>

            {/* Delete Selected Confirmation Modal */}
            {showDeleteSelectedModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={cn(
                  "p-6 rounded-lg w-[32rem]",
                  theme === "dark" ? "bg-neutral-800" : "bg-white"
                )}>
                  <h3 className={cn(
                    "text-xl font-bold mb-4",
                    theme === "dark" ? "text-white" : "text-gray-800"
                  )}>
                    {t("confirmDeletion")}
                  </h3>
                  <p className="mb-6 text-neutral-600 dark:text-neutral-300">
                    {t("deleteSelectedConfirmation")}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDeleteSelectedModal(false)}
                      className="font-bold py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="font-bold py-2 px-4 rounded bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={MaterialsList} />;
}

