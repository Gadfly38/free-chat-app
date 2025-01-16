import React, { useState, useEffect, useCallback } from "react";
import { HelpCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Cloud, Loader2, X } from "lucide-react";
import api from "@/api/axios";
import { useSelector } from "react-redux";

const GOOGLE_API_KEY = "AIzaSyBnI1BtaTCsvh0XvaVOuuU-9xITXtGI0vc";
const GOOGLE_CLIENT_ID =
  "302085187214-36vpti1rbqfjtdgafn83k6vcjcmnvetf.apps.googleusercontent.com";

const FilesPage = () => {
  const [uploadMethod, setUploadMethod] = useState("google");
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [pickerInited, setPickerInited] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const userId = useSelector((state) => state.auth.user.id);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("documents", {
          params: { userId }, // Pass userId as a query parameter
        });
        setUploadedFiles(response.data);
        console.log("Documents:", response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();

    // Load the Google Identity Services script
    const loadGoogleIdentityServices = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initializeGoogleApi;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    // Load the Google Picker script
    const loadPickerScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("picker", () => {
          setPickerInited(true);
        });
      };
      document.body.appendChild(script);
    };

    const initializeGoogleApi = async () => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            createPicker(tokenResponse.access_token);
          }
        },
      });
      setTokenClient(client);
    };

    loadGoogleIdentityServices();
    loadPickerScript();
  }, []);

  const handleGoogleDriveConnect = () => {
    if (!tokenClient || !pickerInited) {
      console.error("Google APIs not fully loaded");
      return;
    }

    setIsConnecting(true);
    tokenClient.requestAccessToken();
  };

  const createPicker = (token) => {
    if (!window.google || !window.google.picker) {
      console.error("Picker API not loaded");
      setIsConnecting(false);
      return;
    }

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED) // Enable multi-select
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.PDFS)
      .setOAuthToken(token)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setCallback(pickerCallback)
      .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
      .build();

    picker.setVisible(true);
    setIsConnecting(false);
  };

  const normalizeFileObject = (file, source = "local") => {
    if (source === "local") {
      return {
        id: `local-${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
        source: "local",
        originalFile: file, // Store the original File object here
      };
    } else {
      // Google Drive files
      return {
        id: file.id,
        name: file.name,
        type: file.mimeType,
        sizeBytes: file.sizeBytes,
        source: "google",
        originalFile: file, // Store the original Google Drive file object
      };
    }
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs.map((file) =>
        normalizeFileObject(file, "google")
      );
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (fileId) => {
    console.log(fileId);
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles
      .filter((file) => file.size <= 20 * 1024 * 1024) // 20MB limit
      .map((file) => normalizeFileObject(file, "local"));

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "text/html": [".html", ".htm"],
      "text/css": [".css"],
      "text/javascript": [".js"],
      "text/markdown": [".md"],
      "text/xml": [".xml"],
      "application/json": [".json"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadPromises = selectedFiles.map(async (fileObj) => {
        const formData = new FormData();
        formData.append("userId", userId);
        // Handle different file sources
        if (fileObj.source === "local") {
          // For local files, use the originalFile which is the actual File object
          formData.append("file", fileObj.originalFile);
        } else if (fileObj.source === "google") {
          // For Google Drive files, we need to download them first
          try {
            const response = await fetch(
              `https://www.googleapis.com/drive/v3/files/${fileObj.id}?alt=media`,
              {
                headers: {
                  Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
                },
              }
            );
            const blob = await response.blob();
            // Create a File object from the blob
            const file = new File([blob], fileObj.name, { type: fileObj.type });
            formData.append("file", file);
          } catch (error) {
            console.error(
              `Error downloading Google Drive file: ${fileObj.name}`,
              error
            );
            throw error;
          }
        }

        try {
          console.log("form dfdfsfsf", { ...formData, userId });
          const response = await api.post("documents/upload", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              // Artificial delay using setTimeout
              setTimeout(() => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
              }, 1000); // 1 second delay for each progress update
            },
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));

          return response.data;
        } catch (error) {
          console.error(`Error uploading ${fileObj.name}:`, error);
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);
      console.log("All uploads completed:", results);
      const updatedDocsResponse = await api.get("documents", {
        params: { userId },
      });
      setUploadedFiles(updatedDocsResponse.data);

      // Clear selected files after successful upload
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  console.log(selectedFiles);

  return (
    <div className="max-w-4xl mx-auto p-8 mt-40 gap-12">
      <h1 className="text-4xl font-bold mb-4">Document Indexer</h1>
      <p className="text-gray-600 mb-16">
        Transform your documents into searchable knowledge. Upload PDFs from
        your local storage or Google Drive.
      </p>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700">Select Upload Method</span>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="google"
              checked={uploadMethod === "google"}
              onChange={(e) => setUploadMethod(e.target.value)}
              className="w-4 h-4 text-blue-500"
            />
            <span>Google Drive Upload</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="local"
              checked={uploadMethod === "local"}
              onChange={(e) => setUploadMethod(e.target.value)}
              className="w-4 h-4 text-blue-500"
            />
            <span>Local Upload</span>
          </label>
        </div>

        {uploadMethod === "google" && (
          <div>
            <button
              className={`mt-6 px-6 py-2 rounded ${
                isConnecting || !tokenClient || !pickerInited
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              onClick={handleGoogleDriveConnect}
              disabled={isConnecting || !tokenClient || !pickerInited}
            >
              {isConnecting ? "Connecting..." : "Connect Google Drive"}
            </button>
            {(!tokenClient || !pickerInited) && (
              <p className="text-sm text-gray-500 mt-2">
                Loading Google Drive integration...
              </p>
            )}
          </div>
        )}

        {uploadMethod === "local" && (
          <div className="w-full">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <Cloud className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-600">
                  {isDragActive ? "Drop file here" : "Drag and drop file here"}
                </p>
                <p className="text-sm text-gray-500">
                  Limit 20MB per file • PDF
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.querySelector('input[type="file"]').click();
                  }}
                >
                  Browse files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4 mt-4">
          <h2 className="text-2xl font-semibold">📚Selected Documents</h2>
        </div>

        {selectedFiles.length > 0 ? (
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-white p-4 rounded border"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">📝</div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.sizeBytes)}
                      {file.source === "google" && " • Google Drive"}
                      {file.source === "local" && " • Local File"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-blue-800">
              📝 No documents have been selected yet.
            </p>
          </div>
        )}
        {uploading && (
          <div className="w-full mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-1">
              {uploadProgress}% Uploaded
            </p>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4 mt-4">
          <h2 className="text-2xl font-semibold">📚Uploaded Documents</h2>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-white p-4 rounded border"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">📝</div>
                  <div>
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.sizeBytes)}
                      {file.source === "google" && " • Google Drive"}
                      {file.source === "local" && " • Local File"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-blue-800">
              📝 No documents have been uploaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
