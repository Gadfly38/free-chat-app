// src/store/slices/uploadApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from "@/api/axios";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // or wherever you store your token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/document/upload_pdf",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
