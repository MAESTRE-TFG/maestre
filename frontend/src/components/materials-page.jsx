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
            tags: selectedTags.map(tag => tag.name),
            classroom_id: classroomId
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

  const handleCreateTag = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setNewTagName('');
      setSelectedColor(TAG_COLORS[0].value);
      setShowTagModal(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSelect = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tags Filter Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-800")}>
          Filter by Tags:
        </span>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagSelect(tag.id)}
            className={cn(
              "px-3 py-1 rounded-full transition-colors font-bold",
              selectedTags.includes(tag.id)
                ? "text-white"
                : theme === "dark"
                ? "text-white hover:opacity-80"
                : "text-white hover:opacity-80"
            )}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </button>
        ))}
        <button
          onClick={() => setShowTagModal(true)}
          className={cn(
            "px-3 py-1 rounded-full border-2 border-dashed",
            theme === "dark"
              ? "border-neutral-600 text-neutral-400 hover:border-neutral-500"
              : "border-gray-300 text-gray-600 hover:border-gray-400"
          )}
        >
          + Add Tag
        </button>
      </div>

      {/* File Upload Section */}
      <FileUploadDemo classroomId={classroomId} onUploadComplete={fetchMaterials} />

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map(material => (
          <div
            key={material.id}
            className={cn(
              "p-4 rounded-lg border",
              theme === "dark"
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border-gray-200"
            )}
          >
            <h3 className={cn(
              "font-bold mb-2",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}>
              {material.name}
            </h3>
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
    </div>
  );
}