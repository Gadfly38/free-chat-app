import React from "react";
import { FileText } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;

// Usage:
// <FeatureCard
//   icon={FileText}
//   title="Document Indexer"
//   description="Seamlessly upload and index your PDFs from multiple sources..."
// />
