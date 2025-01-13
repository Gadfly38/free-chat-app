import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const GoogleSignButton = ({ content, color }) => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        console.log("Google OAuth Success:", credentialResponse);

        // Extract the ID token
        const idToken = credentialResponse.credential;
        console.log("ID Token:", idToken);

        // Send to your backend
        try {
          const response = await api.post("/auth/google", {
            idToken, // Send ID token to your backend
          });

          if (response.data.status === "success") {
            // Store user data and token
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/app/dashboard");
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Authentication Error:", error);
          // Handle error (show error message to user)
        }
      }}
      onError={() => console.error("Login Failed")}
    />
  );
};

export default GoogleSignButton;
