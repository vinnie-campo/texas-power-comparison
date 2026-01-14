'use client';

import { useState } from 'react';
import { PlanWithProvider } from '@/types/database';
import PlanList from '@/components/plans/PlanList';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface CompareResultsProps {
  plans: PlanWithProvider[];
  zipCode: string;
  initialUsage?: number;
  usageBreakdown?: UsageBreakdown;
}

export default function CompareResults({
  plans,
  zipCode,
  initialUsage = 1000,
  usageBreakdown,
}: CompareResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUsage, setSelectedUsage] = useState<500 | 1000 | 2000>(
    (initialUsage as 500 | 1000 | 2000) || 1000
  );

  const handleUsageChange = (usage: 500 | 1000 | 2000) => {
    setSelectedUsage(usage);
    // Update URL with new usage parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('usage', usage.toString());
    router.push(`/compare?${params.toString()}`);
  };

  const usageOptions = [
    { value: 500, label: '500 kWh/mo', description: 'Small home or apartment' },
    { value: 1000, label: '1,000 kWh/mo', description: 'Average home' },
    { value: 2000, label: '2,000 kWh/mo', description: 'Large home' },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Only show ZIP Code Display and Usage Selector if NO breakdown exists */}
      {!usageBreakdown && (
        <>
          {/* ZIP Code Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Showing plans for ZIP code:</span>{' '}
              <span className="font-mono">{zipCode}</span>
            </p>
          </div>

          {/* Usage Selector */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Your Average Monthly Usage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {usageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleUsageChange(option.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                    ${
                      selectedUsage === option.value
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
                    }
                  `}
                >
                  <div className="text-left">
                    <p
                      className={`text-lg font-bold ${
                        selectedUsage === option.value
                          ? 'text-blue-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Plans List */}
      <PlanList
        plans={plans}
        selectedUsage={selectedUsage}
        isLoading={false}
        usageBreakdown={usageBreakdown}
      />
    </div>
  );
}
