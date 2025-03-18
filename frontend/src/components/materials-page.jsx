"use client";
import { useState, useEffect } from 'react';
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { FileUploadDemo } from '@/components/file-upload-demo';

export function MaterialsPage({ classroomId }) {
  const { theme } = useTheme();
  const [error, setError] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [showTagModal, setShowTagModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [newTagName, setNewTagName] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);  // Add a refreshTrigger state to force re-fetching


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

  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);

  // Add this state to track if we're creating a tag from the edit modal
  const [creatingTagFromEdit, setCreatingTagFromEdit] = useState(false);

  // Add these functions to handle editing material name
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
        `http://localhost:8000/api/materials/${fileToEdit.id}/`,
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

  const handleDelete = (material) => {
    setFileToDelete(material);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/materials/${fileToDelete.id}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
        }
      });

      // Remove the deleted material from the materials state
      setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== fileToDelete.id));
      // Refresh materials list
      refreshMaterials();
    } catch (error) {
      setError('Failed to delete material. Please try again.');
      console.error('Error deleting material:', error);
    } finally {
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const refreshMaterials = () => {
    console.log("Refreshing materials...");
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    console.log("Effect triggered, refreshTrigger:", refreshTrigger);
    fetchMaterials();
    fetchTags();
  }, [classroomId, selectedTags, refreshTrigger]);

  const fetchMaterials = async () => {
    try {
      const params = {
        classroom_id: classroomId
      };

      if (selectedTags.length > 0) {
        const response = await axios.get('http://localhost:8000/api/tags/filtered_documents/', {
          params: {
            tags: selectedTags,
            classroom_id: classroomId
          },
          paramsSerializer: {
            indexes: null // This will serialize arrays as tags=value1&tags=value2
          },
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          }
        });
        setMaterials(response.data);
      } else {
        const response = await axios.get('http://localhost:8000/api/materials/', {
          params,
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          }
        });
        setMaterials(response.data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

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
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/tags/', {
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


  const [showEditTagsModal, setShowEditTagsModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [selectedMaterialTags, setSelectedMaterialTags] = useState([]);

  const handleUpdateMaterialTags = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/materials/${editingMaterial.id}/`,
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
      await axios.delete(`http://localhost:8000/api/tags/${tagId}/`, {
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

  return (
    <div className="space-y-6">

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
      {/* Materials List - Dynamic Grid Layout */}
            <div className="w-full mt-6">
              {materials.length > 0 ? (
                <div className={cn(
                  "grid gap-4 max-w-7xl mx-auto",
                  // On small screens: always 1 column
                  "grid-cols-1",
                  // On large screens (min-width: 1024px): dynamic columns based on material count
                  materials.length >= 2 && "lg:grid-cols-2",
                  materials.length >= 3 && "lg:grid-cols-3",
                  materials.length >= 4 && "lg:grid-cols-4",
                  materials.length >= 5 && "lg:grid-cols-5"
                )}>
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className={cn(
                        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-between p-4 rounded-md",
                        "shadow-sm hover:shadow-md transition-shadow duration-200",
                        theme === "dark" ? "border border-neutral-800" : "border border-gray-200"
                      )}
                    >
                      <div className="w-full">
                        <div className="flex justify-between w-full items-start mb-3">
                          <p className="text-base font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[80%]">
                            {material.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingMaterial(material);
                                setSelectedMaterialTags(material.tags?.map(tag => tag.id) || []);
                                setShowEditTagsModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
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
                              className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
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
                                    : `http://localhost:8000${material.file}`;
                                  window.open(fileUrl, '_blank');
                                }}
                                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
                              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              title="Delete Material"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {material.classroom?.name && (
                          <p className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-xs inline-block mb-2">
                            {material.classroom.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2 w-full">
                        {material.tags?.map(tag => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 text-xs rounded-full font-bold text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  No materials found. {selectedTags.length > 0 ? "Try removing some tag filters." : ""}
                </div>
              )}
            </div>
      {/* File Upload Section */}
      <FileUploadDemo classroomId={classroomId} onUploadComplete={refreshMaterials} />

    </div>
  );
}
