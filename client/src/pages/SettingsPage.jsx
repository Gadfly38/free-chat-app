import React from "react";
import { Key, Palette, Bot, BarChart2, Rocket } from "lucide-react";

const SettingsPage = () => {
  const features = [
    { icon: "🔑", title: "API Key Management" },
    { icon: "🎨", title: "Theme Customization" },
    { icon: "🤖", title: "AI Model Configuration" },
    { icon: "📊", title: "Usage Analytics" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-2 mt-40">Settings</h1>
      <p className="text-gray-600 mb-12">
        Customize your experience and configure application preferences.
      </p>

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h2 className="text-4xl font-semibold text-blue-500">
            🚀 Coming Soon
          </h2>
        </div>

        <p className="text-gray-600 mb-8 text-center">
          We're working on bringing you powerful customization options:
        </p>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
            >
              <div className="bg-blue-200 p-2 rounded-lg">{feature.icon}</div>
              <span>{feature.title}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-8 text-center">
          Stay tuned for these exciting features!
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
