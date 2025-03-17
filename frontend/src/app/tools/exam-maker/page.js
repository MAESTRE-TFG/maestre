"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import jsPDF from "jspdf";

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
    additionalInfo: "",
    totalPoints: 10,
    llmModel: "llama3.2:3b" // Default model
  });
  const promptRef = useRef("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfToUplaod, setPdfToUpload] = useState(null);

  const llmModels = [
    { value: "llama3.2:3b", label: "Llama 3.2 3B" },
    { value: "deepseek-r1:latest", label: "DeepSeek R1" }
  ];

  // Wrap the function in useCallback to prevent recreation on every render
  const parseFormDataToNaturalLanguage = useCallback((data) => {
    // Question type mapping
    const questionTypeMap = {
      multiple_choice: "opción múltiple",
      true_false: "verdadero/falso",
      short_answer: "respuesta corta",
      essay: "desarrollo",
      fill_blank: "completar espacios en blanco",
      matching: "relacionar conceptos",
      mixed: "tipos variados"
    };

    // Scoring style mapping
    const scoringStyleMap = {
      equal: "que cada pregunta tenga el mismo valor",
      custom: "personalizada"
    };

    // Find the classroom name based on the selected ID
    let classroomName = data.classroom;
    if (data.classroom && classrooms.length > 0) {
      const selectedClassroom = classrooms.find(c => c.id.toString() === data.classroom.toString());
      if (selectedClassroom) {
        classroomName = `${selectedClassroom.name} - ${selectedClassroom.academic_course}`;
      }
    }

    return {
      subject: data.subject,
      numQuestions: data.numQuestions,
      questionType: questionTypeMap[data.questionType] || data.questionType,
      classroom: classroomName,
      scoringStyle: scoringStyleMap[data.scoringStyle] || data.scoringStyle,
      totalPoints: data.totalPoints,
      customScoringDetails: data.customScoringDetails ? data.customScoringDetails : "",
      additionalInfo: data.additionalInfo
    };
  }, [classrooms]); // Only recreate when classrooms change

  // Update the prompt whenever relevant form data changes
  useEffect(() => {
    // Parse form data to natural language
    const parsedData = parseFormDataToNaturalLanguage(formData);
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Base prompt construction with parsed data
    let prompt = `Genera un examen sobre ${parsedData.subject} que incluya ${parsedData.numQuestions} 
                  preguntas de tipo ${parsedData.questionType}. Este examen se debe ajustar  
                  a la normativa, contenidos educativos y competencias establecidas 
                  para el nivel de ${parsedData.classroom} de la comunidad autónoma de ${user.region}.`;
    
    // Add scoring details with more explicit instructions for equal distribution
    if (formData.scoringStyle === "equal") {
      const pointsPerQuestion = (parsedData.totalPoints / parsedData.numQuestions).toFixed(2);
      prompt += ` Los puntos totales serán ${parsedData.totalPoints}, distribuidos equitativamente entre las ${parsedData.numQuestions} preguntas 
                 (${pointsPerQuestion} puntos por cada pregunta).`;
    } else {
      prompt += ` Los puntos totales serán ${parsedData.totalPoints} repartidos de forma ${parsedData.scoringStyle}.`;
    }

    // Add extra details based on conditions
    if (parsedData.scoringStyle === "personalizada" && parsedData.additionalInfo) {
      prompt += ` Detalles de puntuación: ${parsedData.customScoringDetails}. Información adicional: ${parsedData.additionalInfo}. 
                 Asegúrate de que las preguntas sean claras, precisas y acordes al tema y nivel indicado.`;
    } else if (parsedData.scoringStyle === "personalizada") {
      prompt += ` Detalles de puntuación: ${parsedData.customScoringDetails}.`;
    } else if (parsedData.additionalInfo) {
      prompt += ` Información adicional: ${parsedData.additionalInfo}.`;
    }

    // Update the prompt reference
    promptRef.current = prompt;
    
    // Log the updated prompt for debugging
    console.log("Updated prompt:", promptRef.current);
  }, [
    formData,
    parseFormDataToNaturalLanguage
  ]); // Now we only depend on formData and the memoized function

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
  
const formatExamText = (text) => {
  if (!text) return '';

  // Create a copy of the text to work with
  let formattedText = text;

  // Define formatting rules
  const formattingRules = [
    // Text styling
    {
      pattern: /\*\*(.*?)\*\*|\*(?!\*)(.*?)(?<!\*)\*/g,
      replacement: '<strong>$1$2</strong>'
    },
    {
      pattern: /__(.*?)__|_(?!_)(.*?)(?<!_)_/g,
      replacement: '<em>$1$2</em>'
    },
    {
      pattern: /~~(.*?)~~/g,
      replacement: '<u>$1</u>'
    },

    // Headers
    {
      pattern: /^# (.*?)$/gm,
      replacement: '<h1 class="text-2xl font-bold my-4">$1</h1>'
    },
    {
      pattern: /^## (.*?)$/gm,
      replacement: '<h2 class="text-xl font-bold my-3">$1</h2>'
    },
    {
      pattern: /^### (.*?)$/gm,
      replacement: '<h3 class="text-lg font-bold my-2">$1</h3>'
    },

    // Question formats
    {
      pattern: /^(Pregunta|Ejercicio|Problema)\s*(\d+)[:.]\s*(.*?)$/gm,
      replacement: '<div class="my-4 question-block"><span class="font-bold text-lg">$1 $2:</span> $3</div>'
    },
    {
      pattern: /^(Q|Question)\s*(\d+)[:\.]\s*(.*?)$/gm,
      replacement: '<div class="my-4 question-block"><span class="font-bold text-lg">Question $2:</span> $3</div>'
    },

    // Lists and choices
    {
      pattern: /^(\d+)\.\s+(.*?)$/gm,
      replacement: '<div class="ml-4 my-1 numbered-item"><span class="font-bold mr-2">$1.</span>$2</div>'
    },
    {
      pattern: /^[-•]\s+(.*?)$/gm,
      replacement: '<div class="ml-4 my-1 bullet-item">• $1</div>'
    },
    {
      pattern: /^([A-Za-z])[)\.]\s+(.*?)$/gm,
      replacement: '<div class="ml-6 my-1 choice-item"><span class="font-semibold mr-2">$1)</span> $2</div>'
    }
  ];

  // Apply all formatting rules
  formattingRules.forEach(rule => {
    formattedText = formattedText.replace(rule.pattern, rule.replacement);
  });

  // Handle paragraphs and line breaks
  const paragraphs = formattedText.split(/\n\n+/);
  formattedText = paragraphs.map(para => {
    // Skip if already HTML
    if (para.trim().startsWith('<')) return para;

    // Process line breaks
    const lines = para.split(/\n/);
    return lines.length > 1
      ? `<p class="my-2">${lines.join('<br>')}</p>`
      : `<p class="my-2">${para}</p>`;
  }).join('\n');

  // Add wrapper div for consistent styling
  return `<div class="exam-content">${formattedText}</div>`;
};

