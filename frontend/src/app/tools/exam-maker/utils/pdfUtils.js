import jsPDF from "jspdf";

// Format exam text for display
export const formatExamText = (text) => {
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

// Create a document-friendly version of the exam
export const createDocumentVersion = (examText) => {
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

// Create a PDF version of the exam
export const createPDFVersion = async (examText, subject = "Exam") => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add a title to the PDF
  doc.setFontSize(18);
  doc.text(`${subject} Exam`, 105, 20, { align: 'center' });

  // Create a temporary DOM element to render the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = formatExamText(examText);

  // Convert HTML to plain text for basic formatting
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // Set font size for content
  doc.setFontSize(12);

  // Calculate available height on first page (accounting for title)
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margins = {
    top: 40, // Start below the title
    bottom: 20,
    left: 15,
    right: 15
  };

  const availableWidth = pageWidth - margins.left - margins.right;
  let yPosition = margins.top;

  // Split text into lines that fit on the page width
  const textLines = doc.splitTextToSize(plainText, availableWidth);

  // Calculate line height
  const lineHeight = 7; // Approximate height in mm for font size 12

  // Add lines to pages
  for (let i = 0; i < textLines.length; i++) {
    // Check if we need a new page
    if (yPosition + lineHeight > pageHeight - margins.bottom) {
      doc.addPage();
      yPosition = margins.top - 20; // Reset position on new page, higher up since no title
    }

    // Add the line
    doc.text(textLines[i], margins.left, yPosition);
    yPosition += lineHeight;
  }

  // Add footer to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated with Maestre AI Exam Generator - Page ${i} of ${totalPages}`,
      105,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc;
};