// src/components/GoogleSignInButton.jsx
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/api/axios";

const GoogleSignInButton = ({ content, color }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google OAuth Success:", tokenResponse.access_token);
      api.post("/auth/google", { token: tokenResponse.access_token });
    },
  });

  return (
    <button
      className={`flex items-center justify-center bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-${color}-400 focus:ring-opacity-50 disabled:opacity-50`}
      onClick={login}
    >
      <img
        src="/images/google.png"
        alt="Google icon"
        className="w-5 h-5 mr-2"
      />
      {content}
    </button>
  );
};

export default GoogleSignInButton;
