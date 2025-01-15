// src/components/GoogleSignInButton.jsx
import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import api from "@/api/axios";
import axios from "axios";
import { googleLogin } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const GoogleSignInButton = ({ content, color }) => {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    console.log("Google OAuth Success:", credentialResponse);
    const token = credentialResponse.credential;
    console.log("idToken_-_---", token);
    // Send the ID token to your backend for verification
    dispatch(googleLogin({ token }));
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="google-button">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleSignInButton;
