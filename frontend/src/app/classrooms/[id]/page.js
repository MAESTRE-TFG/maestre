'use client'
import { useEffect, useState } from 'react'
import { SidebarDemo } from "@/components/sidebar-demo";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useParams } from 'next/navigation';
const axios = require('axios');

const ClassroomPage = () => {
  const [activeTab, setActiveTab] = useState('students')
  const { theme } = useTheme()
  const params = useParams()
  const [classroom, setClassroom] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        // Import axios at the top of the file
        
        const response = await axios.get(`http://localhost:8000/api/classrooms/${params.id}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setClassroom(response.data);
        console.log(response.data)
      } catch (err) {
        setErrorMessage("Failed to fetch classroom");
        console.error("Error fetching classroom:", err);
      }
    };
    fetchClassroom();
  }, [params.id])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!params.id) return;
      
      try {
        // Use the standard list endpoint with a filter parameter
        const response = await axios.get(`http://localhost:8000/api/students/`, {
          params: {
            classroom_id: params.id  // Filter by classroom ID
          },
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setStudents(response.data);
        console.log("Students fetched:", response.data);  
      } catch (err) {
        setErrorMessage("Failed to fetch students");
        console.error("Error fetching students:", err);
      }
    };
    
    fetchStudents();
  }, [params.id]);

  const handleDelete = async (student) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${student.id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        }
      });
      // Update students state directly by filtering out the deleted student
      setStudents(prevStudents => prevStudents.filter(s => s.id !== student.id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  const handleEdit = async(e) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`http://localhost:8000/api/students/${student.id}/`, {
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
      // Optionally refresh the students list here
      setStudents(prevStudents => {
        const updatedStudents = prevStudents.map(s => 
          s.id === student.id ? { ...s, name: studentName, surname: studentSurname } : s
        );
        return updatedStudents;
      });
    } catch (error) {
      console.error('Error editing student:', error);
      setErrorMessage('Failed to edit student');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8000/api/students/', {
        name: studentName,
        surname: studentSurname,
        classroom_id: params.id
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json'
        }
      });

      // Add the newly created student to the state
      setStudents(prevStudents => [...prevStudents, response.data]);
      
      setShowModal(false);
      setStudentName('');
      setStudentSurname('');
    } catch (error) {
      console.error('Error adding student:', error);
      setErrorMessage('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto h-full">
      <div className="fixed top-0 left-0 w-full z-10 bg-inherit backdrop-blur-md">
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-full">
          <div className="h-12"></div>
          <div className="flex justify-center items-center sticky top-0 bg-inherit px-4 space-x-4">
            
            {classroom ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-lg font-medium",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}>
                    {classroom.academic_year}
                  </span>
                  <h1
                    className={cn(
                      "text-3xl font-extrabold text-zinc-100",
                      theme === "dark" ? "text-white" : "text-dark"
                    )}
                    style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                  >
                    · {classroom.name} ·
                  </h1>
                  <span className={cn(
                    "text-lg font-medium mt-1",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}>
                    {classroom.academic_course}
                  </span>
                </div>
                <p className={cn(
                  "text-base",
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                )}>
                  {classroom.description}
                </p>
              </div>
            ) : (
              <h1 className={cn(
                "text-3xl font-extrabold text-zinc-100",
                theme === "dark" ? "text-white" : "text-dark"
              )}>
                Loading classroom...
              </h1>
            )}
            <div className="h-12"></div>

            <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
            `}</style>
          </div>
        </div>
      </div>
      {/* End of Floating Div */}
      {/* Navigation tabs */}
      <div className={cn("flex mb-8 border-b mt-28",
        theme === "dark" ? "border-neutral-700" : "border-gray-200")}>
        <button
          className={cn("px-6 py-3 transition-colors",
            activeTab === 'students'
              ? theme === "dark"
                ? "border-b-2 border-white text-white"
                : "border-b-2 border-gray-800 text-gray-800"
              : theme === "dark"
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={cn("px-6 py-3 transition-colors",
            activeTab === 'materials'
              ? theme === "dark"
                ? "border-b-2 border-white text-white"
                : "border-b-2 border-gray-800 text-gray-800"
              : theme === "dark"
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
      </div>

      {/* Content sections */}
      <div className="min-h-screen max-w-7xl justify-self-center w-auto">
        {activeTab === 'students' ? (
          <div className={cn("rounded-lg shadow p-6", 
            theme === "dark" ? "bg-neutral-700 border-neutral-500" : "bg-white border-gray-200")}>
            <h2 className={cn("text-2xl font-bold mb-4", 
              theme === "dark" ? "text-white" : "text-gray-800")} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Students</h2>
            <div className="grid gap-4">
              {/* Student list will go here */}
              {students && students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students
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
                        "p-4 rounded-lg border",
                        theme === "dark"
                          ? "bg-neutral-800 border-neutral-600"
                          : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className={cn(
                          "text-lg font-semibold",
                          theme === "dark" ? "text-white" : "text-gray-800"
                        )}>
                          {student.name} {student.surname || ''}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setStudentName(student.name);
                              setStudentSurname(student.surname);
                              setShowModal(true);
                              setEditMode(true);
                              setStudent(student)
                            }}
                            className={cn(
                              "p-2 rounded-full hover:bg-opacity-80",
                              theme === "dark" ? "hover:bg-neutral-700" : "hover:bg-gray-200"
                            )}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                              "h-5 w-5",
                              theme === "dark" ? "text-blue-400" : "text-blue-500"
                            )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className={cn(
                              "p-2 rounded-full hover:bg-opacity-80",
                              theme === "dark" ? "hover:bg-neutral-700" : "hover:bg-gray-200"
                            )}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                              "h-5 w-5",
                              theme === "dark" ? "text-red-400" : "text-red-500"
                            )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            ) : (
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>
                No students enrolled yet
              </p>
            )}
            </div>
            <div className="flex justify-center m-4">
              <button
                onClick={() => setShowModal(true)}
                className={cn("font-bold py-2 px-4 rounded", 
                  theme === "dark" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white")}
              >
                Add Student
              </button>
            </div>
            {/* Add Student Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={cn("p-8 rounded-lg w-96", 
                  theme === "dark" ? "bg-neutral-800" : "bg-white")}>
                  <h3 className={cn("text-xl font-bold mb-4", 
                    theme === "dark" ? "text-white" : "text-gray-800")} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                    {editMode ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editMode) {
                      handleEdit(e);
                    } else {
                      handleSubmit(e);
                    }
                  }}>
                    <div className="mb-4">
                      <label className={cn("block text-sm font-bold mb-2", 
                        theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className={cn("shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline", 
                          theme === "dark" ? "bg-neutral-700 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-700")}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className={cn("block text-sm font-bold mb-2", 
                        theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                        Surname
                      </label>
                      <input
                        type="text"
                        value={studentSurname}
                        onChange={(e) => setStudentSurname(e.target.value)}
                        className={cn("shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline", 
                          theme === "dark" ? "bg-neutral-700 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-700")}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className={cn("font-bold py-2 px-4 rounded", 
                          theme === "dark" ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-800")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn("font-bold py-2 px-4 rounded disabled:opacity-50", 
                          theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-700 text-white")}
                      >
                        {isSubmitting ? 'Adding...' : editMode ? 'Edit Student' : 'Add Student'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

        ) : (
          <div className={cn("rounded-lg shadow p-6", 
            theme === "dark" ? "bg-neutral-700 border-transparent" : "bg-white border-gray-200")}>
            <h2 className={cn("text-2xl font-bold mb-4", 
              theme === "dark" ? "text-white" : "text-gray-800")} style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>Materials</h2>
            <div className="grid gap-4">
              {/* Materials list will go here */}
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>No materials available</p>
            </div>
          </div>
        )}
      
      </div>

    </div>
  )
}
const BottomGradient = ({ isCreate }) => {
  return (<>
    <span className={cn("group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0",
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent")} />
    <span className={cn("group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10",
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent")} />
  </>);
};

export default function Main() {
  return <SidebarDemo ContentComponent={ClassroomPage} />;
}