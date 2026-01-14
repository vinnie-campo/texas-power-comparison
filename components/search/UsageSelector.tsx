'use client';

import { Building2, Home, Hotel } from 'lucide-react';

interface UsageSelectorProps {
  selectedUsage: 500 | 1000 | 2000;
  onUsageChange: (usage: 500 | 1000 | 2000) => void;
}

export default function UsageSelector({
  selectedUsage,
  onUsageChange,
}: UsageSelectorProps) {
  const usageOptions = [
    {
      value: 500 as const,
      label: 'Apartment',
      icon: Building2,
      description: 'Average monthly usage',
    },
    {
      value: 1000 as const,
      label: 'Small Home',
      icon: Home,
      description: 'Average monthly usage',
    },
    {
      value: 2000 as const,
      label: 'Large Home',
      icon: Hotel,
      description: 'Average monthly usage',
    },
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Your Monthly Usage
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {usageOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedUsage === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onUsageChange(option.value)}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-blue-300
                ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md hover:scale-[1.01]'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${option.label} - ${option.value} kWh per month`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <Icon
                  className={`w-10 h-10 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                />
              </div>

              {/* kWh Value */}
              <div
                className={`text-3xl font-bold mb-1 ${
                  isSelected ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {option.value}
              </div>
              <div
                className={`text-sm font-medium mb-2 ${
                  isSelected ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                kWh/month
              </div>

              {/* Label */}
              <div
                className={`text-base font-semibold mb-1 ${
                  isSelected ? 'text-blue-700' : 'text-gray-800'
                }`}
              >
                {option.label}
              </div>

              {/* Description */}
              <div className="text-xs text-gray-500">
                {option.description}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
