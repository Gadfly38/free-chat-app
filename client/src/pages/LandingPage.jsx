import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  GoogleLogin,
} from "@react-oauth/google";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import FeatureCard from "@/components/FeatureCard";
import { FileText, MessageSquare, Settings } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { logout, reset } from "@/features/auth/authSlice";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-4 mt-28">
      <div className="p-16 max-w-7xl mx-auto mt-40">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-blue-500 mb-4 text-center  ">
            EXECOS
          </h1>
          <h2 className="text-3xl font-bold mb-8 mt-12 text-center">
            Welcome to Your Document Intelligence Hub
          </h2>
          <p className="text-gray-600 text-center">
            Explore our powerful features designed to transform how you interact
            with your documents.
          </p>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Document Indexer */}
          <FeatureCard
            icon={FileText}
            title="Document Indexer"
            description="Seamlessly upload and index your PDFs from multiple sources..."
          />

          {/* Smart Chat */}
          <FeatureCard
            icon={MessageSquare}
            title="smart chat"
            description="Engage in intelligent conversations about your documents. Get
              instant answers, insights, and analysis powered by advanced AI."
          />

          {/* Preferences */}
          <FeatureCard
            icon={Settings}
            title="Preferences"
            description="customize your experience with personalized settings. configure AI parameters and interface preferences to match your workflow."
          />
        </div>
      </div>

      <div className="space-y-8 mt-12 w-full max-w-80 ">
        <GoogleSignInButton content="Sign in with Google" color="blue" />

        <button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-300 text-black text-xl rounded hover:bg-gray-400 transition-colors"
          onClick={() => navigate("/app/auth/login")}
        >
          <img src="/images/email.png" alt="Google" className="mr-4 w-9 h-9" />
          Sign in with Email
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
