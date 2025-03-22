"use client";

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconFileText,
  IconCookie,
  IconLock,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { SidebarDemo } from "@/components/sidebar-demo";

export default function TermsPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noTermsFound, setNoTermsFound] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTermType, setNewTermType] = useState("");
  const [newTermContent, setNewTermContent] = useState("");
  const [activeTermId, setActiveTermId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log("No token found, user not authenticated");
          return;
        }
        
        const response = await axios.get("http://localhost:8000/api/app_user/check-role/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.user_role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    if (typeof window !== 'undefined') {
      checkUserRole();
    }
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        // First try to fetch with authentication if token exists
        if (token) {
          try {
            // Updated to use direct URL instead of getApiBaseUrl
            const response = await axios.get("http://localhost:8000/api/terms/", {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              timeout: 5000
            });
            
            if (response.data && response.data.length > 0) {
              processTermsData(response.data);
              return;
            }
          } catch (authErr) {
            console.log("Authenticated request failed:", authErr.response?.status);
            // If we get a 401, the token might be expired or invalid
            if (authErr.response?.status === 401) {
              console.log("Authentication token may be expired");
            }
          }
        }
        
        try {
          // Updated to use direct URL instead of getApiBaseUrl
          const publicResponse = await axios.get("http://localhost:8000/api/terms/", {
            timeout: 5000,
          });
          
          if (publicResponse.data && publicResponse.data.length > 0) {
            processTermsData(publicResponse.data);
            return;
          }
        } catch (publicErr) {
          console.log("Public request also failed");
          setNoTermsFound(true);
        }
        
        // If we get here, we couldn't load the terms
        setNoTermsFound(true);
      } catch (err) {
        console.error("Error fetching terms:", err);
        setNoTermsFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    const processTermsData = (data) => {
      const termsOfUse = data.find(term => term.tag === 'terms');
      const cookiePolicy = data.find(term => term.tag === 'cookies');
      const privacyPolicy = data.find(term => term.tag === 'privacy');
      const license = data.find(term => term.tag === 'license');
      
      setTerms([
        {
          id: termsOfUse?.id || 1,
          title: "Términos de Uso",
          content: termsOfUse?.content || "El contenido de los términos de uso se mostrará aquí.",
          version: termsOfUse?.version || "v1.0",
          icon: <IconFileText className="h-6 w-6 text-green-600" />,
          tag: 'terms',
        },
        {
          id: cookiePolicy?.id || 2,
          title: "Política de Cookies",
          content: cookiePolicy?.content || "El contenido de la política de cookies se mostrará aquí.",
          version: cookiePolicy?.version || "v1.0",
          icon: <IconCookie className="h-6 w-6 text-amber-600" />,
          tag: 'cookies',
        },
        {
          id: privacyPolicy?.id || 3,
          title: "Política de Privacidad",
          content: privacyPolicy?.content || "El contenido de la política de privacidad se mostrará aquí.",
          version: privacyPolicy?.version || "v1.0",
          icon: <IconLock className="h-6 w-6 text-blue-600" />,
          tag: 'privacy',
        },
        {
          id: license?.id || 4,
          title: "Licencias",
          content: license?.content || "El contenido de las licencias a las que se acoge la aplicación se mostrará aquí.",
          version: license?.version || "v1.0",
          icon: <IconFileText className="h-6 w-6 text-purple-600" />,
          tag: 'license',
        },
      ]);
    };

    fetchTerms();
  }, []);

  const handleEdit = (id, content, version) => {
    setEditMode(id);
    setEditContent(content);
    setEditVersion(version);
  };

  const handleSave = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const currentTerm = terms.find(term => term.id === id);
      let tag = 'terms';
      
      if (currentTerm) {
        if (currentTerm.title === "Política de Cookies") {
          tag = 'cookies';
        } else if (currentTerm.title === "Política de Privacidad") {
          tag = 'privacy';
        } else if (currentTerm.title === "Licencias") {
          tag = 'license';
        }
      }
      
      const formData = new FormData();
      formData.append('version', editVersion);
      formData.append('tag', tag);
      formData.append('name', currentTerm?.title || 'Terms Document');
      
      const contentBlob = new Blob([editContent], { type: 'text/markdown' });
      const contentFile = new File([contentBlob], `${tag}_${editVersion}.md`, { type: 'text/markdown' });
      formData.append('content', contentFile);
      
      await axios.patch(
        `http://localhost:8000/api/terms/${id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Update local state
      setTerms(terms.map(term => 
        term.id === id 
          ? {...term, content: editContent, version: editVersion, tag: tag } 
          : term
      ));
      
      setEditMode(null);
      setLoading(false);
    } catch (err) {
      console.error("Error updating term:", err);
      setError("Error al actualizar el término. Por favor, inténtelo de nuevo.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Está seguro de que desea eliminar este término?")) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Updated to use direct URL instead of getApiBaseUrl
      await axios.delete(`http://localhost:8000/api/terms/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setTerms(terms.filter(term => term.id !== id));
      setLoading(false);
    } catch (err) {
      console.error("Error deleting term:", err);
      setError("Error al eliminar el término. Por favor, inténtelo de nuevo.");
      setLoading(false);
    }
  };

  const handleAddTerm = async () => {
    if (!newTermType || !newTermContent) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      let version = "v1.0";
      let title = "";
      let icon = <IconFileText className="h-6 w-6 text-green-600" />;
      let tag = newTermType;
      
      if (newTermType === "terms") {
        title = "Términos de Uso";
        icon = <IconFileText className="h-6 w-6 text-green-600" />;
      } else if (newTermType === "cookies") {
        title = "Política de Cookies";
        icon = <IconCookie className="h-6 w-6 text-amber-600" />;
      } else if (newTermType === "privacy") {
        title = "Política de Privacidad";
        icon = <IconLock className="h-6 w-6 text-blue-600" />;
      } else if (newTermType === "license") {
        title = "Licencias";
        icon = <IconFileText className="h-6 w-6 text-purple-600" />;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', title);
      formData.append('version', version);
      formData.append('tag', tag);
      
      // Create a file from the content
      const contentBlob = new Blob([newTermContent], { type: 'text/markdown' });
      const contentFile = new File([contentBlob], `${tag}_${version}.md`, { type: 'text/markdown' });
      formData.append('content', contentFile);
      
      // Updated to use direct URL instead of getApiBaseUrl
      const response = await axios.post(
        "http://localhost:8000/api/terms/",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const newTerm = {
        id: response.data.id,
        title: title,
        content: newTermContent,
        version: version,
        icon: icon,
        tag: tag
      };
      
      setTerms([...terms, newTerm]);
      setShowAddForm(false);
      setNewTermType("");
      setNewTermContent("");
      setLoading(false);
    } catch (err) {
      console.error("Error adding term:", err);
      setError("Error al añadir el término. Por favor, inténtelo de nuevo.");
      setLoading(false);
    }
  };

  const TermSkeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse"></div>
  );

  // Modified render method to show content in the description
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">MAESTRE - LEGAL INFORMATION</h1>
        <BentoGrid className="max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((item) => (
            <BentoGridItem
              key={item}
              header={<TermSkeleton />}
              title="Loading..."
              description="Please wait while we load the content."
              icon={<IconRefresh className="h-4 w-4 text-neutral-500 animate-spin" />}
              className={item === 3 ? "md:col-span-3" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (noTermsFound) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">MAESTRE - LEGAL INFORMATION</h1>
        <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
          <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Terms Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The terms and conditions could not be loaded at this time. This may be because:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-300 mb-4 pl-8 list-disc">
            <li>The terms are being updated</li>
            <li>You need to log in to access this information</li>
            <li>There is a temporary server issue</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you need to access this information, please log in or contact our support team.
          </p>
          
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Admin Panel</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add New Term
              </button>
            </div>
          )}
        </div>
        
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Add New Term</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Term Type</label>
                <select 
                  value={newTermType}
                  onChange={(e) => setNewTermType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a type</option>
                  <option value="terms">Terms of Use</option>
                  <option value="cookies">Cookie Policy</option>
                  <option value="privacy">Privacy Policy</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newTermContent}
                  onChange={(e) => setNewTermContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md h-64"
                  placeholder="Enter the HTML content of the term..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <SidebarDemo ContentComponent={() => (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-12">MAESTRE - LEGAL INFORMATION</h1>
            
      {isAdmin && (
        <div className="mb-10 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center shadow-sm"
          >
            <IconPlus className="mr-2" size={16} />
            Add New Term
          </button>
        </div>
      )}
      
      <BentoGrid className="max-w-6xl mx-auto">
        {terms.map((term, i) => {
          let firstSentence;
          const termTag = term.tag;
          
          const truncateByWords = (text, wordLimit) => {
            const words = text.split(' ');
            if (words.length <= wordLimit) return text;
            return words.slice(0, wordLimit).join(' ').concat('...');
          };

          if (termTag === 'terms' || termTag === 'license') {
            const content = term.content.split('## 4. ')[1] || term.content;
            firstSentence = truncateByWords(content, 45);
          } else if (termTag === 'cookies' || termTag === 'privacy') {
            const content = term.content.split('## 4. ')[1] || term.content;
            firstSentence = truncateByWords(content, 30);
          } else {
            firstSentence = truncateByWords(term.content, 45);
          }
          
          // Translate the titles
          const translatedTitle = term.title === "Términos de Uso" ? "Terms of Use" :
                                 term.title === "Política de Cookies" ? "Cookie Policy" :
                                 term.title === "Política de Privacidad" ? "Privacy Policy" :
                                 term.title === "Licencias" ? "Licenses" : term.title;
          
          return (
            <BentoGridItem
              key={i}
              title={
                <div className="flex items-center justify-between">
                  <span>{translatedTitle}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {term.version}
                  </span>
                </div>
              }
              
              description={
                editMode === term.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md h-64 text-sm font-mono"
                      placeholder="Write content in Markdown format..."
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditMode(null)}
                        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        <IconX size={16} />
                      </button>
                      <button
                        onClick={() => handleSave(term.id)}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <IconCheck size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div className="prose dark:prose-invert prose-sm">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {firstSentence}
                      </ReactMarkdown>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => setActiveTermId(term.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        View full document
                      </button>
                      
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(term.id, term.content, term.version)}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(term.id)}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
              icon={term.icon}
              className={
                term.title === "Términos de Uso" 
                  ? "md:col-span-2" 
                  : term.title === "Política de Cookies"
                    ? "md:col-span-1"
                    : term.title === "Política de Privacidad"
                      ? "md:col-span-1"
                      : term.title === "Licencias"
                        ? "md:col-span-2"
                        : ""
              }
            />
          );
        })}
      </BentoGrid>

      <div className="max-w-4xl mx-auto mb-16 prose dark:prose-invert prose-sm text-center space-y-6">

        <br></br>
        <br></br>
        <p className="text-gray-600 dark:text-gray-300">
          These agreements apply to all users who access the Maestre platform, whether through web browsers or mobile applications.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Maestre reserves the right to modify these agreements based on legislative changes or operational needs.
        </p>
        <p>
          This agreement will be governed and interpreted in accordance with Spanish legislation.
        </p>
        <p>
          The use of the platform implies full acceptance of all conditions set forth herein.
        </p>
        <br></br>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />
      </div>
      
      {/* Modal for displaying full content - moved outside the map function */}
      {activeTermId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {(() => {
              const activeTerm = terms.find(term => term.id === activeTermId);
              if (!activeTerm) return null;
              
              // Translate the title
              const translatedTitle = activeTerm.title === "Términos de Uso" ? "Terms of Use" :
                                     activeTerm.title === "Política de Cookies" ? "Cookie Policy" :
                                     activeTerm.title === "Política de Privacidad" ? "Privacy Policy" :
                                     activeTerm.title === "Licencias" ? "Licenses" : activeTerm.title;
              
              return (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{translatedTitle} - {activeTerm.version}</h3>
                    <button 
                      onClick={() => setActiveTermId(null)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {activeTerm.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                      onClick={() => {
                        const blob = new Blob([activeTerm.content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${translatedTitle.toLowerCase().replace(/\s+/g, '-')}-${activeTerm.version}.md`;
                        document.body.appendChild(a);
                        a.click();
                        
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download document
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Add New Term</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Term Type</label>
              <select 
                value={newTermType}
                onChange={(e) => setNewTermType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a type</option>
                <option value="terms">Terms of Use</option>
                <option value="cookies">Cookie Policy</option>
                <option value="privacy">Privacy Policy</option>
                <option value="license">Licenses</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={newTermContent}
                onChange={(e) => setNewTermContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-64"
                placeholder="Enter the HTML content of the term..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTerm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>If you have any questions about our terms or cannot access them, please contact us.</p>
      </div>
    </div>
      )} />
    );

}