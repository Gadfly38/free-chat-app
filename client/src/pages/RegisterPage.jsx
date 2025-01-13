import api from "@/api/axios";
import GoogleSignButton from "@/components/GoogleSignButton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      const response = await api.post("/auth/signup", formData);
      console.log("formedaata", formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/app/chat");
      }
      console.log("Form submitted:", response.data);
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex justify-center items-center text-lg">
      <div className="bg-white p-8 w-full h-screen md:w-2/3 md:bg-gray-100">
        <div className="max-w-[400px] mx-auto mt-5 md:mt-56">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Sign up for a free account
          </h2>
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

            <button
              type="submit"
              className="w-full flex justify-center items-center bg-purple-500 text-white text-xl py-3 px-4 rounded hover:bg-blue-700"
            >
              <img
                src="/images/account.png"
                alt="Google"
                className="mr-2 w-9 h-9"
              />
              Create Account
            </button>
          </form>
          <div className="border-b border-gray-300 leading-[0.1em] text-center my-8">
            <span className="px-4 bg-white md:bg-gray-100">
              or sign up with
            </span>
          </div>
          <GoogleSignButton content="Google" color="blue" />

          <div className="flex flex-row justify-center mt-6 gap-2">
            <p>Already have an account?</p>
            <button
              type="button"
              className="text-blue-800 hover:underline"
              onClick={() => navigate("/app/auth/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
      <div className="flex md:w-1/3 flex-none"></div>
    </div>
  );
};

export default RegisterPage;
