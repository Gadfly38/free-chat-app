import React, { useState } from "react";
import { Check } from "lucide-react";
const UpgradePlanPage = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: "3",
      period: "month",
      description: "",
      features: [
        "Full access to all features",
        "Unlimited messages",
        "Priority support",
        "Advanced AI capabilities",
      ],
      buttonText: "Subscribe Monthly",
      isDisabled: false,
    },
    yearly: {
      name: "Yearly Plan",
      price: "20",
      period: "year",
      description: "Save $16 compared to monthly",
      features: [
        "Everything in Monthly plan",
        "Best value for money",
        "Annual billing",
      ],
      buttonText: "Subscribe Yearly",
      isPopular: true,
      isDisabled: false,
    },
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-16 sm:px-6  mt-40 justify-center">
      <h1 className="text-4xl font-bold text-center mb-20">Choose Your Plan</h1>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative ">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className="rounded-lg p-8 transition-all duration-300 ease-in-out border-2 border-emerald-500 relative z-10"
            onMouseEnter={() => setHoveredPlan(key)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">$</span>
              <span className="text-5xl font-bold">{plan.price}</span>
              <span className="text-gray-500 ml-2">/{plan.period}</span>
            </div>
            <div>
              <button
                className={`w-full rounded-lg py-3 px-4 mb-8 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-300`}
              >
                {plan.buttonText}
              </button>
              {/* {plan.description && (
                <p className="text-emerald-600 mb-6">{plan.description}</p>
              )} */}
            </div>
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            {hoveredPlan === key && (
              <div
                className="absolute inset-0 border-2 border-emerald-500 rounded-lg pointer-events-none"
                style={{ zIndex: 1 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default UpgradePlanPage;
