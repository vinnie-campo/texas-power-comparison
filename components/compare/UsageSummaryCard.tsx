'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Calculator, Home, Users, Ruler, Car, Sun, CloudRain, RotateCcw } from 'lucide-react';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface UsageSummaryCardProps {
  usage: number;
  breakdown: UsageBreakdown;
  zipCode: string;
}

export default function UsageSummaryCard({
  usage,
  breakdown,
  zipCode,
}: UsageSummaryCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRecalculate = () => {
    // Remove calculated params and go back to quiz
    const params = new URLSearchParams(searchParams.toString());
    params.delete('calculated');
    params.delete('usage');
    params.delete('breakdown');

    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 md:p-8 shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Your Estimated Usage
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {usage} kWh<span className="text-lg text-gray-600">/month</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Recalculate
        </button>
      </div>

      {/* Breakdown Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {breakdown.base > 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <Home className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">Base</div>
            <div className="text-sm font-semibold text-gray-900">
              {breakdown.base} kWh
            </div>
          </div>
        )}

        {breakdown.bedrooms > 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">Bedrooms</div>
            <div className="text-sm font-semibold text-gray-900">
              +{breakdown.bedrooms} kWh
            </div>
          </div>
        )}

        {breakdown.sqft !== 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <Ruler className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">Sq Ft</div>
            <div className="text-sm font-semibold text-gray-900">
              {breakdown.sqft > 0 ? '+' : ''}{breakdown.sqft} kWh
            </div>
          </div>
        )}

        {breakdown.ev > 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <Car className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">EV</div>
            <div className="text-sm font-semibold text-gray-900">
              +{breakdown.ev} kWh
            </div>
          </div>
        )}

        {breakdown.solar < 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <Sun className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">Solar</div>
            <div className="text-sm font-semibold text-green-600">
              {breakdown.solar} kWh
            </div>
          </div>
        )}

        {breakdown.climate > 0 && (
          <div className="bg-white rounded-lg p-3 text-center">
            <CloudRain className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600 mb-1">Climate</div>
            <div className="text-sm font-semibold text-gray-900">
              +{breakdown.climate} kWh
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Plans below are sorted by best rates for your estimated usage.
        <span className="block mt-1 text-xs text-gray-500">
          Want to adjust? Use the recalculate button above to retake the quiz.
        </span>
      </p>
    </div>
  );
}
