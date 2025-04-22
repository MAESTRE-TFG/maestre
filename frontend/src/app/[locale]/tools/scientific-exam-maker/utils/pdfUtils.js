/**
 * Utilities for converting scientific exams to PDF format
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { processExamText, processDiagrams } from './latexUtils';

// Configuration for PDF generation
const PDF_CONFIG = {
  format: 'a4',
  orientation: 'portrait',
  unit: 'mm',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  fontSize: {
    title: 16,
    subtitle: 14,
    question: 12,
    text: 10
  }
};

/**
 * Converts a scientific exam to PDF format
 * @param {string} examText - The complete exam text
 * @param {Object} options - Options for PDF generation
 * @returns {Blob} - PDF file as a Blob
 */
export const convertExamToPdf = async (examText, options = {}) => {
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: options.orientation || PDF_CONFIG.orientation,
    unit: PDF_CONFIG.unit,
    format: PDF_CONFIG.format
  });
  
  // Process the exam text to convert mathematical notations to LaTeX
  const processedText = processExamText(examText);
  
  // Process diagrams in the exam text
  const processedTextWithDiagrams = processDiagrams(processedText);
  
  // Extract title and subtitle
  const lines = processedTextWithDiagrams.split('\n');
  const title = lines[0] || 'Scientific Exam';
  const subtitle = lines[1] || '';
  
  // Remove title and subtitle from the text
  const contentText = lines.slice(2).join('\n');
  
  // Add title and subtitle to the PDF
  pdf.setFontSize(PDF_CONFIG.fontSize.title);
  pdf.text(title, PDF_CONFIG.margins.left, PDF_CONFIG.margins.top);
  
  pdf.setFontSize(PDF_CONFIG.fontSize.subtitle);
  pdf.text(subtitle, PDF_CONFIG.margins.left, PDF_CONFIG.margins.top + 10);
  
  // Split the content into questions
  const questions = contentText.split(/(\d+\)\s+\[\d+\s+points\])/g).filter(Boolean);
  
  // Add questions to the PDF
  let y = PDF_CONFIG.margins.top + 20;
  
  for (let i = 0; i < questions.length; i += 2) {
    const questionHeader = questions[i] || '';
    const questionContent = questions[i + 1] || '';
    
    // Check if we need to add a new page
    if (y > pdf.internal.pageSize.height - PDF_CONFIG.margins.bottom) {
      pdf.addPage();
      y = PDF_CONFIG.margins.top;
    }
    
    // Add question header
    pdf.setFontSize(PDF_CONFIG.fontSize.question);
    pdf.text(questionHeader, PDF_CONFIG.margins.left, y);
    y += 7;
    
    // Add question content
    pdf.setFontSize(PDF_CONFIG.fontSize.text);
    
    // Split the content into lines to handle line breaks
    const contentLines = questionContent.split('\n');
    
    for (const line of contentLines) {
      // Check if we need to add a new page
      if (y > pdf.internal.pageSize.height - PDF_CONFIG.margins.bottom) {
        pdf.addPage();
        y = PDF_CONFIG.margins.top;
      }
      
      // Add the line to the PDF
      pdf.text(line, PDF_CONFIG.margins.left, y);
      y += 5;
    }
    
    // Add some space between questions
    y += 5;
  }
  
  // Return the PDF as a Blob
  return pdf.output('blob');
};

/**
 * Renders LaTeX formulas in the PDF
 * Note: This is a placeholder function. In a real implementation,
 * you would need to use a library that can render LaTeX in PDFs.
 * @param {jsPDF} pdf - The PDF document
 * @param {string} formula - The LaTeX formula
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
const renderLatexFormula = (pdf, formula, x, y) => {
  // This is a placeholder for LaTeX rendering
  // In a real implementation, you would need to:
  // 1. Convert the LaTeX formula to an image or SVG
  // 2. Add the image to the PDF
  
  // For now, we'll just add the formula as text
  pdf.text(`[LaTeX: ${formula}]`, x, y);
};

/**
 * Creates a download link for the PDF
 * @param {Blob} pdfBlob - PDF file as a Blob
 * @param {string} filename - Name of the file to download
 */
export const downloadPdf = (pdfBlob, filename = 'scientific-exam.pdf') => {
  // Create a URL for the Blob
  const url = URL.createObjectURL(pdfBlob);
  
  // Create a download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Converts a scientific exam to PDF and downloads it
 * @param {string} examText - The complete exam text
 * @param {string} filename - Name of the file to download
 * @param {Object} options - Options for PDF generation
 */
export const convertAndDownloadPdf = async (examText, filename = 'scientific-exam.pdf', options = {}) => {
  const pdfBlob = await convertExamToPdf(examText, options);
  downloadPdf(pdfBlob, filename);
};