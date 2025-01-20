// src/components/FileUpload.jsx
import React, { useEffect, useState } from "react";
import { useUploadFileMutation } from "@/features/fileUpload/uploadApiSlice";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import api from "@/api/axios";

const fetchDocuments = async (email) => {
  const response = await api.post("/documents", { email: email });
  return response.data;
};

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFile] = useUploadFileMutation();
  const [files, setFiles] = useState([]); // State to store fetched files

  const userEmail = useSelector((state) => state.auth.user.email); // Get from your auth state

  const {
    data: uploadedFiles = [],
    error,
    isLoading,
  } = useQuery(["documents", userEmail], () => fetchDocuments(userEmail), {
    enabled: !!userEmail, // Only run the query if userEmail is available
  });

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("file", selectedFile);
    console.log("form data", formData);

    try {
      await uploadFile(formData).unwrap();
      setSelectedFile(null); // Clear selected file
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* File Input */}
      <div className="mb-4">
        <input type="file" onChange={handleFileSelect} className="mb-4" />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected File:</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      {/* Display Uploaded Files */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
        {uploadedFiles.length > 0 ? (
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded mb-2">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload File
        </button>
      )}
    </div>
  );
};

export default FileUpload;
