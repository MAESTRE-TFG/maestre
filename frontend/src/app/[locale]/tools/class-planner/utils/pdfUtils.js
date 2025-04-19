import { jsPDF } from "jspdf";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";

/**
 * Format the plan text for display
 * @param {string} planText - The raw plan text
 * @returns {string} Formatted plan text with HTML
 */
export const formatPlanText = (planText) => {
  if (!planText) return "";

  // Replace newlines with HTML line breaks
  let formattedText = planText.replace(/\n/g, "<br />");

  // Make headings bold
  formattedText = formattedText.replace(
    /^(Lesson \d+:.*?)(?=<br \/>)/gim,
    "<strong>$1</strong>"
  );
  formattedText = formattedText.replace(
    /^(Objectives:.*?)(?=<br \/>)/gim,
    "<strong>$1</strong>"
  );
  formattedText = formattedText.replace(
    /^(Materials:.*?)(?=<br \/>)/gim,
    "<strong>$1</strong>"
  );
  formattedText = formattedText.replace(
    /^(Activities:.*?)(?=<br \/>)/gim,
    "<strong>$1</strong>"
  );
  formattedText = formattedText.replace(
    /^(Assessment:.*?)(?=<br \/>)/gim,
    "<strong>$1</strong>"
  );

  return formattedText;
};

/**
 * Create a PDF version of the plan
 * @param {string} planText - The plan text
 * @param {Object} formData - Form data for the plan
 * @returns {Blob} PDF file as a Blob
 */
export const createPDFVersion = (planText, formData) => {
  const doc = new jsPDF();
  
  // Set up document
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(formData.planName || "Lesson Plan", 105, 20, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Subject: ${formData.subject}`, 20, 35);
  doc.text(`Theme: ${formData.theme}`, 20, 42);
  doc.text(`Number of Lessons: ${formData.numLessons}`, 20, 49);
  
  // Add a line
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
  
  // Add plan content
  doc.setFontSize(10);
  
  // Split text into lines that fit the page width
  const textLines = doc.splitTextToSize(planText, 170);
  
  // Add lines to document with proper spacing
  let y = 65;
  for (let i = 0; i < textLines.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(textLines[i], 20, y);
    y += 5;
  }
  
  return doc.output("blob");
};

/**
 * Upload a PDF plan to the classroom
 * @param {Blob} pdfBlob - The PDF file as a Blob
 * @param {string} classroomId - The classroom ID
 * @param {string} planName - The name of the plan
 * @param {string} token - Authentication token
 * @returns {Object} Upload result
 */
export const uploadPDFToClassroom = async (pdfBlob, classroomId, planName, token) => {
  try {
    const formData = new FormData();
    formData.append("file", pdfBlob, `${planName || "Lesson Plan"}.pdf`);
    formData.append("classroom", classroomId);
    formData.append("name", planName || "Lesson Plan");
    
    const response = await axios.post(
      `${getApiBaseUrl()}/api/materials/`,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error(error.response?.data?.message || "Error uploading PDF");
  }
};