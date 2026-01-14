'use client';

import { useState } from 'react';
import { PlanWithProvider } from '@/types/database';
import PlanCard from './PlanCard';
import { ArrowUpDown, Inbox } from 'lucide-react';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface PlanListProps {
  plans: PlanWithProvider[];
  selectedUsage: 500 | 1000 | 2000;
  isLoading: boolean;
  sortBy?: string;
  usageBreakdown?: UsageBreakdown;
}

type SortOption = 'price-asc' | 'price-desc' | 'contract';

export default function PlanList({
  plans,
  selectedUsage,
  isLoading,
  sortBy: initialSortBy,
  usageBreakdown,
}: PlanListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');

  // Sort plans based on selected option
  const sortPlans = (plansToSort: PlanWithProvider[]): PlanWithProvider[] => {
    const sorted = [...plansToSort];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const rateA = selectedUsage === 500 ? a.rate_500kwh : selectedUsage === 1000 ? a.rate_1000kwh : a.rate_2000kwh;
          const rateB = selectedUsage === 500 ? b.rate_500kwh : selectedUsage === 1000 ? b.rate_1000kwh : b.rate_2000kwh;
          return rateA - rateB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const rateA = selectedUsage === 500 ? a.rate_500kwh : selectedUsage === 1000 ? a.rate_1000kwh : a.rate_2000kwh;
          const rateB = selectedUsage === 500 ? b.rate_500kwh : selectedUsage === 1000 ? b.rate_1000kwh : b.rate_2000kwh;
          return rateB - rateA;
        });
      case 'contract':
        return sorted.sort((a, b) => a.contract_length_months - b.contract_length_months);
      default:
        return sorted;
    }
  };

  const sortedPlans = sortPlans(plans);

  // Loading skeleton card
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-20 bg-gray-100 rounded mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );

  // Empty state
  if (!isLoading && sortedPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Inbox className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No plans found
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any electricity plans for your area. Try searching with a different ZIP code.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with count and sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Plan count */}
        <div>
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          ) : (
            <h2 className="text-lg font-semibold text-gray-900">
              Showing {sortedPlans.length} {sortedPlans.length === 1 ? 'plan' : 'plans'}
            </h2>
          )}
        </div>

        {/* Sort dropdown */}
        {!isLoading && sortedPlans.length > 0 && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <label htmlFor="sort-select" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="
                px-3 py-2 border border-gray-300 rounded-lg
                text-sm font-medium text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-white cursor-pointer
              "
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="contract">Contract Length</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid of plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show 6 skeleton cards while loading
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          // Show actual plan cards
          sortedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selectedUsage={selectedUsage}
              usageBreakdown={usageBreakdown}
            />
          ))
        )}
      </div>
    </div>
  );
}
