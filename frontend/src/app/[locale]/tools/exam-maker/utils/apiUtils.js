import axios from "axios";
import { getApiBaseUrl } from "@/lib/api";

// Upload PDF to classroom
export const uploadPDFToClassroom = async (pdfBlob, classroomId, fileName, token, showAlert, t) => {
  if (!classroomId) {
    showAlert("error", t("ExamMaker.alerts.missingClassroom"));
    return false;
  }

  if (!pdfBlob || !(pdfBlob instanceof Blob)) {
    showAlert("error", t("ExamMaker.alerts.pdfSaveFailed", { error: t("ExamMaker.alerts.unknownError") })); 
    return false;
  }

  const formData = new FormData();
  formData.append("name", fileName);
  formData.append("file", pdfBlob, fileName);
  formData.append("classroom", classroomId);

  try {
    if (!token) {
      showAlert("error", t("ExamMaker.alerts.fetchClassroomsError"));
      return false;
    }

    await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
    });

    showAlert("success", t("ExamMaker.alerts.pdfSavedSuccess"));
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        const errorMsg =
          error.response.data && error.response.data.error
            ? error.response.data.error
            : t("ExamMaker.alerts.pdfSaveFailed", { error: t("ExamMaker.alerts.unknownError") });
        showAlert("error", errorMsg);
      } else if (error.response.status === 401) {
        showAlert("error", t("ExamMaker.alerts.fetchClassroomsError"));
      } else {
        showAlert("error", t("ExamMaker.alerts.pdfSaveFailed", { error: `${error.response.status} - ${error.response.statusText}` }));
      }
    } else if (error.request) {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
    } else {
      showAlert("error", t("ExamMaker.alerts.pdfSaveFailed", { error: error.message }));
    }
    return false;
  }
};

// Process uploaded file
export const processUploadedFile = async (file, token, showAlert, t) => {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    showAlert("error", t("ExamMaker.alerts.unsupportedFileType"));
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    showAlert("error", t("ExamMaker.alerts.fileProcessedSuccess"));
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${getApiBaseUrl()}:8000/api/materials/extract-text/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.data && response.data.text) {
      showAlert("success", t("ExamMaker.alerts.fileProcessedSuccess"));
      return {
        name: file.name,
        content: response.data.text,
        id: Date.now(),
      };
    } else {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
      return null;
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
    } else if (error.request) {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
    } else {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
    }
    return null;
  }
};

// Process material from classroom
export const processMaterialFromClassroom = async (material, token, showAlert, t) => {
  if (!material.file.toLowerCase().endsWith(".docx")) {
    showAlert("error", t("ExamMaker.alerts.unsupportedFileType"));
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
      showAlert("success", t("ExamMaker.alerts.materialProcessedSuccess"));
      return {
        name: material.name,
        content: response.data.text,
        id: Date.now(),
        isFromClassroom: true,
        materialId: material.id,
      };
    } else {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError"));
      return null;
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError")); 
    } else if (error.request) {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError")); 
    } else {
      showAlert("error", t("ExamMaker.alerts.fetchMaterialsError")); 
    }
    return null;
  }
};

// Generate exam using Ollama
export const generateExam = async (prompt, model = "llama3.2:3b", showAlert, t) => {
  try {
    const response = await axios.post(`${getApiBaseUrl()}:11434/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });

    if (response.data && response.data.response) {
      showAlert("success", t("ExamMaker.alerts.examGeneratedSuccess")); 
      return response.data.response;
    } else {
      showAlert("error", t("ExamMaker.alerts.examGenerationFailed")); 
      return null;
    }
  } catch (error) {
    if (error.response) {
      showAlert("error", t("ExamMaker.alerts.examGenerationFailed")); 
    } else if (error.request) {
      showAlert("error", t("ExamMaker.alerts.examGenerationFailed")); 
    } else {
      showAlert("error", t("ExamMaker.alerts.examGenerationFailed")); 
    }
    return null;
  }
};