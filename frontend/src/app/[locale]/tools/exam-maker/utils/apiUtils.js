import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";

// Upload PDF to classroom
export const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName, token) => {
  if (!classroomId) {
    throw new Error("Please select a classroom before saving the PDF.");
  }
  
  if (!pdfBlob || !(pdfBlob instanceof Blob)) {
    throw new Error("Invalid PDF data. Please regenerate the exam.");
  }
  
  const formData = new FormData();
  formData.append('name', fileName);
  formData.append('file', pdfBlob, fileName);
  formData.append('classroom', classroomId);

  try {
    if (!token) {
      throw new Error("You must be logged in to save materials.");
    }
    
    console.log("Uploading PDF:", { 
      classroomId, 
      fileName, 
      blobSize: pdfBlob.size, 
      blobType: pdfBlob.type 
    });
    
    const response = await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}`
      }
    });
    
    console.log("Upload response:", response.data);
    return true;
  } catch (error) {
    console.error("PDF upload error:", error);
    
    if (error.response) {
      console.error("Response error data:", error.response.data);
      
      if (error.response.status === 400) {
        const errorMsg = error.response.data && error.response.data.error
          ? error.response.data.error
          : error.response.data && typeof error.response.data === 'object'
            ? JSON.stringify(error.response.data)
            : "Failed to upload file. Maximum limit reached.";
        throw new Error(errorMsg);
      } else if (error.response.status === 401) {
        throw new Error("Authentication error. Please log in again.");
      } else {
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(`Upload error: ${error.message}`);
    }
  }
};

// Process uploaded file
export const processUploadedFile = async (file, token) => {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new Error("Only DOCX files are supported.");
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds the 5MB limit.");
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${getApiBaseUrl()}:8000/api/materials/extract-text/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      }
    );

    if (response.data && response.data.text) {
      return {
        name: file.name,
        content: response.data.text,
        id: Date.now()
      };
    } else {
      throw new Error("Failed to extract text from file.");
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.data.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Process material from classroom
export const processMaterialFromClassroom = async (material, token) => {
  if (!material.file.toLowerCase().endsWith('.docx')) {
    throw new Error("Only DOCX files are supported for exam generation.");
  }

  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/api/materials/extract-text-from-url/`,
      {
        file_url: material.file,
        material_id: material.id
      },
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    );

    if (response.data && response.data.text) {
      return {
        name: material.name,
        content: response.data.text,
        id: Date.now(),
        isFromClassroom: true,
        materialId: material.id
      };
    } else {
      throw new Error("Failed to extract text from the selected material.");
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.data.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Generate exam using Ollama
export const generateExam = async (prompt, model = "llama3.2:3b") => {
  try {
    const response = await axios.post(`${getApiBaseUrl()}:11434/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });
    
    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      throw new Error("Invalid response from Ollama");
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`Ollama error: ${error.response.data.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error("Network error. Please check if Ollama is running.");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};