import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import api from "@/api/axios";
import GoogleSignButton from "@/components/GoogleSignButton";
import axios from "axios";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  rememberMe: yup.boolean(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(formData, { abortEarly: false });

      const response = await api.post(`/auth/signin`, formData);

      console.log(response.data);

      if (response.data.status === "success") {
        // Store user data and token
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        console.log("Login successful:", response.data);
        navigate("/app/chat");
      }
    } catch (err) {
      if (err.response?.data) {
        // Handle server error response
        setErrors({
          email: err.response.data.message,
        });
      } else if (err.inner) {
        // Handle validation errors
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center text-lg">
      <div className="bg-white p-8 w-full h-screen md:w-2/3 md:bg-gray-100">
        <div className="max-w-[400px] mx-auto mt-5 md:mt-56">
          <h2 className="text-4xl font-bold mb-12 text-center">Log In</h2>
          <GoogleSignButton content="Sign in with Google" color="blue" />
          <div className="border-b border-gray-300 leading-[0.1em] text-center my-8">
            <span className="px-4 bg-white md:bg-gray-100">Or</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="flex cursor-pointer hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white text-xl py-3 px-4 rounded hover:bg-blue-700"
            >
              Log In
            </button>
          </form>
          <div className="flex flex-row justify-center mt-6 gap-2">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="text-blue-800 hover:underline"
              onClick={() => navigate("/app/auth/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <div className="flex md:w-1/3 flex-none"></div>
    </div>
  );
};

export default LoginPage;
