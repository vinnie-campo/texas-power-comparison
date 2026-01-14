'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import UsageCalculatorQuiz from '@/components/search/UsageCalculatorQuiz';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface UsageQuizWrapperProps {
  zipCode: string;
}

export default function UsageQuizWrapper({ zipCode }: UsageQuizWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCalculated = (usage: number, breakdown: UsageBreakdown) => {
    // Encode breakdown as JSON for URL
    const breakdownJSON = encodeURIComponent(JSON.stringify(breakdown));

    // Build new URL with calculated data
    const params = new URLSearchParams(searchParams.toString());
    params.set('calculated', 'true');
    params.set('usage', usage.toString());
    params.set('breakdown', breakdownJSON);

    // Redirect to same page with new params
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Calculate Your Usage
        </h2>
        <p className="text-gray-600">
          Answer a few questions to get personalized plan recommendations
        </p>
      </div>
      <UsageCalculatorQuiz zipCode={zipCode} onCalculated={handleCalculated} />
    </div>
  );
}
