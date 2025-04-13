import React from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { Question, startNewInterview } from "../../helpers/api-communicator";

interface FileUploadProps {
  onUploadComplete: (response: { interviewId: string; questions: Question[] }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  return (
    <FilePond
      acceptedFileTypes={["application/pdf"]}
      labelIdle='Drag & Drop your resume or <span class="filepond--label-action">Browse</span>'
      server={{
        process: async (fieldName, file, metadata, load, error) => {
          try {
            console.log("Uploading file:", file.name, file.type);
            const response = await startNewInterview(file as File);
            console.log("FileUpload response:", response);
            load(response.interviewId);
            onUploadComplete(response);
          } catch (err) {
            console.error("File upload error:", err);
            error("Failed to process resume. Please try again.");
          }
        },
        fetch: null,
        revert: null,
      }}
    />
  );
};

export default FileUpload;