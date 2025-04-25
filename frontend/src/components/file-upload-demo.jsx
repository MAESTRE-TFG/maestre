"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadDemo({ classroomId, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles(files);
  };

  return (
    (<div
      className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload
        classroomId={classroomId}
        onUploadComplete={onUploadComplete}
      />
    </div>)
  );
}
