import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";
import { getLLMApiUrl } from "@/lib/api";


// Upload PDF to classroom
export const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName, token, addAlert) => {
  if (!classroomId) {
    addAlert("error", "Missing classroom");
    return false;
  }

  if (!pdfBlob || !(pdfBlob instanceof Blob)) {
    addAlert("error", "Invalid PDF data");
    return false;
  }

  const formData = new FormData();
  formData.append("name", fileName);
  formData.append("file", pdfBlob, fileName);
  formData.append("classroom", classroomId);

  try {
    if (!token) {
      addAlert("error", "Authentication required");
      return false;
    }

    await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
    });

    addAlert("success", "PDF uploaded successfully");
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMsg =
          error.response.data && error.response.data.error
            ? error.response.data.error
            : "Unknown error occurred";
        addAlert("error", errorMsg);
      } else if (error.response.status === 401) {
        addAlert("error", "Authentication required");
      } else {
        addAlert("error", `${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      addAlert("error", "Network error. Please check your connection.");
    } else {
      addAlert("error", error.message);
    }
    return false;
  }
};

// Process uploaded file
export const processUploadedFile = async (file, token) => {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    addAlert("error", "Only DOCX files are supported");
  }

  if (file.size > 5 * 1024 * 1024) {
    addAlert("error", "File size exceeds 5MB limit");
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
      return {
        name: file.name,
        content: response.data.text,
        id: Date.now(),
      };
    } else {
      addAlert("error", "Failed to process file");
    }
  } catch (error) {
    if (error.response) {
      addAlert("error", "Server error while processing file");
    } else if (error.request) {
      addAlert("error", "Network error. Please check your connection.");
    } else {
      addAlert("error", error.message);
    }
  }
};

// Process material from classroom
export const processMaterialFromClassroom = async (material, token) => {
  if (!material.file.toLowerCase().endsWith(".docx")) {
    addAlert("error", "Only DOCX files are supported");
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
      return {
        name: material.name,
        content: response.data.text,
        id: Date.now(),
        isFromClassroom: true,
        materialId: material.id,
      };
    } else {
      addAlert("error", "Failed to process material");
    }
  } catch (error) {
    if (error.response) {
      addAlert("error", "Server error while processing material");
    } else if (error.request) {
      addAlert("error", "Network error. Please check your connection.");
    } else {
      addAlert("error", error.message);
    }
  }
};

// Generate plan using Ollama
export const generatePlan = async (prompt, model = "llama3.2:3b") => {
  try {
    const response = await axios.post(`${getLLMApiUrl()}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });

    if (response.data && response.data.response) {
      // Return an object with a plan property instead of the raw response
      return {
        plan: response.data.response
      };
    } else {
      addAlert("error", "Failed to generate lesson plan");
    }
  } catch (error) {
    if (error.response) {
      addAlert("error", "Server error while generating plan");
    } else if (error.request) {
      addAlert("error", "Network error. Please check your connection.");
    } else {
      addAlert("error", error.message);
    }
  }
};