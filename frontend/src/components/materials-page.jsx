"use client";
import { useState, useEffect } from 'react';
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { FileUploadDemo } from '@/components/file-upload-demo';

export function MaterialsPage({ classroomId }) {
  const { theme } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchTags();
  }, [classroomId, selectedTags]);

  const fetchMaterials = async () => {
    try {
      const params = {
        classroom_id: classroomId
      };
      
      if (selectedTags.length > 0) {
        const response = await axios.get('http://localhost:8000/api/tags/filtered_documents/', {
          params: {
            tags: selectedTags,  // Django will handle this as a list automatically
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
  
  // Update handleCreateTag to handle material association
  // Add error state
  const [error, setError] = useState(null);
  
  // Update handleCreateTag
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
      <div className="flex flex-wrap gap-2 items-center">
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
                  : "bg-gray-200 text-gray-600",
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
                  selectedTags.includes(tag.name)
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
              )}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </button>
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className={cn(
                "p-1 rounded-r-full transition-colors",
                "bg-red-500 hover:bg-red-600",
                selectedTags.includes(tag.name)
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
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
              selectedTags.includes(tag.name)
                ? "ring-2 ring-offset-2 ring-blue-500"
                : ""
            )}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </button>
        )}
      </div>
    ))}
    </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map(material => (
          <div key={material.id} className={cn(
            "p-4 rounded-lg border",
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-gray-200"
          )}>
            <div className="flex justify-between items-center">
              <h3 className={cn(
                "font-bold mb-2",
                theme === "dark" ? "text-white" : "text-gray-800"
              )}>
                {material.name}
              </h3>
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
      
      {/* Add the Edit Tags Modal */}
      {showEditTagsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={cn(
            "p-6 rounded-lg w-[32rem]",
            theme === "dark" ? "bg-neutral-800" : "bg-white"
          )}>
            <h3 className={cn(
              "text-xl font-bold mb-4",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}>
              Manage Tags for {editingMaterial.name}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={cn(
            "p-6 rounded-lg w-96",
            theme === "dark" ? "bg-neutral-800" : "bg-white"
          )}>
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
                  onClick={() => setShowTagModal(false)}
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
            {/* File Upload Section */}
            <FileUploadDemo classroomId={classroomId} onUploadComplete={fetchMaterials} />

    </div>
  );
}