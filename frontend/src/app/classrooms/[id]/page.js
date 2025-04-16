'use client'

import { useEffect, useState } from 'react'
import { getApiBaseUrl } from "@/lib/api";
import { SidebarDemo } from "@/components/sidebar-demo";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useParams } from 'next/navigation';
import Alert from "@/components/ui/Alert";
const axios = require('axios');
import { MaterialsPage } from "@/components/materials-page";
import { useRouter } from "next/navigation";

const NAME_LIMIT = 30;
const SURNAME_LIMIT = 30;

const ClassroomPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('classroomActiveTab') || 'students';
    }
    return 'students';
  });
  
  useEffect(() => {
    localStorage.setItem('classroomActiveTab', activeTab);
  }, [activeTab]);

  const { theme } = useTheme();
  const params = useParams();
  const [classroom, setClassroom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]); // Ensure students is initialized as an array
  const [editMode, setEditMode] = useState(false);
  const [student, setStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const fetchClassroom = async () => {
      try {        
        const response = await axios.get(`${getApiBaseUrl()}/api/classrooms/${params.id}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setClassroom(response.data);
      } catch (err) {
        showAlert('error', "Failed to fetch classroom");
      }
    };
    fetchClassroom();
  }, [params.id]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!params.id) return;
      
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/students/`, {
          params: {
            classroom_id: params.id
          },
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setStudents(response.data);
      } catch (err) {
        showAlert('error', "Failed to fetch students");
      }
    };
    
    fetchStudents();
  }, [params.id]);

  const handleDelete = async (student) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/students/${student.id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        }
      });
      setStudents(prevStudents => prevStudents.filter(s => s.id !== student.id));
      showAlert('success', "Student deleted successfully");
    } catch (error) {
      showAlert('error', "Error deleting student");
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await axios.delete(`${getApiBaseUrl()}/api/students/${studentToDelete.id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        }
      });
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentToDelete.id));
      showAlert('success', "Student deleted successfully");
    } catch (error) {
      showAlert('error', "Error deleting student");
    } finally {
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const handleEdit = async (e) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`${getApiBaseUrl()}/api/students/${student.id}/`, {
        name: studentName,
        surname: studentSurname,
        classroom: params.id
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json'
        }
      });

      setShowModal(false);
      setStudentName('');
      setStudentSurname('');
      setEditMode(false);
      setStudents(prevStudents => {
        const updatedStudents = prevStudents.map(s => 
          s.id === student.id ? { ...s, name: studentName, surname: studentSurname } : s
        );
        return updatedStudents;
      });
      showAlert('success', "Student updated successfully");
    } catch (error) {
      showAlert('error', "Failed to edit student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${getApiBaseUrl()}/api/students/`, {
        name: studentName,
        surname: studentSurname,
        classroom_id: params.id
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json'
        }
      });

      setStudents(prevStudents => [...prevStudents, response.data]);
      setShowModal(false);
      setStudentName('');
      setStudentSurname('');
      showAlert('success', "Student added successfully");
    } catch (error) {
      showAlert('error', "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value) => {
    setStudentName(value);
    if (value.length > NAME_LIMIT) {
      showAlert('warning', `Name exceeds the limit of ${NAME_LIMIT} characters.`);
    }
  };

  const handleSurnameChange = (value) => {
    setStudentSurname(value);
    if (value.length > SURNAME_LIMIT) {
      showAlert('warning', `Surname exceeds the limit of ${SURNAME_LIMIT} characters.`);
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedStudents.map((studentId) =>
          axios.delete(`${getApiBaseUrl()}/api/students/${studentId}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          })
        )
      );
      setStudents((prevStudents) =>
        prevStudents.filter((student) => !selectedStudents.includes(student.id))
      );
      showAlert('success', "Selected students deleted successfully");
      setSelectedStudents([]);
    } catch (error) {
      showAlert('error', "Error deleting selected students");
    }
  };

  const confirmDeleteSelected = () => {
    setShowDeleteSelectedModal(true);
  };

  const handleConfirmDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedStudents.map((studentId) =>
          axios.delete(`${getApiBaseUrl()}/api/students/${studentId}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          })
        )
      );
      setStudents((prevStudents) =>
        prevStudents.filter((student) => !selectedStudents.includes(student.id))
      );
      showAlert('success', "Selected students deleted successfully");
      setSelectedStudents([]);
    } catch (error) {
      showAlert('error', "Error deleting selected students");
    } finally {
      setShowDeleteSelectedModal(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500/10 to-purple-500/5">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="w-full z-10 bg-inherit backdrop-blur-md">
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
        <div className="h-12"></div>
        <div className="flex px-6 z-900 relative">
          {/* Back to Classrooms Button */}
          <button
            onClick={() => router.push("/classrooms")}
            className="btn btn-md btn-secondary absolute left-4 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3"
          >
            &larr; Back to Classrooms
          </button>

          {/* Classroom Title and Details */}
          <div className="flex justify-center w-full">
            {classroom ? (
              <div className="flex flex-col items-center space-y-2 max-w-2xl">
                  <span
                    className={cn(
                      "text-lg font-medium",
                      theme === "dark" ? "text-blue-300" : "text-[rgb(25,65,166)]"
                    )}
                  >
                    {classroom.academic_year}
                  </span>
                  <h1
                    className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-4xl"
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    {classroom.name || "Unnamed Classroom"}
                  </h1>
                  <span
                    className={cn(
                      "text-lg font-medium mt-1",
                      theme === "dark" ? "text-blue-300" : "text-[rgb(25,65,166)]"
                    )}
                  >
                    {classroom.academic_course}
                  </span>
                <p
                  className={cn(
                    "text-base text-center",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {classroom.description}
                </p>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-pulse h-8 w-48 bg-gray-300 rounded"></div>
                </div>
              )}
            </div>
          </div>
            
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
          `}</style>
        </div>
      </div>
  
      { /* Navigation tabs */ }
        <div className="flex justify-center mb-8 mt-8">
          <div className={cn("inline-flex rounded-full p-1 shadow-md", 
            theme === "dark" ? "bg-gray-800" : "bg-gray-100")}>
            <button
          className={cn("px-8 py-3 transition-colors rounded-full font-medium",
            activeTab === 'students'
              ? theme === "dark"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-[rgb(25,65,166)] text-white shadow-md"
              : theme === "dark"
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
          )}
          onClick={() => setActiveTab('students')}
            >
          Students
            </button>
            <button
          className={cn("px-8 py-3 transition-colors rounded-full font-medium",
            activeTab === 'materials'
              ? theme === "dark"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-[rgb(25,65,166)] text-white shadow-md"
              : theme === "dark"
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
          )}
          onClick={() => setActiveTab('materials')}
            >
          Materials
            </button>
          </div>
        </div>
        
        {/* Content sections */}
      <div className="min-h-screen max-w-5xl mx-auto w-auto px-4">
        {activeTab === 'students' ? (
          <div className={cn("rounded-xl shadow-lg p-6 border", 
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-2xl font-bold", 
                theme === "dark" ? "text-white" : "text-gray-800")} 
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Students
              </h2>
              {selectedStudents.length > 0 && (
                <div className="ml-4">
                  <button
                    onClick={confirmDeleteSelected}
                    className="btn btn-md btn-danger"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete ({selectedStudents.length})
                  </button>
                </div>
              )}
            </div>
            <div className="grid gap-4">
              {/* Student list */}
              {Array.isArray(students) && students.length > 0 ? (
                students
                  .sort((a, b) => {
                    // First sort by name
                    const nameComparison = a.name.localeCompare(b.name);
                    // If names are the same, sort by surname
                    return nameComparison !== 0 ? nameComparison : a.surname.localeCompare(b.surname);
                  })
                  .map((student) => (
                    <div
                      key={student.id}
                      className={cn(
                        "p-4 rounded-xl border flex items-center justify-between transition-all hover:shadow-md",
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-100"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className={cn(
                            "form-checkbox h-5 w-5 rounded transition-colors", 
                            theme === "dark" 
                              ? "text-[rgb(25,65,166)] border-gray-500" 
                              : "text-[rgb(25,65,166)] border-gray-300"
                          )}
                        />
                        <div className={cn(
                          "text-lg font-medium",
                          theme === "dark" ? "text-white" : "text-gray-800"
                        )}>
                          {student.name} {student.surname || ''}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setStudentName(student.name);
                            setStudentSurname(student.surname);
                            setShowModal(true);
                            setEditMode(true);
                            setStudent(student);
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            theme === "dark" 
                              ? "hover:bg-gray-600 text-blue-400" 
                              : "hover:bg-gray-200 text-[rgb(25,65,166)]"
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(student)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            theme === "dark" 
                              ? "hover:bg-gray-600 text-red-400" 
                              : "hover:bg-gray-200 text-red-500"
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div
                  className={cn(
                    "p-8 rounded-xl border flex flex-col items-center justify-center",
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-300"
                      : "bg-gray-50 border-gray-100 text-gray-700"
                  )}
                  style={{ height: "200px" }}
                >
                  <p className="text-lg font-semibold mb-4">
                    No students found in this classroom.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-md btn-accent"
                    >
                    Add your first student
                  </button>
                </div>
              )}
            </div>
            {students.length > 0 && (
              <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-md btn-accent"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Student
              </button>
              </div>
            )}

            { /* Student Modal */ }
            {showModal && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setShowModal(false)}
              >
                <div
                  className={cn(
                    "p-6 rounded-xl max-w-md w-full mx-4",
                    theme === "dark" ? "bg-gray-800" : "bg-white",
                    "shadow-xl"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center mb-4 text-[rgb(25,65,166)]">
                  {editMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "text-xl font-bold mb-4 text-center",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {editMode ? "Edit Student" : "Add New Student"}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editMode) {
                        handleEdit(e);
                      } else {
                        handleSubmit(e);
                      }
                    }}
                    >
                    <div className="mb-4">
                      <label
                      className={cn(
                        "block text-sm font-bold mb-2",
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      )}
                      >
                      Name
                      </label>
                      <input
                      type="text"
                      value={studentName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={cn(
                        "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                        theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                      )}
                      required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                      className={cn(
                        "block text-sm font-bold mb-2",
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      )}
                      >
                      Surname
                      </label>
                      <input
                      type="text"
                      value={studentSurname}
                      onChange={(e) => handleSurnameChange(e.target.value)}
                      className={cn(
                        "shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                        theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                      )}
                      required
                      />
                    </div>
                    <div className="flex justify-center gap-3">
                      <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditMode(false);
                      }}
                      className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                      >
                      Cancel
                      </button>
                      <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-success py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                      >
                      {isSubmitting
                        ? "Processing..."
                        : editMode
                        ? "Save Changes"
                        : "Add Student"}
                      </button>
                    </div>
                    </form>
                  </div>
                  </div>
                )}

                {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setShowDeleteModal(false)}
              >
                <div
                  className={cn(
                    "p-6 rounded-xl max-w-md w-full mx-4",
                    theme === "dark" ? "bg-gray-800" : "bg-white",
                    "shadow-xl"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center mb-4 text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <h3
                    className={cn(
                      "text-xl font-bold mb-2 text-center",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}
                  >
                    Confirm Deletion
                  </h3>

                  <p
                    className={cn(
                      "mb-6 text-center",
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {studentToDelete?.name} {studentToDelete?.surname}
                    </span>
                    ?
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="btn-danger py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal for Selected Students */}
            {showDeleteSelectedModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={cn("p-6 rounded-xl w-96 shadow-lg border", 
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                  <h3 className={cn("text-xl font-bold mb-4", 
                    theme === "dark" ? "text-white" : "text-gray-800")}>
                    Confirm Deletion
                  </h3>
                  <p className={cn("mb-6", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                    Are you sure you want to delete the selected students? ({selectedStudents.length})
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteSelectedModal(false)}
                      className="btn btn-md btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDeleteSelected}
                      className="btn btn-md btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
  
        ) : (
          <div className={cn("rounded-xl shadow-lg p-6 border", 
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
            <h2 className={cn("text-2xl font-bold mb-6", 
              theme === "dark" ? "text-white" : "text-gray-800")} 
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Materials
            </h2>
            <MaterialsPage classroomId={params.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomPage} />;
}