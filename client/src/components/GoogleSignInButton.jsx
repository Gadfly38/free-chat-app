// src/components/GoogleSignInButton.jsx
import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import api from "@/api/axios";
import axios from "axios";

const GoogleSignInButton = ({ content, color }) => {
  const handleSuccess = async (credentialResponse) => {
    console.log("Google OAuth Success:", credentialResponse);
    const token = credentialResponse.credential;
    console.log("idToken_-_---", token);
    // Send the ID token to your backend for verification
    const response = await api.post("/auth/google", { token });
    console.log("response_-_---", response);
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      console.log("userInfo_-_---", userInfo);
    },
  });

  return (
    <div className="google-button">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      {/* <button
          className={`flex items-center justify-center bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-${color}-400 focus:ring-opacity-50 disabled:opacity-50`}
          onClick={googleLogin}
        >
          <img
            src="/images/google.png"
            alt="Google icon"
            className="w-5 h-5 mr-2"
          />
          {content}
        </button> */}
    </div>
  );
};

export default GoogleSignInButton;
