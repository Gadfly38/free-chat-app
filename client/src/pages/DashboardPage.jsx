import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import FeatureCard from "@/components/FeatureCard";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <div className="p-16 max-w-7xl mx-auto mt-40">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-blue-500 mb-4 text-center  ">
            EXECOS
          </h1>
          <h2 className="text-3xl font-bold mb-8 mt-12">
            Welcome to Your Document Intelligence Hub
          </h2>
          <p className="text-gray-600">
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
    </div>
  );
};

export default DashboardPage;
