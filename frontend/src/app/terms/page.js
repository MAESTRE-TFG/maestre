"use client";

import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useTheme } from "@/components/theme-provider";
import { SidebarDemo } from "@/components/sidebar-demo";
import {
  IconFileText,
  IconCookie,
  IconLock,
  IconRefresh,
  IconAlertCircle,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const POLICY_ORDER = {
  cookies: 1,
  terms: 2,
  license: 3,
  privacy: 4,
};

export default function TermsPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const [error, setError] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  // ----------- 2) Local modal error + fade (for errors when creating a term) -----------
  const [modalError, setModalError] = useState(null);
  const [modalFadeOut, setModalFadeOut] = useState(false);

  const [noTermsFound, setNoTermsFound] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTermType, setNewTermType] = useState("");
  const [newTermContent, setNewTermContent] = useState("");
  const [newTermVersion, setNewTermVersion] = useState("");

  const [activeTermId, setActiveTermId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTermContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Function to fetch terms data
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const apiUrl = `${getApiBaseUrl()}/api/terms/`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.length > 0) {
          // Map the data to include icons based on term tag
          const mappedTerms = response.data.map((term) => ({
            ...term,
            icon: getIconForTag(term.tag),
            title: getTermTitle(term.tag),
          }));

          // Sort by the predefined order
          const sortedTerms = mappedTerms.sort((a, b) => {
            return (POLICY_ORDER[a.tag] || 999) - (POLICY_ORDER[b.tag] || 999);
          });

          setTerms(sortedTerms);
          setNoTermsFound(false);
        } else {
          setNoTermsFound(true);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        setError("Failed to load terms. Please try again later.");
        setNoTermsFound(true);

        // Fade out error after 5 seconds
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setError(null);
            setFadeOut(false);
          }, 1000);
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is admin
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/users/check_role/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (
          response.data &&
          (response.data.is_staff ||
            response.data.is_superuser ||
            response.data.is_admin)
        ) {
          setIsAdmin(true);
          setAdminUsername(response.data.username);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // User is not authenticated, clear admin state
          console.warn("User is not authenticated. Admin features disabled.");
          setIsAdmin(false);
          setAdminUsername("");
        } else {
          console.error("Error checking admin status:", error);
        }
      }
    };

    fetchTerms();
    checkAdminStatus();
  }, []);

  // Get icon component based on term tag
  const getIconForTag = (tag) => {
    switch (tag) {
      case "cookies":
        return <IconCookie className="h-4 w-4 text-neutral-500" />;
      case "privacy":
        return <IconLock className="h-4 w-4 text-neutral-500" />;
      case "terms":
        return <IconFileText className="h-4 w-4 text-neutral-500" />;
      case "license":
        return <IconFileText className="h-4 w-4 text-neutral-500" />;
      default:
        return <IconFileText className="h-4 w-4 text-neutral-500" />;
    }
  };

  // Get human-readable title based on term tag
  const getTermTitle = (tag) => {
    switch (tag) {
      case "cookies":
        return "Cookie Policy";
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Use";
      case "license":
        return "Licenses";
      default:
        return "Document";
    }
  };

  // Get available term types that haven't been created yet
  const getAvailableTermTypes = () => {
    const existingTags = terms.map((term) => term.tag);
    const allTypes = [
      { value: "cookies", label: "Cookie Policy" },
      { value: "privacy", label: "Privacy Policy" },
      { value: "terms", label: "Terms of Use" },
      { value: "license", label: "Licenses" },
    ];

    // If admin, show only types that don't exist yet
    return allTypes.filter((type) => !existingTags.includes(type.value));
  };

  // Get static PDF filename based on term tag
  const getStaticPdfFilename = (tag) => {
    switch (tag) {
      case "cookies":
        return "cookie_policy.pdf";
      case "privacy":
        return "privacy_policy.pdf";
      case "terms":
        return "terms_of_use.pdf";
      case "license":
        return "licenses.pdf";
      default:
        return null;
    }
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setTermToDelete(id);
    setShowDeleteModal(true);
  };

  // Add this function to handle the actual deletion
  const confirmDelete = async () => {
    if (!termToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${getApiBaseUrl()}/api/terms/${termToDelete}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
        withCredentials: true,
      });

      // Update local state
      setTerms(terms.filter((term) => term.id !== termToDelete));

      // If no terms left, show no terms found
      if (terms.length <= 1) {
        setNoTermsFound(true);
      }

      // Close the modal
      setShowDeleteModal(false);
      setTermToDelete(null);
    } catch (error) {
      console.error("Error deleting term:", error);
      setError("Failed to delete. Please try again later.");

      // Fade out error after 5 seconds
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setError(null);
          setFadeOut(false);
        }, 1000);
      }, 5000);
    }
  };

  // Handle add term button click
  const handleAddTerm = async () => {
    // Validate form
    if (!newTermType) {
      setModalError("Please select a term type");
      handleModalErrorFade();
      return;
    }

    if (!newTermContent) {
      setModalError("Please upload or enter content");
      handleModalErrorFade();
      return;
    }

    if (!newTermVersion) {
      setModalError("Please enter a version number");
      handleModalErrorFade();
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("tag", newTermType);
      formData.append("version", newTermVersion);
      formData.append("name", getTermTitle(newTermType));

      // Convert content to a Blob for file upload
      const contentBlob = new Blob([newTermContent], { type: "text/markdown" });
      formData.append("content", contentBlob, `${newTermType}.md`);

      // Debugging: Log FormData content
      console.log("FormData being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/api/terms/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Add the new term to local state
      const newTerm = {
        ...response.data,
        icon: getIconForTag(response.data.tag),
        title: getTermTitle(response.data.tag),
      };

      setTerms([...terms, newTerm]);
      setNoTermsFound(false);

      // Reset form and close modal
      setNewTermType("");
      setNewTermContent("");
      setNewTermVersion("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding term:", error);

      let errorMessage = "Failed to add term. Please try again later.";

      // Check for specific error messages from API
      if (error.response && error.response.data) {
        if (error.response.data.tag) {
          errorMessage = `Tag Error: ${error.response.data.tag[0]}`;
        } else if (error.response.data.content) {
          errorMessage = `Content Error: ${error.response.data.content[0]}`;
        } else if (error.response.data.version) {
          errorMessage = `Version Error: ${error.response.data.version[0]}`;
        } else if (error.response.data.name) {
          errorMessage = `Name Error: ${error.response.data.name[0]}`;
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      }

      setModalError(errorMessage);
      handleModalErrorFade();
    }
  };

  // Handle modal error fade
  const handleModalErrorFade = () => {
    setTimeout(() => {
      setModalFadeOut(true);
      setTimeout(() => {
        setModalError(null);
        setModalFadeOut(false);
      }, 1000);
    }, 5000);
  };

  // Fetch and process content from the file URL
  const fetchContent = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching file content:", error);
      return "";
    }
  };

  // -------------------- Main Render --------------------
  return (
    <SidebarDemo
      ContentComponent={() => (
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section */}
          <div className="w-full text-center mb-12">
            <h1
              className={`text-4xl font-bold font-alfa-slab-one mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              MAESTRE - Legal Information
            </h1>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Welcome to our legal information section. Here you'll find all the
              necessary documents and policies that govern the use of our
              platform. Please review them carefully to understand your rights
              and responsibilities.
            </p>
          </div>

          {/* Button to add term if you're Admin */}
          {isAdmin && (
            <div className="mb-10 text-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl flex items-center gap-2 mx-auto hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <IconPlus className="h-5 w-5" />
                Add New Term
              </button>
            </div>
          )}

          {loading ? (
            // -------- Loading skeleton --------
            <div className="container mx-auto py-12">
              <h2 className="text-2xl font-semibold text-center mb-4 text-foreground">
                Loading...
              </h2>
              <BentoGrid className="max-w-6xl mx-auto">
                {[1, 2, 3, 4].map((item) => (
                  <BentoGridItem
                    key={item}
                    title="Loading..."
                    description="Please wait while we load the content."
                    icon={
                      <IconRefresh className="h-4 w-4 text-neutral-500 animate-spin" />
                    }
                    className={item === 3 ? "md:col-span-3" : ""}
                  />
                ))}
              </BentoGrid>
            </div>
          ) : noTermsFound ? (
            // -------- No terms found --------
            <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
              <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                Terms Not Available
              </h2>
              <p className="text-muted-foreground mb-4">
                The terms and conditions could not be loaded at this time. This
                may be because:
              </p>
              <ul className="text-left text-muted-foreground mb-4 pl-8 list-disc">
                <li>The terms are being updated</li>
                <li>You need to log in to access this information</li>
                <li>There is a temporary server issue</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                If you need to access this information, please log in or
                contact our support team.
              </p>
            </div>
          ) : (
            <>
              <BentoGrid className="max-w-6xl mx-auto">
                {terms.map((term, i) => {
                  // Helper to truncate text
                  const truncateByWords = (text, wordLimit) => {
                    const words = text.split(" ");
                    if (words.length <= wordLimit) return text;
                    return words
                      .slice(0, wordLimit)
                      .join(" ")
                      .concat("...");
                  };

                  const termTag = term.tag;
                  const [firstSentence, setFirstSentence] = useState("");

                  useEffect(() => {
                    const processContent = async () => {
                      const content = await fetchContent(term.content);
                      // Truncation logic based on tag
                      let processedContent = content;
                      if (termTag === "terms" || termTag === "license") {
                        processedContent = content.split("## 4. ")[1] || content;
                        setFirstSentence(truncateByWords(processedContent, 45));
                      } else if (termTag === "cookies" || termTag === "privacy") {
                        processedContent = content.split("## 4. ")[1] || content;
                        setFirstSentence(truncateByWords(processedContent, 22));
                      } else {
                        setFirstSentence(truncateByWords(content, 45));
                      }
                    };

                    processContent();
                  }, [term.content, termTag]);

                  return (
                    <BentoGridItem
                      key={i}
                      title={
                        <div className="flex items-center justify-between">
                          <span>{term.title}</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {term.version}
                          </span>
                        </div>
                      }
                      description={
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
                                  onClick={() => handleDelete(term.id)}
                                  className="p-2 bg-[#FF6B6B] text-white rounded-full hover:bg-[#FF5252] transition-colors"
                                >
                                  <IconTrash size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                      icon={term.icon}
                      className={
                        term.title === "Terms of Use"
                          ? "md:col-span-2"
                          : term.title === "Cookie Policy"
                          ? "md:col-span-1"
                          : term.title === "Privacy Policy"
                          ? "md:col-span-1"
                          : term.title === "Licenses"
                          ? "md:col-span-2"
                          : ""
                      }
                    />
                  );
                })}
              </BentoGrid>

              {/* Additional info */}
              <div className="max-w-4xl mx-auto mb-16 prose dark:prose-invert prose-sm text-center space-y-6">
                <br />
                <br />
                <p className="text-gray-600 dark:text-gray-300">
                  These agreements apply to all users who access the FisioFind
                  platform, whether through web browsers or mobile applications.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Maestre reserves the right to modify these agreements based on
                  legislative changes or operational needs.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  This agreement will be governed and interpreted in accordance
                  with Spanish legislation.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Use of the platform implies full acceptance of all conditions
                  set forth herein.
                </p>
                <br />
                <hr className="my-8 border-gray-200 dark:border-gray-700" />
              </div>

              {/* Modal to view full document */}
              {activeTermId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div
                    className={`
                  rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col
                  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}
                `}
                  >
                    {(() => {
                      const activeTerm = terms.find(
                        (term) => term.id === activeTermId
                      );
                      if (!activeTerm) return null;

                      const [content, setContent] = useState("");

                      useEffect(() => {
                        const fetchAndSetContent = async () => {
                          const resolvedContent = await fetchContent(activeTerm.content);
                          setContent(resolvedContent);
                        };
                        fetchAndSetContent();
                      }, [activeTerm.content]);

                      return (
                        <>
                          <div
                            className={`
                          p-4 border-b flex justify-between items-center
                          ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
                        `}
                          >
                            <h3 className="text-lg font-semibold">
                              {activeTerm.title} - {activeTerm.version}
                            </h3>
                            <button
                              onClick={() => setActiveTermId(null)}
                              className={`
                            p-1 rounded-full
                            ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}
                          `}
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
                                {content}
                              </ReactMarkdown>
                            </div>
                          </div>

                          <div
                            className={`
                          p-4 border-t flex justify-end
                          ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
                        `}
                          >
                            <button
                              onClick={() => {
                                const pdfFile = getStaticPdfFilename(
                                  activeTerm.tag || ""
                                );
                                if (!pdfFile) {
                                  alert("No PDF exists for this type of term.");
                                  return;
                                }
                                const pdfUrl = `/pdfs/06_terms/${pdfFile}`;
                                const link = document.createElement("a");
                                link.href = pdfUrl;
                                link.download = pdfFile;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className={`
                            px-4 py-2 rounded-md flex items-center
                            ${theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}
                          `}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
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
                  <div
                    className={`
                  p-6 rounded-lg shadow-lg max-w-2xl w-full relative
                  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}
                `}
                  >
                    {/* Error local del modal */}
                    {modalError && (
                      <div
                        className={`
                      mb-4 text-center border p-4 rounded-md
                      ${theme === "dark" 
                        ? "bg-red-900/30 border-red-800 text-red-400" 
                        : "bg-red-50 border-red-200 text-red-600"}
                      transition-opacity duration-1000 ease-out
                      ${modalFadeOut ? "opacity-0" : "opacity-100"}
                    `}
                      >
                        <p className="font-semibold">{modalError}</p>
                      </div>
                    )}

                    <h2 className="text-xl font-bold mb-4">Add New Term</h2>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Term Type
                      </label>
                      <select
                        value={newTermType}
                        onChange={(e) => setNewTermType(e.target.value)}
                        className={`
                      w-full p-2 border rounded-md
                      ${theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-black"}
                    `}
                      >
                        <option value="">Select a term type</option>
                        {getAvailableTermTypes().map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Content
                      </label>
                      <label
                        htmlFor="file-upload"
                        className={`
                      flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                      ${theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"}
                    `}
                      >
                        <input
                          id="file-upload"
                          type="file"
                          accept=".md"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          className="hidden"
                        />
                        <div className="text-center">
                          <IconFileText className="h-8 w-8 mx-auto" />
                          <p className="mt-2 text-sm font-medium">
                            Drag and drop a .md file here, or click to select
                          </p>
                        </div>
                      </label>

                      {newTermContent && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">
                            Content Preview
                          </label>
                          <textarea
                            value={newTermContent}
                            onChange={(e) => setNewTermContent(e.target.value)}
                            className={`
                          w-full p-2 border rounded-md h-64 text-sm font-mono
                          ${theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-black"}
                        `}
                            placeholder="Content will appear here after file upload, or you can type directly"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Version
                      </label>
                      <input
                        type="text"
                        className={`
                      w-full p-2 border rounded-md
                      ${theme === "dark" 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-black"}
                    `}
                        placeholder='E.g. "v1.0"'
                        value={newTermVersion}
                        onChange={(e) => setNewTermVersion(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className={`
                      px-6 py-2 font-medium rounded-xl flex items-center gap-2
                      ${theme === "dark" 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                    `}
                      >
                        <IconX className="h-5 w-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTerm}
                        className={`
                      px-6 py-2 font-medium rounded-xl flex items-center gap-2
                      ${theme === "dark" 
                        ? "bg-[#05AC9C] text-white hover:bg-[#048F83]" 
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"}
                    `}
                      >
                        <IconCheck className="h-5 w-5" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                  If you have any questions about our terms or cannot access
                  them, please contact us.
                </p>
              </div>
            </>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className={`
                p-6 rounded-lg shadow-lg max-w-md w-full
                ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}
              `}
              >
                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                <p
                  className={`
                  mb-6
                  ${theme === "dark" ? "text-gray-300" : "text-gray-600"}
                `}
                >
                  Are you sure you want to delete this document? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setTermToDelete(null);
                    }}
                    className={`
                      px-4 py-2 rounded-md
                      ${theme === "dark" 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className={`
                      px-4 py-2 rounded-md
                      ${theme === "dark" 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "bg-red-500 text-white hover:bg-red-600"}
                    `}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}
