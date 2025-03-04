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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8000/api/students/', {
        name: studentName,
        surname: studentSurname,
        classroom_id: params.id
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json'
        }
      });

      setShowModal(false);
      setStudentName('');
      setStudentSurname('');
      // Optionally refresh the students list here
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
                  >
                    · {classroom.name} ·
                  </h1>
                  <span className={cn(
                    "text-lg font-medium",
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
              theme === "dark" ? "text-white" : "text-gray-800")}>Students</h2>
            <div className="grid gap-4">
              {/* Student list will go here */}
              {students && students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        theme === "dark"
                          ? "bg-neutral-800 border-neutral-600"
                          : "bg-gray-50 border-gray-200"
                      )}
                    >
                    <div className={cn(
                      "text-lg font-semibold",
                      theme === "dark" ? "text-white" : "text-gray-800"
                    )}>
                      {student.name} {student.surname || ''}
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
                    theme === "dark" ? "text-white" : "text-gray-800")}>Add New Student</h3>
                  <form onSubmit={handleSubmit}>
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
                        {isSubmitting ? 'Adding...' : 'Add Student'}
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
              theme === "dark" ? "text-white" : "text-gray-800")}>Materials</h2>
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