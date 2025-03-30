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
    llmModel: "llama3.2:3b", // Default model
    examName: "" // Added exam name field
  });
  const promptRef = useRef("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfToUplaod, setPdfToUpload] = useState(null);
  const [userMaterials, setUserMaterials] = useState([]);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileContentsRef = useRef('');


  const llmModels = [
    { value: "llama3.2:3b", label: "Llama 3.2 3B" },
    { value: "deepseek-r1:7b", label: "DeepSeek R1" }
  ];

  useEffect(() => {
    // Only fetch materials if user is logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      const fetchUserMaterials = async () => {
        try {
          const parsedUser = JSON.parse(user);
          const response = await axios.get("http://localhost:8000/api/materials/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // Filter materials by user's classrooms
          const userMaterials = response.data.filter(material =>
            classrooms.some(c => c.id.toString() === material.classroom.toString())
          );

          setUserMaterials(userMaterials);
        } catch (err) {
          console.error("Error fetching materials:", err);
        }
      };

      if (classrooms.length > 0) {
        fetchUserMaterials();
      }
    }
  }, [classrooms]);

  // Add material selection handler
  const handleMaterialSelect = async (material) => {
    setSelectedMaterial(material);
    setShowMaterialsModal(false);
    setIsProcessingFile(true);

    try {
      const token = localStorage.getItem('authToken');

      // For PDF files, request text extraction from the backend
      if (material.file.toLowerCase().endsWith('.pdf')) {
        const response = await axios.get(
          `http://localhost:8000/api/materials/extract-text/${material.id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.data && response.data.text) {
          setFormData(prev => ({
            ...prev,
            additionalInfo: prev.additionalInfo +
              `\n\n--- Content extracted from "${material.name}" ---\n\n` +
              (response.data.text.length > 3000 ?
                response.data.text.substring(0, 3000) + "... (content truncated)" :
                response.data.text)
          }));
        }
      } else {
        // For non-PDF files, fetch and process directly
        const response = await axios.get(material.file, {
          responseType: 'blob',
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const blob = response.data;
        const file = new File([blob], material.name, { type: blob.type });
        const text = await readFileAsText(file);

        setFormData(prev => ({
          ...prev,
          additionalInfo: prev.additionalInfo +
            `\n\n--- Content from "${material.name}" ---\n\n` + text
        }));
      }
    } catch (error) {
      console.error("Error fetching material:", error);
      setErrorMessage(`Failed to fetch material: ${error.message}`);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Add file upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessingFile(true);

    try {
      // For DOCX files, send to backend for processing
      if (file.name.toLowerCase().endsWith('.docx')) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('authToken');
        const response = await axios.post(
          "http://localhost:8000/api/materials/extract-text/",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Token ${token}`
            }
          }
        );

        // Store the file info and extracted text in our state
        if (response.data && response.data.text) {
          // Add to uploadedFiles array instead of additionalInfo
          setUploadedFiles(prev => [
            ...prev,
            {
              name: file.name,
              content: response.data.text,
              id: Date.now() // Use timestamp as unique ID
            }
          ]);

          // Update the prompt reference with the file content (hidden from user)
          updatePromptWithFiles([...uploadedFiles, {
            name: file.name,
            content: response.data.text,
            id: Date.now()
          }]);
        }
      } else {
        // For other file types, just add a reference
        setUploadedFiles(prev => [
          ...prev,
          {
            name: file.name,
            content: `Please use the uploaded file "${file.name}" as reference.`,
            id: Date.now()
          }
        ]);

        updatePromptWithFiles([...uploadedFiles, {
          name: file.name,
          content: `Please use the uploaded file "${file.name}" as reference.`,
          id: Date.now()
        }]);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setErrorMessage(`Failed to process file: ${error.message}`);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const removeUploadedFile = (fileId) => {
    setUploadedFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      updatePromptWithFiles(updatedFiles);
      return updatedFiles;
    });
  };

  const updatePromptWithFiles = (files) => {
    // Extract all file contents and add them to the prompt
    const fileContents = files.map(file =>
      `--- Content from "${file.name}" ---\n${file.content}\n`
    ).join('\n\n');

    // Update formData with file references but not content
    setFormData(prev => ({
      ...prev,
      // We don't show file content in additionalInfo anymore
      fileReferences: files.map(file => file.name)
    }));

    // Store file contents in a ref for use when generating the prompt
    fileContentsRef.current = fileContents;
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

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
    // 1. Parse form data to natural language
    const parsedData = parseFormDataToNaturalLanguage(formData);
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Construcción inicial del prompt con secciones claras
    let prompt = `[ROLE & RULES SECTION]
You are an expert exam creator with years of experience in educational design and pedagogy.
Your task is to create a high-quality exam according to the specifications below.
IMPORTANT: Only use the information provided in this prompt or by the user.
If certain information is not available, do NOT fabricate details. If something is unclear or incomplete, indicate the missing information instead of guessing.

[EXAM SPECIFICATIONS]
SUBJECT: ${parsedData.subject}
EXAM NAME: ${formData.examName || 'Exam'}
NUMBER OF QUESTIONS: MUST HAVE EXACTLY ${parsedData.numQuestions} QUESTIONS
QUESTION TYPE: ${parsedData.questionType}
TOTAL POINTS: ${parsedData.totalPoints}
EDUCATION LEVEL: ${parsedData.classroom}
REGION: ${user.region}`;

    // 3. Incluir información sobre el estilo de puntaje si no es "igual"
    if (formData.scoringStyle !== "equal") {
      prompt += `\nSCORING STYLE: Custom distribution as follows: ${parsedData.customScoringDetails}`;
    }

    // 4. Agregar instrucciones adicionales proporcionadas por el usuario
    if (parsedData.additionalInfo) {
      prompt += `

[ADDITIONAL INSTRUCTIONS]
${parsedData.additionalInfo}`;
    }

    // 5. Agregar materiales de referencia (si existen)
    prompt += `

[REFERENCE MATERIALS]
Please use the following reference materials as guidelines for how could the questions and its contents could be in your exam:
${fileContentsRef.current
        ? fileContentsRef.current
        : "No reference materials provided."
      }`;

    // 6. Incluir ejemplo de plantilla (few-shot) para guiar al modelo
    prompt += `

[EXAMPLE TEMPLATE] (FOR REFERENCE ONLY)
Title: Sample Exam - Subject
Subtitle: 

1) [Question text here]
   A) ...
   B) ...
   C) ...
   D) ...

2) [Question text here]
   True or False: ...
`;

    // 7. Reforzar requerimientos de formato
    prompt += `

[FORMATTING REQUIREMENTS]
1. The exam MUST be in English
1. Include a clear title and subtitle with the exam name and subject.
2. Number all questions sequentially.
3. For multiple-choice questions, use options labeled as A), B), C), etc.
4. Clearly indicate the point value for each question.
5. Ensure proper spacing between questions.
6. Format the exam in a clean, professional manner suitable for classroom use.
7. Ensure the exam follows educational standards for ${parsedData.classroom} level in ${user.region}.
8. Make sure the total points add up to exactly ${parsedData.totalPoints}.
9. Use proper formatting for each question type (e.g., multiple choice with options, true/false with clear statements).
10. Include clear section headers if mixing different types of questions.
`;

    // 8. Añadir un checklist de verificación para que el modelo valide su salida
    prompt += `
[CHECKLIST]
1) Did you include exactly ${parsedData.numQuestions} questions?
2) Do the total points add up to exactly ${parsedData.totalPoints}?
3) Are there any details that are not supported by the references?
4) Did you follow all formatting requirements strictly?

If any check fails, revise your answer before finalizing.
`;

    // *** Instrucción final para generar el examen ***
    prompt += `
[FINAL INSTRUCTION]
Now, produce a complete exam following all the specifications and requirements above.
If any information is missing, note it clearly rather than inventing details.
`;

    // Actualizamos la referencia con el prompt final
    promptRef.current = prompt;

    // Log para depurar
    console.log("Updated comprehensive prompt:", promptRef.current);
  }, [formData, parseFormDataToNaturalLanguage, uploadedFiles]);
  
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
  // Improve the PDF generation function to better handle HTML content
  const createPDFVersion = (examText) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text(`${formData.subject} Exam`, 105, 20, { align: 'center' });
    
    // Format the content for PDF
    const formattedHTML = formatExamText(examText);
    
    // Use fromHTML with better styling
    doc.fromHTML(formattedHTML, 15, 30, {
      width: 180,
      elementHandlers: {
        '#ignore': function(element, renderer) {
          return true;
        }
      }
    });
    
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated with Maestre AI Exam Generator - Page ${i} of ${totalPages}`,
        105, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }
    
    return doc;
  };

  // Enhance the uploadPDFToClassroom function to handle errors better
  const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName) => {
    if (!classroomId) {
      alert('Please select a classroom before saving the PDF.');
      return false;
    }
    
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', pdfBlob, fileName);
    formData.append('classroom', classroomId);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to save materials.');
        return false;
      }
      
      const response = await axios.post('http://localhost:8000/api/materials/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      });
      
      console.log('PDF uploaded successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          const errorMsg = error.response.data && error.response.data.error
            ? error.response.data.error
            : "Failed to upload file. Maximum limit reached.";
          alert(errorMsg);
        } else if (error.response.status === 401) {
          alert("Authentication error. Please log in again.");
        } else {
          alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An error occurred while uploading the PDF. Please try again.");
      }
      
      return false;
    }
  };

  // Define the handleSubmit function properly
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      console.log("Generating exam with prompt:", promptRef.current);
      
      // Call to local Ollama instance using the single comprehensive prompt
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: formData.llmModel,
        prompt: promptRef.current,
        stream: false,
        temperature: 0.7,
      });
      
      // Handle the response
      if (response.data && response.data.response) {
        // Store the exam content
        setExamResult(response.data.response);
        setShowModal(true);
        console.log("Exam generated successfully");
      } else {
        throw new Error("Invalid response from Ollama");
      }
    } catch (err) {
      setErrorMessage("Failed to generate exam: " + (err.message || "Unknown error"));
      console.error("Error generating exam:", err);
    } finally {
      setIsGenerating(false);
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
                    <Label htmlFor="examName">📝 Exam Name</Label>
                    <Input 
                      id="examName" 
                      name="examName" 
                      placeholder="Midterm Exam, Final Test, Chapter 5 Quiz, etc." 
                      type="text" 
                      value={formData.examName} 
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
              {/* File upload section - Modified to span both columns */}
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="fileUpload"
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium cursor-pointer",
                      isProcessingFile ? "opacity-50 cursor-not-allowed" : "",
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-black"
                    )}
                  >
                    {isProcessingFile ? "Processing..." : "Upload File"}
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingFile}
                  />
                </div>

                {selectedMaterial && (
                  <div className={cn(
                    "p-3 rounded-md",
                    theme === "dark" ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <p className="font-medium">Selected: {selectedMaterial.name}</p>
                    {isProcessingFile && (
                      <div className="flex items-center mt-2">
                        <span className="mr-2">Processing content...</span>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Uploaded files section */}
                {uploadedFiles.length > 0 && (
                  <div className={cn(
                    "p-3 rounded-md",
                    theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                  )}>
                    <h4 className="font-medium mb-2">Uploaded Files:</h4>
                    <ul className="space-y-2">
                      {uploadedFiles.map(file => (
                        <li key={file.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeUploadedFile(file.id)}
                            className={cn(
                              "p-1 rounded-full",
                              theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-200"
                            )}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                            
                            <h2 className="text-2xl font-bold mb-4">{formData.examName}</h2>
                            
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
                          onClick={async (event) => {
                            try {
                              // Show loading state
                              const saveButton = event.currentTarget;
                              const originalText = saveButton.innerText;
                              saveButton.innerText = "Saving...";
                              saveButton.disabled = true;
                              
                              // Generate the PDF
                              const pdfDoc = createPDFVersion(examResult);
                              const pdfBlob = pdfDoc.output('blob');
                              const fileName = `${formData.examName}.pdf`;
                              
                              // Save the PDF locally
                              pdfDoc.save(fileName);
                              
                              // Upload the PDF to the classroom
                              const uploadSuccess = await uploadPDFToClassroom(pdfBlob, formData.classroom, fileName);
                              
                              // Show success message if upload was successful
                              if (uploadSuccess) {
                                alert(`PDF saved successfully to ${classrooms.find(c => c.id.toString() === formData.classroom.toString())?.name || 'selected classroom'}.`);
                                // Hide the button after successful upload
                                saveButton.style.display = 'none';
                              } else {
                                // Only restore button state if upload failed
                                saveButton.innerText = originalText;
                                saveButton.disabled = false;
                              }
                            } catch (err) {
                              console.error("Error saving PDF:", err);
                              alert("There was an error creating or saving the PDF. Please try again.");
                            } finally {
                              // Restore button state
                              const saveButton = event.currentTarget;
                              if (saveButton) {
                                saveButton.innerText = "Save as PDF";
                                saveButton.disabled = false;
                              }
                            }
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

            {showMaterialsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={cn(
                  "p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto",
                  theme === "dark" ? "bg-zinc-900" : "bg-white"
                )}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-black")}>
                      Select Material
                    </h2>
                    <button
                      onClick={() => setShowMaterialsModal(false)}
                      className={cn(
                        "p-2 rounded-full",
                        theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-200"
                      )}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className={cn(
                    "border rounded-lg p-4 mb-4 overflow-auto max-h-[60vh]",
                    theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
                  )}>
                    {userMaterials.length > 0 ? (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {userMaterials.map((material) => (
                          <li key={material.id} className="py-3">
                            <button
                              onClick={() => handleMaterialSelect(material)}
                              className={cn(
                                "w-full text-left p-3 rounded-md hover:bg-opacity-10 flex items-center",
                                theme === "dark"
                                  ? "hover:bg-white text-white"
                                  : "hover:bg-zinc-300 text-black"
                              )}
                            >
                              <div className="flex-1">
                                <p className="font-medium">{material.name}</p>
                                <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                                  {new Date(material.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className={cn(
                                "px-2 py-1 rounded text-xs",
                                material.file.endsWith('.pdf')
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : material.file.endsWith('.docx')
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              )}>
                                {material.file.split('.').pop().toUpperCase()}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn("text-center py-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        No materials found.
                      </p>
                    )}
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
