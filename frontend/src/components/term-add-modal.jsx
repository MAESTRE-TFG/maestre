import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";

const TermAddModal = ({ 
  showModal, 
  setShowModal, 
  onTermCreate,
  isProcessing,
  availableTermTypes
}) => {
  const { theme } = useTheme();
  const t = useTranslations("TermsPage");
  
  const [selectedTermType, setSelectedTermType] = useState("");
  const [mdFile, setMdFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [version, setVersion] = useState("");
  const [alert, setAlert] = useState(null);
  const [isDraggingMd, setIsDraggingMd] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleMdFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.md')) {
      setMdFile(file);
    } else {
      showAlert("error", t("alerts.noMd"));
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.pdf')) {
      setPdfFile(file);
    } else {
      showAlert("error", t("alerts.noPdf"));
    }
  };

  const handleDragEnterMd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMd(true);
  }, []);

  const handleDragLeaveMd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMd(false);
  }, []);

  const handleDragOverMd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingMd) {
      setIsDraggingMd(true);
    }
  }, [isDraggingMd]);

  const handleDropMd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMd(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.md')) {
        setMdFile(file);
      } else {
        showAlert("error", t("alerts.noMd"));
      }
    }
  }, [t]);

  const handleDragEnterPdf = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(true);
  }, []);

  const handleDragLeavePdf = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(false);
  }, []);

  const handleDragOverPdf = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingPdf) {
      setIsDraggingPdf(true);
    }
  }, [isDraggingPdf]);

  const handleDropPdf = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.pdf')) {
        setPdfFile(file);
      } else {
        showAlert("error", t("alerts.noPdf"));
      }
    }
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTermType) {
      showAlert("error", t("alerts.termTypeError"));
      return;
    }

    if (!version) {
      showAlert("error", t("alerts.noVersion"));
      return;
    }

    // Add proper version validation to prevent XSS and enforce length limits
    const versionRegex = /^[a-zA-Z0-9\s._-]+$/;
    if (!versionRegex.test(version)) {
      showAlert("error", t("alerts.invalidVersionFormat"));
      return;
    }

    // Add version length validation (max 20 characters as per model)
    if (version.length > 20) {
      showAlert("error", t("alerts.versionTooLong"));
      return;
    }

    if (!mdFile) {
      showAlert("error", t("alerts.noMd"));
      return;
    }

    if (!pdfFile) {
      showAlert("error", t("alerts.noPdf"));
      return;
    }

    // Add file size validations (50MB limit is a common practice)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 10MB in bytes
    
    if (mdFile.size > MAX_FILE_SIZE) {
      showAlert("error", t("alerts.mdFileTooLarge"));
      return;
    }

    if (pdfFile.size > MAX_FILE_SIZE) {
      showAlert("error", t("alerts.pdfFileTooLarge"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tag", selectedTermType);
      formData.append("version", version.trim());
      formData.append("content", mdFile, mdFile.name);
      formData.append("pdf_content", pdfFile, pdfFile.name);
      
      const termTypeDisplay = availableTermTypes.find(type => type.value === selectedTermType)?.label || selectedTermType;
      const termName = `${termTypeDisplay} - Version ${version.trim()}`;
      formData.append("name", termName);
  
      await onTermCreate(formData);
      resetForm();
    } catch (error) {
      showAlert("error", error.message || t("alerts.createError"));
    }
  };

  const resetForm = () => {
    setSelectedTermType("");
    setMdFile(null);
    setPdfFile(null);
    setVersion("");
    setAlert(null);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={() => {
        setShowModal(false);
        resetForm();
      }}
    >
      <div
        className={cn(
          "p-3 rounded-lg max-w-md w-full mx-4 shadow-lg",
          theme === "dark" ? "bg-gray-800" : "bg-white"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="flex flex-col items-center justify-center mb-2">
          <div className="flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <h3
            className={cn(
              "text-base font-bold text-center",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {t("addForm.title")}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className={cn("block text-sm font-bold mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.termTypeLabel")}
            </label>
            <select
              value={selectedTermType}
              onChange={(e) => setSelectedTermType(e.target.value)}
              className={cn(
                "shadow appearance-none border rounded-md w-full py-1.5 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500",
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
              )}
              required
            >
              <option value="">{t("addForm.selectTermType")}</option>
              {availableTermTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className={cn("block text-sm font-bold mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.versionLabel")}
            </label>
            <Input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder={t("addForm.versionPlaceholder")}
              className={cn(
                "w-full",
                theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600" : ""
              )}
              required
            />
          </div>

          <div className="mb-2">
            <label className={cn("block text-sm font-bold mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.markdownContentLabel")}
            </label>
            <div
              className={cn(
                "border-2 border-dashed rounded-md p-3 text-center min-h-[90px] flex flex-col items-center justify-center",
                theme === "dark" ? "border-gray-600" : "border-gray-300",
                mdFile ? "bg-green-500/10" : "",
                isDraggingMd ? "border-primary bg-primary/5" : ""
              )}
              onDragEnter={handleDragEnterMd}
              onDragOver={handleDragOverMd}
              onDragLeave={handleDragLeaveMd}
              onDrop={handleDropMd}
            >
              {mdFile ? (
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {mdFile.name}
                  </p>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {(mdFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMdFile(null);
                    }}
                    className="mt-2 px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:underline"
                    type="button"
                  >
                    {t("buttons.removeFile")}
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {isDraggingMd ? t("dropIt") : t("dragOrDrop")}
                  </p>
                  <label className={cn(
                    "px-3 py-1 rounded-full cursor-pointer transition-colors inline-block",
                    theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-primary text-white hover:bg-primary/90"
                  )}>
                    {t("browseFiles")}
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handleMdFileChange}
                      accept=".md"
                    />
                  </label>
                  <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {t("supportedMdFormat")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className={cn("block text-sm font-bold mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {t("addForm.pdfContentLabel")}
            </label>
            <div
              className={cn(
                "border-2 border-dashed rounded-md p-3 text-center min-h-[90px] flex flex-col items-center justify-center",
                theme === "dark" ? "border-gray-600" : "border-gray-300",
                pdfFile ? "bg-green-500/10" : "",
                isDraggingPdf ? "border-primary bg-primary/5" : ""
              )}
              onDragEnter={handleDragEnterPdf}
              onDragOver={handleDragOverPdf}
              onDragLeave={handleDragLeavePdf}
              onDrop={handleDropPdf}
            >
              {pdfFile ? (
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {pdfFile.name}
                  </p>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {(pdfFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfFile(null);
                    }}
                    className="mt-2 px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:underline"
                    type="button"
                  >
                    {t("buttons.removeFile")}
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {isDraggingPdf ? t("dropIt") : t("dragOrDrop")}
                  </p>
                  <label className={cn(
                    "px-3 py-1 rounded-full cursor-pointer transition-colors inline-block",
                    theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-primary text-white hover:bg-primary/90"
                  )}>
                    {t("browseFiles")}
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handlePdfFileChange}
                      accept=".pdf"
                    />
                  </label>
                  <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {t("supportedPdfFormat")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              disabled={isProcessing}
              className="btn-secondary py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {t("buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isProcessing || !selectedTermType || !version || !mdFile || !pdfFile}
              className="btn-success py-2 rounded-full transition-all duration-300 flex items-center justify-center flex-1"
            >
              {isProcessing ? t("buttons.creating") : t("buttons.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TermAddModal;