// Add this function to create a document-friendly version of the exam
const createDocumentVersion = (examText) => {
  // Add page styling for print/document version
  const documentStyles = `
    <style>
      @page {
        size: A4;
        margin: 2cm;
      }
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.5;
      }
      h1 {
        font-size: 18pt;
        text-align: center;
        margin-bottom: 0.5cm;
      }
      h2 {
        font-size: 14pt;
        margin-bottom: 0.3cm;
      }
      .question-block {
        margin: 0.5cm 0;
      }
      .choice-item {
        margin-left: 1cm;
      }
      .footer {
        text-align: center;
        font-size: 9pt;
        margin-top: 1cm;
        color: #666;
      }
    </style>
  `;
  
  // Create HTML document structure
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Exam Document</title>
      ${documentStyles}
    </head>
    <body>
      ${formatExamText(examText)}
      <div class="footer">Generated with Maestre AI Exam Generator</div>
    </body>
    </html>`;
};

// Add this function to create a PDF version of the exam
const createPDFVersion = (examText) => {
  const doc = new jsPDF();
  const formattedText = formatExamText(examText);

  // Add content to the PDF
  doc.fromHTML(formattedText, 10, 10, {
    width: 180,
  });

  // Add footer
  doc.text("Generated with Maestre AI Exam Generator", 105, doc.internal.pageSize.height - 10, null, null, "center");

  return doc;
};

// Remove both existing handleSubmit functions and replace with this single combined version
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsGenerating(true);
  setErrorMessage(null);
  
  try {
    console.log("Generating exam with prompt:", promptRef.current);
    
    // Call to local Ollama instance for initial exam generation
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: formData.llmModel, // Use selected model
      prompt: promptRef.current,
      stream: false
    });
    
    // Handle the response
    if (response.data && response.data.response) {
      // Store the raw exam content
      const rawExamContent = response.data.response;
      
      // Create a formatting prompt to improve the structure
      const formattingPrompt = `
        Please reformat the following exam to ensure it has:
        1. A clear title and subtitle
        2. Properly numbered questions
        3. Consistent formatting for multiple choice options (using A), B), C), etc.)
        4. Clear point values for each question
        5. Proper spacing between sections
        
        Here's the exam to reformat:
        
        ${rawExamContent}
      `;
      
      // Make a second call to format the exam
      const formattingResponse = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3.2:3b",
        prompt: formattingPrompt,
        stream: false
      });
      
      if (formattingResponse.data && formattingResponse.data.response) {
        // Use the formatted version
        setExamResult(formattingResponse.data.response);
        setShowModal(true);
        console.log("Exam formatted successfully");
      } else {
        // Fallback to the original version if formatting fails
        setExamResult(rawExamContent);
        setShowModal(true);
        console.log("Using original exam format");
      }
    } else {
      throw new Error("Invalid response from Ollama");
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      setErrorMessage("API endpoint not found (404). Please check the URL and try again.");
    } else {
      setErrorMessage("Failed to generate exam: " + (err.message || "Unknown error"));
    }
    console.error("Error generating exam:", err);
  } finally {
    setIsGenerating(false);
  }
};

const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName) => {
  const formData = new FormData();
  formData.append('name', fileName);
  formData.append('file', pdfBlob);
  formData.append('classroom', classroomId);

  try {
    const token = localStorage.getItem('authToken');
    await axios.post('http://localhost:8000/api/materials/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}`
      }
    });
    alert('PDF saved as a material for the selected class.');
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMsg = error.response.data && error.response.data.error
          ? error.response.data.error
          : "Failed to upload file. Maximum limit reached.";
        alert(errorMsg);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      alert("Network error. Please try again later.");
    } else {
      console.error('Error setting up request:', error.message);
      alert("An error occurred. Please try again.");
    }
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

