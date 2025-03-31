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
  IconEdit,
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

  // ----------- 1) Global error + fade (for editing, deleting, fetch, etc.) -----------
  const [error, setError] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  // ----------- 2) Local modal error + fade (for errors when creating a term) -----------
  const [modalError, setModalError] = useState(null);
  const [modalFadeOut, setModalFadeOut] = useState(false);

  const [noTermsFound, setNoTermsFound] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editVersion, setEditVersion] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTermType, setNewTermType] = useState("");
  const [newTermContent, setNewTermContent] = useState("");
  const [newTermVersion, setNewTermVersion] = useState("");

  const [activeTermId, setActiveTermId] = useState(null);

  // -------------------- useEffect: Fade out for global error --------------------
  useEffect(() => {
    if (error) {
      setFadeOut(false);
      const timerFade = setTimeout(() => setFadeOut(true), 3000);
      const timerClear = setTimeout(() => setError(null), 4000);
      return () => {
        clearTimeout(timerFade);
        clearTimeout(timerClear);
      };
    }
  }, [error]);

  // -------------------- useEffect: Fade out for modal specific error --------------------
  useEffect(() => {
    if (modalError) {
      setModalFadeOut(false); // Reset fade
      const timerFade = setTimeout(() => setModalFadeOut(true), 3000);
      const timerClear = setTimeout(() => setModalError(null), 4000);
      return () => {
        clearTimeout(timerFade);
        clearTimeout(timerClear);
      };
    }
  }, [modalError]);
  // First useEffect for admin role check
  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        console.log("No token or user found, setting admin to false");
        setIsAdmin(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(user);
        console.log("User data:", parsedUser);
        if (parsedUser && parsedUser.is_staff === true) {
          console.log("User is admin based on stored user data");
          setIsAdmin(true);
          setAdminUsername(parsedUser.username || parsedUser.email || "Admin User");
          return;
        }
      } catch (parseErr) {
        console.log("Could not parse user data:", parseErr);
      }

      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/users/check_role/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.is_admin) {
          console.log("User is admin based on API response");
          setIsAdmin(true);
          setAdminUsername(response.data.user_role === "admin" ? "Admin User" : "User");
        } else {
          console.log("User is not admin based on API response");
          setIsAdmin(false);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.error("Unauthorized: Token may be invalid or expired");
          localStorage.removeItem("authToken"); // Clear invalid token
        }
        console.error("Error checking user role via API:", err);
        setIsAdmin(false);
      }
    };

    if (typeof window !== "undefined") {
      checkUserRole();
    }
  }, []);

  // Add this useEffect right after the admin role check useEffect
  useEffect(() => {
    const openCookiesPolicy = () => {
      const cookiesTerm = terms.find(term => term.tag === "cookies");
      if (cookiesTerm) {
        setActiveTermId(cookiesTerm.id);
      }
    };

    if (typeof window !== 'undefined') {
      const shouldOpenCookies = localStorage.getItem('open-cookies-policy');
      if (shouldOpenCookies && terms.length > 0) {
        openCookiesPolicy();
        localStorage.removeItem('open-cookies-policy');
      }
    }
  }, [terms]); // This will run whenever terms are loaded

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            // Correct API endpoint
            const response = await axios.get(
              `${getApiBaseUrl()}/api/terms/`, // Ensure this matches the backend configuration
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
                validateStatus: function (status) {
                  return status >= 200 && status < 500;
                },
              }
            );
            if (response.data && response.data.length > 0) {
              processTermsData(response.data);
              return;
            }
          } catch (authErr) {
            console.error(
              "Authenticated request failed:",
              authErr.response?.status || authErr.message
            );
            if (authErr.response?.status === 401) {
              console.warn("Authentication token may be expired. Clearing token.");
              localStorage.removeItem("authToken"); // Clear invalid token
            }
          }
        } else {
          console.warn("No token found. Proceeding with public request.");
        }

        try {
          const publicResponse = await axios.get(
            `${getApiBaseUrl()}/api/terms/`, // Adjusted to match the correct endpoint
            { timeout: 5000 }
          );
          if (publicResponse.data && publicResponse.data.length > 0) {
            processTermsData(publicResponse.data);
            return;
          }
        } catch (publicErr) {
          console.error("Public request failed:", publicErr.message);
          setNoTermsFound(true);
        }

        setNoTermsFound(true);
      } catch (err) {
        console.error("Error fetching terms:", err.message);
        setNoTermsFound(true);
      } finally {
        setLoading(false);
      }
    };

    const processTermsData = (data) => {
      const existingTerms = [];

      const termsMap = {
        terms: data.find((term) => term.tag === "terms"),
        cookies: data.find((term) => term.tag === "cookies"),
        privacy: data.find((term) => term.tag === "privacy"),
        license: data.find((term) => term.tag === "license"),
      };

      Object.entries(termsMap).forEach(([tag, term]) => {
        if (term) {
          let title = "";
          let icon = null;

          switch (tag) {
            case "cookies":
              title = "Cookie Policy";
              icon = <IconCookie className="h-6 w-6 text-amber-600" />;
              break;
            case "terms":
              title = "Terms of Use";
              icon = <IconFileText className="h-6 w-6 text-green-600" />;
              break;
            case "license":
              title = "Licenses";
              icon = <IconFileText className="h-6 w-6 text-purple-600" />;
              break;
            case "privacy":
              title = "Privacy Policy";
              icon = <IconLock className="h-6 w-6 text-blue-600" />;
              break;
          }

          existingTerms.push({
            id: term.id,
            title,
            content: term.content,
            version: term.version,
            icon,
            tag,
          });
        }
      });

      existingTerms.sort((a, b) => {
        const orderA = POLICY_ORDER[a.tag] || 999;
        const orderB = POLICY_ORDER[b.tag] || 999;
        return orderA - orderB;
      });

      setTerms(existingTerms);
    };

    fetchTerms();
  }, []);

  // -------------------- Handling term editing (uses global error) --------------------
  const handleEdit = (id, content, version) => {
    setEditMode(id);
    setEditContent(content);
    setEditVersion(version);
  };

  const handleSave = async (id) => {
    if (!editContent.trim()) {
      setError("Content cannot be empty. Please enter the term content.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, cannot save changes.");
        setLoading(false);
        return;
      }

      const currentTerm = terms.find((term) => term.id === id);
      let tag = "terms";
      if (currentTerm) {
        tag = currentTerm.tag;
      }

      // Update to match the serializer fields
      const response = await axios.put(
        `${getApiBaseUrl()}/api/terms/${id}/`,
        {
          content: editContent,
          version: editVersion,
          tag: tag,
          name: currentTerm.title // Add name field which is required by the serializer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        }
      );

      // Update the local state with the response data
      setTerms((prev) =>
        prev.map((term) =>
          term.id === id
            ? { 
                ...term, 
                content: editContent, 
                version: editVersion
              }
            : term
        )
      );

      setEditMode(null);
      setLoading(false);
    } catch (err) {
      console.error("Error updating term:", err.response?.data || err);
      setError(err.response?.data?.detail || "Error updating the term. Please try again.");
      setLoading(false);
    }
  };

  // Delete term (uses global error)
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, cannot delete term.");
        setLoading(false);
        return;
      }

      await axios.delete(`${getApiBaseUrl()}/api/terms/${id}/`, {  // Changed from /api/terms/delete/${id}/
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTerms = terms.filter((term) => term.id !== id);
      setTerms(updatedTerms);

      // If we delete everything and no terms remain, show the "no terms" view
      if (updatedTerms.length === 0) {
        setNoTermsFound(true);
      }
    } catch (err) {
      console.error("Error deleting term:", err.response?.data || err);
      setError("Error deleting the term. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Handling adding new term (uses modal error) --------------------
  const getAvailableTermTypes = () => {
    const allTypes = [
      { value: "terms", label: "Terms of Use" },
      { value: "cookies", label: "Cookie Policy" },
      { value: "privacy", label: "Privacy Policy" },
      { value: "license", label: "Licenses" },
    ];
    const existingTypes = terms.map((term) => term.tag);

    // Allow only one for each type that already exists
    return allTypes.filter((type) => !existingTypes.includes(type.value));
  };

  const handleAddTerm = async () => {
    if (!newTermType || !newTermContent) {
      setModalError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, cannot add new term.");
        setLoading(false);
        return;
      }

      const versionToUse = newTermVersion.trim() || "v1.0";

      let title = "";
      switch (newTermType) {
        case "terms":
          title = "Terms of Use";
          break;
        case "cookies":
          title = "Cookie Policy";
          break;
        case "privacy":
          title = "Privacy Policy";
          break;
        case "license":
          title = "Licenses";
          break;
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/api/terms/`,
        {
          content: newTermContent,
          version: versionToUse,
          tag: newTermType,
          name: title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let icon = null;
      switch (newTermType) {
        case "terms":
          icon = <IconFileText className="h-6 w-6 text-green-600" />;
          break;
        case "cookies":
          icon = <IconCookie className="h-6 w-6 text-amber-600" />;
          break;
        case "privacy":
          icon = <IconLock className="h-6 w-6 text-blue-600" />;
          break;
        case "license":
          icon = <IconFileText className="h-6 w-6 text-purple-600" />;
          break;
      }

      const newTerm = {
        id: response.data.id,
        title,
        content: newTermContent,
        version: versionToUse,
        icon,
        tag: newTermType,
      };

      setTerms((prev) => {
        const updated = [...prev, newTerm];
        updated.sort((a, b) => {
          const orderA = POLICY_ORDER[a.tag] || 999;
          const orderB = POLICY_ORDER[b.tag] || 999;
          return orderA - orderB;
        });
        return updated;
      });

      setNoTermsFound(false);
      setShowAddForm(false);
      setNewTermType("");
      setNewTermContent("");
      setNewTermVersion("");
      setLoading(false);
    } catch (err) {
      console.error("Error adding term:", err.response?.data || err.message || err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.tag?.[0] ||
        "An unexpected error occurred while adding the term. Please try again.";
      setModalError(errorMessage);
      setLoading(false);
    }
  };

  // -------------------- Skeleton --------------------
  const TermSkeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse" />
  );


  function getStaticPdfFilename(tag) {
    switch (tag) {
      case "cookies":
        return "1_cookies.pdf";
      case "terms":
        return "2_terms.pdf";
      case "privacy":
        return "3_privacy.pdf";
      case "license":
        return "4_license.pdf";
      default:
        return "";
    }
  }

  // -------------------- Main Render --------------------
  return (
    <SidebarDemo ContentComponent={() => 
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
        
      {/* Header Section */}
      <div className="w-full text-center mb-12">
        <h1 className={`text-4xl font-bold font-alfa-slab-one mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          MAESTRE - Legal Information
        </h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Welcome to our legal information section. Here you'll find all the necessary documents and policies that govern the use of our platform. Please review them carefully to understand your rights and responsibilities.
        </p>
      </div>

        {/* --------- GLOBAL ERROR (only for editing/deleting/fetch) --------- */}
        {error && (
          <div
            className={`
              mb-8 text-center bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-md 
              transition-opacity duration-1000 ease-out 
              ${fadeOut ? "opacity-0" : "opacity-100"}
            `}
          >
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {loading ? (
          // -------- Loading skeleton --------
          <div className="container mx-auto py-12">
            <h2 className="text-2xl font-semibold text-center mb-4 text-foreground">Loading...</h2>
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
        ) : noTermsFound ? (
          // -------- No terms found --------
          <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
            <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">Terms Not Available</h2>
            <p className="text-muted-foreground mb-4">
              The terms and conditions could not be loaded at this time. This may be because:
            </p>
            <ul className="text-left text-muted-foreground mb-4 pl-8 list-disc">
              <li>The terms are being updated</li>
              <li>You need to log in to access this information</li>
              <li>There is a temporary server issue</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              If you need to access this information, please log in or contact our support team.
            </p>

            {isAdmin && (
              <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Admin Panel
                </h3>
                <button
                  onClick={() => setShowAddForm(true)}
                  className={`
                    px-6 py-2 font-medium rounded-xl flex items-center gap-2 mx-auto transition-colors
                    ${theme === 'dark' 
                      ? 'bg-[#05AC9C] text-white hover:bg-[#048F83]' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                  `}
                >
                  <IconPlus className="h-5 w-5" />
                  Add New Term
                </button>
              </div>
            )}

            {/* ------------- MODAL: ADD NEW TERM when there are none ------------- */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                  className={`
                    p-6 rounded-lg shadow-lg max-w-2xl w-full relative
                    ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                  `}
                >
                  {/* Local modal error */}
                  {modalError && (
                    <div
                      className={`
                        mb-4 text-center border p-4 rounded-md
                        ${theme === 'dark' 
                          ? 'bg-red-900/30 border-red-800 text-red-400' 
                          : 'bg-red-50 border-red-200 text-red-600'}
                        transition-opacity duration-1000 ease-out
                        ${modalFadeOut ? "opacity-0" : "opacity-100"}
                      `}
                    >
                      <p className="font-semibold">{modalError}</p>
                    </div>
                  )}

                  <h2 className="text-xl font-bold mb-4">Add New Term</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Term Type</label>
                    <select
                      value={newTermType}
                      onChange={(e) => setNewTermType(e.target.value)}
                      className={`
                        w-full p-2 border rounded-md
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-black'}
                      `}
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
                    <label
                      htmlFor="file-upload"
                      className={`
                        flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'}
                      `}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept=".md"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewTermContent(event.target.result);
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className="hidden"
                      />
                      <div className="text-center">
                        <IconFileText className="h-8 w-8 mx-auto" />
                        <p className="mt-2 text-sm font-medium">
                          Drag and drop a .md file here, or click to select
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Version</label>
                    <input
                      type="text"
                      className={`
                        w-full p-2 border rounded-md
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-black'}
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
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      `}
                    >
                      <IconX className="h-5 w-5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTerm}
                      className={`
                        px-6 py-2 font-medium rounded-xl flex items-center gap-2
                        ${theme === 'dark' 
                          ? 'bg-[#05AC9C] text-white hover:bg-[#048F83]' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                      `}
                    >
                      <IconCheck className="h-5 w-5" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      ) : (
        // -------- Terms exist (normal view) --------
        <>
          {/* Button to add term if you're Admin and there are available types */}
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

          <BentoGrid className="max-w-6xl mx-auto">
            {terms.map((term, i) => {
              // Helper to truncate text
              const truncateByWords = (text, wordLimit) => {
                const words = text.split(" ");
                if (words.length <= wordLimit) return text;
                return words.slice(0, wordLimit).join(" ").concat("...");
              };

              const termTag = term.tag;
              let firstSentence = "";

              // Truncation logic based on tag
              if (termTag === "terms" || termTag === "license") {
                const content = term.content.split("## 4. ")[1] || term.content;
                firstSentence = truncateByWords(content, 45);
              } else if (termTag === "cookies" || termTag === "privacy") {
                const content = term.content.split("## 4. ")[1] || term.content;
                firstSentence = truncateByWords(content, 30);
              } else {
                firstSentence = truncateByWords(term.content, 45);
              }

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
                    editMode === term.id ? (
                      // -------- Edit mode (inline) --------
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md h-64 text-sm font-mono"
                          placeholder="Write content in Markdown format..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditMode(null)}
                            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <IconX size={16} />
                          </button>
                          <button
                            onClick={() => handleSave(term.id)}
                            className="p-2 bg-[#05AC9C] text-white rounded-full hover:bg-[#048F83] transition-colors"
                          >
                            <IconCheck size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // -------- View mode --------
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
                          onClick={() =>
                          handleEdit(term.id, term.content, term.version)
                          }
                          className="p-2 bg-[#05AC9C] text-white rounded-full hover:bg-[#048F83] transition-colors"
                          >
                          <IconEdit size={16} />
                          </button>
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
                    )
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
              These agreements apply to all users who access the FisioFind platform, 
              whether through web browsers or mobile applications.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Maestre reserves the right to modify these agreements based on 
              legislative changes or operational needs.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This agreement will be governed and interpreted in accordance with Spanish legislation.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Use of the platform implies full acceptance of all conditions set forth herein.
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
                  ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                `}
              >
                {(() => {
                  const activeTerm = terms.find((term) => term.id === activeTermId);
                  if (!activeTerm) return null;

                  return (
                    <>
                      <div
                        className={`
                          p-4 border-b flex justify-between items-center
                          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                        `}
                      >
                        <h3 className="text-lg font-semibold">
                          {activeTerm.title} - {activeTerm.version}
                        </h3>
                        <button
                          onClick={() => setActiveTermId(null)}
                          className={`
                            p-1 rounded-full
                            ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
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
                            {activeTerm.content}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div
                        className={`
                          p-4 border-t flex justify-end
                          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                        `}
                      >
                        <button
                          onClick={() => {
                            const pdfFile = getStaticPdfFilename(activeTerm.tag || "");
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
                            ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
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
                  ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
                `}
              >
                {/* Error local del modal */}
                {modalError && (
                  <div
                    className={`
                      mb-4 text-center border p-4 rounded-md
                      ${theme === 'dark' 
                        ? 'bg-red-900/30 border-red-800 text-red-400' 
                        : 'bg-red-50 border-red-200 text-red-600'}
                      transition-opacity duration-1000 ease-out
                      ${modalFadeOut ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    <p className="font-semibold">{modalError}</p>
                  </div>
                )}

                <h2 className="text-xl font-bold mb-4">Add new term</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Term Type</label>
                  <select
                    value={newTermType}
                    onChange={(e) => setNewTermType(e.target.value)}
                    className={`
                      w-full p-2 border rounded-md
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'}
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
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <label
                    htmlFor="file-upload"
                    className={`
                      flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'}
                    `}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".md"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setNewTermContent(event.target.result);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="text-center">
                      <IconFileText className="h-8 w-8 mx-auto" />
                      <p className="mt-2 text-sm font-medium">
                        Drag and drop a .md file here, or click to select
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Version</label>
                  <input
                    type="text"
                    className={`
                      w-full p-2 border rounded-md
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'}
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
                      ${theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                  >
                    <IconX className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTerm}
                    className={`
                      px-6 py-2 font-medium rounded-xl flex items-center gap-2
                      ${theme === 'dark' 
                        ? 'bg-[#05AC9C] text-white hover:bg-[#048F83]' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
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
              If you have any questions about our terms or cannot access them, please
              contact us.
            </p>
          </div>
        </>
      )}
    </div>
    } />
  );
}
