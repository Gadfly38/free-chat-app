import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "@/features/auth/authSlice";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  rememberMe: yup.boolean(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError, message, isSuccess, token } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // useEffect(() => {
  //   dispatch(reset());
  // }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/app/chat");
    }
  }, [token]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="flex justify-center items-center text-lg">
      <div className="bg-white p-8 w-full h-screen md:w-2/3 md:bg-gray-100">
        <div className="max-w-[400px] mx-auto mt-5 md:mt-56">
          <h2 className="text-4xl font-bold mb-12 text-center">Log In</h2>
          <GoogleSignInButton content="Sign in with Google" color="blue" />
          <div className="border-b border-gray-300 leading-[0.1em] text-center my-8">
            <span className="px-4 bg-white md:bg-gray-100">Or</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {isError && message && (
                <p className="mt-1 text-red-500 text-sm">{message}</p>
              )}
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700">Remember me</label>
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