return (
  <div className={cn("min-h-screen")}>
    <div className="relative my-8" style={{ height: "100px" }}></div>
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
                    max="20" 
                    required 
                    value={formData.numQuestions} 
                    onChange={handleChange} 
                  />
                </LabelInputContainer>
            
                <LabelInputContainer>
                  <Label htmlFor="maxPoints">🎯 Maximum Points</Label>
                  <Input 
                    id="maxPoints" 
                    name="maxPoints" 
                    type="number" 
                    min="1" 
                    max="1000" 
                    required 
                    value={formData.totalPoints} 
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
                    <div className="flex flex-wrap items-center gap-4">
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
                    <Label htmlFor="llmModel">🤖 LLM Model</Label>
                    <select
                      id="llmModel"
                      name="llmModel"
                      required
                      value={formData.llmModel}
                      onChange={handleChange}
                    >
                      {llmModels.map(model => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
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
                    "relative group/btn col-span-1 md:col-span-2 block w-full rounded-md h-12 font-medium border border-transparent", 
                    theme === "dark" 
                      ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                      : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-green-300"
                  )}
                  type="submit"
                  style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
              >
                  Generate Exam &rarr;
                  <BottomGradient />
              </button>
          </form>
              
              {isGenerating && (
                <div className="mt-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  <p className={theme === "dark" ? "text-white mt-2" : "text-gray-800 mt-2"}>
                    Generating your exam...
                  </p>
                </div>
              )}
                      {showModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div 
                        className={cn(
                          "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6",
                          theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-black"
                        )}
                        >
                        <button 
                          onClick={() => setShowModal(false)}
                          className={cn(
                          "fixed top-4 right-4 p-2 rounded-full", // Changed to absolute
                            theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-200"
                            )}
                            style={{ position: 'fixed', top: '1rem', right: '1rem' }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                          
                          <h2 className="text-2xl font-bold mb-4">{formData.subject} Exam</h2>
                          
                          <div 
                            className={cn(
                            "prose max-w-none mb-6",
                            theme === "dark" ? "prose-invert" : ""
                            )}
                            dangerouslySetInnerHTML={{ __html: formatExamText(examResult) }}
                          ></div>
                          
                          <div className="sticky bottom-0 left-0 right-0 p-5 bg-opacity-90 bg-inherit flex justify-end space-x-3">
                            <button
                            onClick={() => {
                            navigator.clipboard.writeText(examResult);
                            alert("Exam copied to clipboard!");
                          }}
                          className={cn(
                            "relative group/btn px-4 py-2 rounded-md", 
                            theme === "dark" 
                              ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-blue-300"
                          )}
                          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                           >
                          Copy
                          <BottomGradient />
                          </button>
                        <button
                          onClick={() => {
                            const docVersion = createDocumentVersion(examResult);

                            // Create a Blob with HTML content
                            const blob = new Blob([docVersion], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);

                            // Create download link
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${formData.subject}_exam.html`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                          className={cn(
                            "relative group/btn px-4 py-2 rounded-md", 
                            theme === "dark" 
                              ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                              : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-red-300"
                          )}
                          style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                        >
                        Save as HTML
                        <BottomGradient />
                      </button>
                      <button
                        onClick={async () => {
                          const pdfDoc = createPDFVersion(examResult);
                          const pdfBlob = pdfDoc.output('blob');
                          const fileName = `${formData.subject}_exam.pdf`;
                          
                          // Save the PDF locally
                          pdfDoc.save(fileName);

                          // Upload the PDF as a material for the selected class
                          await uploadPDFToClassroom(pdfBlob, formData.classroom, fileName);
                        }}
                        className={cn(
                          "relative group/btn px-4 py-2 rounded-md", 
                          theme === "dark" 
                            ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" 
                            : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] border border-yellow-300"
                        )}
                        style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
                      >
                        Save as PDF
                        <BottomGradient />
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
