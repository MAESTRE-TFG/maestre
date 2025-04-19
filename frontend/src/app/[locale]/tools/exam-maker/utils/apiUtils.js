import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";
import { getLLMApiUrl } from "@/lib/api";

// Upload PDF to classroom
export const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName, token, showAlert) => {
  if (!classroomId) {
    showAlert("error", "Missing classroom");
    return false;
  }

  if (!pdfBlob || !(pdfBlob instanceof Blob)) {
    showAlert("error", "Failed to save PDF: Unknown error");
    return false;
  }

  const formData = new FormData();
  formData.append("name", fileName);
  formData.append("file", pdfBlob, fileName);
  formData.append("classroom", classroomId);

  try {
    if (!token) {
      showAlert("error", "Failed to fetch classrooms");
      return false;
    }

    await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
    });

    showAlert("success", "PDF saved successfully");
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMsg =
          error.response.data && error.response.data.error
            ? error.response.data.error
            : "Failed to save PDF: Unknown error";
        showAlert("error", errorMsg);
      } else if (error.response.status === 401) {
        showAlert("error", "Failed to fetch classrooms");
      } else {
        showAlert("error", `Failed to save PDF: ${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      showAlert("error", "Failed to fetch materials");
    } else {
      showAlert("error", `Failed to save PDF: ${error.message}`);
    }
    return false;
  }
};

// Process uploaded file
export const processUploadedFile = async (file, token, showAlert) => {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    showAlert("error", "Unsupported file type");
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    showAlert("error", "File processed successfully");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/api/materials/extract-text/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.data && response.data.text) {
      showAlert("success", "File processed successfully");
      return {
        name: file.name,
        content: response.data.text,
        id: Date.now(),
      };
    } else {
      showAlert("error", "Failed to fetch materials");
      return null;
    }
  } catch (error) {
    showAlert("error", "Failed to fetch materials");
    return null;
  }
};

// Process material from classroom
export const processMaterialFromClassroom = async (material, token, showAlert) => {
  if (!material.file.toLowerCase().endsWith(".docx")) {
    showAlert("error", "Unsupported file type");
    return null;
  }

  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/api/materials/extract-text-from-url/`,
      {
        file_url: material.file,
        material_id: material.id,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.data && response.data.text) {
      showAlert("success", "Material processed successfully");
      return {
        name: material.name,
        content: response.data.text,
        id: Date.now(),
        isFromClassroom: true,
        materialId: material.id,
      };
    } else {
      showAlert("error", "Failed to fetch materials");
      return null;
    }
  } catch (error) {
    showAlert("error", "Failed to fetch materials");
    return null;
  }
};

// Generate exam using Ollama
export const generateExam = async (prompt, model = "llama3.2:3b", showAlert) => {
  try {
    const response = await axios.post(`${getLLMApiUrl()}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });

    if (response.data && response.data.response) {
      showAlert("success", "Exam generated successfully");
      return response.data.response;
    } else {
      showAlert("error", "Failed to generate exam");
      return null;
    }
  } catch (error) {
    showAlert("error", "Failed to generate exam");
    return null;
  }
};