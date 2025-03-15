"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";

const ExamMaker = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    numQuestions: 5,
    questionType: "multiple_choice",
    classroom: "",
    scoringStyle: "equal",
    customScoringDetails: "",
    additionalInfo: ""
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
      return;
    }

    // Fetch user's classrooms
    const fetchClassrooms = async () => {
      try {
        const parsedUser = JSON.parse(user);
        const response = await axios.get("http://localhost:8000/api/classrooms/", {
          params: {
            creator: parsedUser.id
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setClassrooms(response.data);
        setLoading(false);
      } catch (err) {
        setErrorMessage("Failed to fetch classrooms");
        setLoading(false);
        console.error("Error fetching classrooms:", err);
      }
    };

    fetchClassrooms();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would send the data to your AI model endpoint
      // For now, we'll just log the data
      console.log("Generating exam with:", formData);
      
      // Mock API call
      // const response = await axios.post("http://localhost:8000/api/exams/generate/", formData, {
      //   headers: {
      //     Authorization: `Token ${localStorage.getItem("authToken")}`,
      //   },
      // });
      
      // Redirect to the generated exam or show success message
      // router.push(`/exams/${response.data.id}`);
    } catch (err) {
      setErrorMessage("Failed to generate exam");
      console.error("Error generating exam:", err);
    }
  };

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_false", label: "True/False" },
    { value: "short_answer", label: "Short Answer" },
    { value: "essay", label: "Essay" },
    { value: "fill_blank", label: "Fill in the Blank" },
    { value: "matching", label: "Matching" },
    { value: "mixed", label: "Mixed (Various Types)" }
  ];

  const scoringStyles = [
    { value: "equal", label: "Equal Points (All questions worth the same)" },
    { value: "custom", label: "Custom Points (Assign different values to questions)" }
  ];

  return (
    <div className={cn("min-h-screen")}>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <h1 className={cn("text-3xl md:text-4xl font-bold mb-6 text-center", 
            theme === "dark" ? "text-white" : "text-gray-900")} 
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
            AI Exam Generator
          </h1>
          
          <p className={cn("text-center mb-8", 
            theme === "dark" ? "text-gray-300" : "text-gray-600")}>
            Create customized exams for your students with our AI-powered tool
          </p>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <div className={cn("max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", 
            theme === "dark" ? "bg-black" : "bg-white")}>
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');
              select {
                appearance: none;
                background: ${theme === "dark" ? "#333" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
                border: 1px solid ${theme === "dark" ? "#555" : "#ccc"};
                padding: 0.5rem;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                width: 100%;
              }
              select:focus {
                outline: none;
                border-color: ${theme === "dark" ? "#888" : "#007bff"};
                box-shadow: 0 0 0 3px ${theme === "dark" ? "rgba(136, 136, 136, 0.5)" : "rgba(0, 123, 255, 0.25)"};
              }
              option {
                background: ${theme === "dark" ? "#333" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
              }
            `}</style>
            
            <form className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" 
              onSubmit={handleSubmit} 
              style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
              
              <div className="space-y-6">
                <LabelInputContainer>
                  <Label htmlFor="subject">📚 Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    placeholder="Mathematics, Science, History, etc." 
                    type="text" 
                    required 
                    value={formData.subject} 
                    onChange={handleChange} 
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="numQuestions">❓ Number of Questions</Label>
                  <Input 
                    id="numQuestions" 
                    name="numQuestions" 
                    type="number" 
                    min="1" 
                    max="50" 
                    required 
                    value={formData.numQuestions} 
                    onChange={handleChange} 
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="questionType">🔤 Question Type</Label>
                  <select
                    id="questionType"
                    name="questionType"
                    required
                    value={formData.questionType}
                    onChange={handleChange}
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </LabelInputContainer>
              </div>

              <div className="space-y-6">
                <LabelInputContainer>
                  <Label htmlFor="classroom">🏫 Classroom (Difficulty Level)</Label>
                  <select
                    id="classroom"
                    name="classroom"
                    required
                    value={formData.classroom}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a classroom</option>
                    {loading ? (
                      <option value="" disabled>Loading classrooms...</option>
                    ) : (
                      classrooms.map(classroom => (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.name} - {classroom.academic_course}
                        </option>
                      ))
                    )}
                  </select>
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="scoringStyle">📊 Scoring Style</Label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="equalPoints"
                        name="scoringStyle"
                        value="equal"
                        checked={formData.scoringStyle === "equal"}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <label 
                        htmlFor="equalPoints"
                        className={theme === "dark" ? "text-white" : "text-gray-900"}
                      >
                        Equal Points
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="customPoints"
                        name="scoringStyle"
                        value="custom"
                        checked={formData.scoringStyle === "custom"}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <label 
                        htmlFor="customPoints"
                        className={theme === "dark" ? "text-white" : "text-gray-900"}
                      >
                        Custom Points
                      </label>
                    </div>
                  </div>
                  {formData.scoringStyle === "custom" && (
                    <textarea
                      id="customScoringDetails"
                      name="customScoringDetails"
                      placeholder="Specify your scoring system (e.g., Q1: 10pts, Q2: 15pts...)"
                      rows="3"
                      className={cn(
                        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-4",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        theme === "dark" ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-black border-gray-300"
                      )}
                      value={formData.customScoringDetails || ""}
                      onChange={handleChange}
                    />
                  )}
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="additionalInfo">📝 Additional Information</Label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Specific topics to cover, special instructions, etc."
                    rows="4"
                    className={cn(
                      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      theme === "dark" ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-black border-gray-300"
                    )}
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  ></textarea>
                </LabelInputContainer>
              </div>

              <button
                className={cn(
                  "relative group/btn col-span-2 block w-full rounded-md h-12 font-medium border border-transparent", 
                  theme === "dark" 
                    ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                    : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-green-300"
                )}
                type="submit">
                Generate Exam &rarr;
                <BottomGradient />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {React.Children.map(children, child => {
        // Add null check before accessing child.type
        if (child && child.type === Label) {
          return React.cloneElement(child, {
            style: { fontFamily: "'Alfa Slab One', sans-serif", fontSize: "1.25rem" }
          });
        }
        return child;
      })}
    </div>
  );
};

export default function Page() {
  return <SidebarDemo ContentComponent={ExamMaker} />;
}
