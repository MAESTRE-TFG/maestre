import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";
import { getLLMApiUrl } from "@/lib/api";

// Upload PDF to classroom
export const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName, token, showAlert, t) => {

  if (!classroomId) {
    showAlert("error", t("alerts.missingClassroom"));
    return false;
  }

  if (!pdfBlob || !(pdfBlob instanceof Blob)) {
    showAlert("error", t("alerts.pdfSaveFailed", { error: t("alerts.unknownError") })); 
    return false;
  }

  const formData = new FormData();
  formData.append("name", fileName);
  formData.append("file", pdfBlob, fileName);
  formData.append("classroom", classroomId);

  try {
    if (!token) {
      showAlert("error", t("alerts.fetchClassroomsError"));
      return false;
    }

    await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
    });

    showAlert("success", t("alerts.pdfSavedSuccess"));
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMsg =
          error.response.data && error.response.data.error
            ? error.response.data.error
            : t("alerts.pdfSaveFailed", { error: t("alerts.unknownError") });
        showAlert("error", errorMsg);
      } else if (error.response.status === 401) {
        showAlert("error", t("alerts.fetchClassroomsError"));
      } else {
        showAlert("error", t("alerts.pdfSaveFailed", { error: `${error.response.status} - ${error.response.statusText}` }));
      }
    } else if (error.request) {
      showAlert("error", t("alerts.fetchMaterialsError"));
    } else {
      showAlert("error", t("alerts.pdfSaveFailed", { error: error.message }));
    }
    return false;
  }
};

// Process uploaded file
export const processUploadedFile = async (file, token, showAlert) => {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    showAlert("error", t("alerts.unsupportedFileType"));
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    showAlert("error", t("alerts.fileProcessedSuccess"));
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
      showAlert("success", t("alerts.fileProcessedSuccess"));
      return {
        name: file.name,
        content: response.data.text,
        id: Date.now(),
      };
    } else {
      showAlert("error", t("alerts.fetchMaterialsError"));
      return null;
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", t("alerts.fetchMaterialsError"));
    } else if (error.request) {
      showAlert("error", t("alerts.fetchMaterialsError"));
    } else {
      showAlert("error", t("alerts.fetchMaterialsError"));
    }
    return null;
  }
};

// Process material from classroom
export const processMaterialFromClassroom = async (material, token, showAlert) => {
  if (!material.file.toLowerCase().endsWith(".docx")) {
    showAlert("error", t("alerts.unsupportedFileType"));
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
      showAlert("success", t("alerts.materialProcessedSuccess"));
      return {
        name: material.name,
        content: response.data.text,
        id: Date.now(),
        isFromClassroom: true,
        materialId: material.id,
      };
    } else {
      showAlert("error", t("alerts.fetchMaterialsError"));
      return null;
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", t("alerts.fetchMaterialsError")); 
    } else if (error.request) {
      showAlert("error", t("alerts.fetchMaterialsError")); 
    } else {
      showAlert("error", t("alerts.fetchMaterialsError")); 
    }
    return null;
  }
};

// Generate exam using Ollama
export const generateExam = async (prompt, model, t, showAlert) => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: model,
      prompt: prompt,
      stream: false,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: false
    });

    if (response.data?.response) {
      showAlert("success", t("alerts.examGeneratedSuccess"));
      return response.data.response;
    }
    showAlert("error", t("alerts.examGenerationFailed"));
    return null;
    
  } catch (error) {
    console.error('Ollama API Error:', error);
    let errorMessage = t("alerts.examGenerationFailed");
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = "Ollama service not running. Please start Ollama first.";
    } else if (error.response?.status === 404) {
      errorMessage = "Ollama API endpoint not found. Check your Ollama version.";
    } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
      errorMessage = "CORS issue detected. Please start Ollama with: 'ollama serve --cors'";
    } else {
      errorMessage = `${t("alerts.examGenerationFailed")}: ${error.message}`;
    }

    showAlert("error", errorMessage);
    return null;
  }
};