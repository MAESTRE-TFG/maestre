import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  classroomId,
  onUploadComplete
}) => {
  const t = useTranslations("FileUpload");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [fileSizes, setFileSizes] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleEdit = async (e, file) => {
    e.stopPropagation();
    setFileToEdit(file);
    setNewFileName(file.name);
    setShowEditModal(true);
  };

  // Add this function to handle the name update
  const confirmEdit = async () => {
    try {
      // Get the original file extension
      const originalExtension = fileToEdit.name.split('.').pop();

      // Make sure the new name has the same extension
      let updatedFileName = newFileName;
      if (!newFileName.endsWith(`.${originalExtension}`)) {
        // If user removed or changed extension, restore it
        const nameWithoutExtension = newFileName.split('.')[0];
        updatedFileName = `${nameWithoutExtension}.${originalExtension}`;
      }

      const response = await axios.patch(`${getApiBaseUrl()}/api/materials/${fileToEdit.id}/`,
        { name: updatedFileName },
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem("authToken")}`,
          }
        }
      );

      // Update the file in the files state
      setFiles(prevFiles =>
        prevFiles.map(f => f.id === fileToEdit.id ? { ...f, name: updatedFileName } : f)
      );

      // If we had to fix the extension, update the displayed value
      if (updatedFileName !== newFileName) {
        setNewFileName(updatedFileName);
      }
      showAlert("success", t("alerts.editSuccess"));
    } catch (error) {
      showAlert("error", t("alerts.editError"));
    } finally {
      setShowEditModal(false);
      setFileToEdit(null);
    }
  };


  // Add this function at the top of your component
  const getFileSize = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      return size ? parseInt(size) : null;
    } catch (error) {
      showAlert("error", t("alerts.sizeError"));
      return null;
    }
  };

  useEffect(() => {
    const fetchFileSizes = async () => {
      const sizes = {};
      for (const file of files) {
        if (file.file && typeof file.file === 'string') {
          const fileUrl = file.file.startsWith('http')
            ? file.file
            : `${getApiBaseUrl()}${file.file}`;
          const size = await getFileSize(fileUrl);
          if (size) {
            sizes[file.id] = size;
          }
        }
      }
      setFileSizes(sizes);
    };

    if (files.length > 0) {
      fetchFileSizes();
    }
  }, [files]);
  
  // Fetch existing files when component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/materials/`, {
          params: { classroom_id: classroomId },
          headers: {
            'Authorization': `Token ${localStorage.getItem("authToken")}`,
          }
        });
        setFiles(response.data);
      } catch (error) {
        showAlert("error", t("fetchMaterialsError"));
      }
    };
  
    if (classroomId) {
      fetchFiles();
    }
  }, [classroomId]);
  
  const handleFileChange = async (newFiles) => {
    try {
      setIsUploading(true);
      const file = newFiles[0]; // Since multiple is false, we only handle the first file

      // Truncate the file name to 30 characters if it exceeds that length
      let truncatedFileName = file.name;
      if (file.name.length > 30) {
        const extension = file.name.split('.').pop();
        truncatedFileName = `${file.name.substring(0, 30 - extension.length - 1)}.${extension}`;
      }

      const formData = new FormData();
      formData.append('name', truncatedFileName);
      formData.append('file', file);
      formData.append('classroom', classroomId);

      await axios.post(`${getApiBaseUrl()}/api/materials/`, formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem("authToken")}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      // Call the onChange callback if provided
      onChange && onChange(newFiles);
      
      // Call the onUploadComplete callback to refresh the materials list
      onUploadComplete && onUploadComplete();
      showAlert("success", t("alerts.uploadSuccess"));
      
    } catch (error) {
      // Error handling
      if (error.response) {
        const errorMsg = error.response.data && error.response.data.error
          ? error.response.data.error
          : t("alerts.uploadError");
        showAlert('error', errorMsg);
      } else if (error.request) {
        showAlert('error', t("alerts.networkError"));
      } else {
        showAlert('error', t("alerts.genericError"));
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: () => {
      showAlert("error", t("alerts.invalidFile"));
    },
  });
  
  return (
    <div className="w-full" {...getRootProps()}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden">
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden" />
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>


        <div className="flex flex-col items-center justify-center">
          <p
            className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            {isUploading ? t("uploading") : t("uploadFile")}
          </p>
          <p
            className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            {t("dragOrDrop")}
          </p>
          <p
            className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-xs mt-1 italic">
            {t("supportedFormats")}
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              )}>
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-neutral-600 flex flex-col items-center">
                  {t("dropIt")}
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </motion.p>
              ) : (
                <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md">
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div
      className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${index % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`} />
          );
        }))}
    </div>
  );
}