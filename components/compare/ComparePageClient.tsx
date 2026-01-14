'use client';

import { useState, useMemo } from 'react';
import { PlanWithProvider } from '@/types/database';
import PlanFilters, { FilterState } from '@/components/plans/PlanFilters';
import PlanList from '@/components/plans/PlanList';
import UsageSummaryCard from './UsageSummaryCard';
import { Inbox } from 'lucide-react';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface ComparePageClientProps {
  plans: PlanWithProvider[];
  zipCode: string;
  initialUsage: number;
  breakdown?: UsageBreakdown;
}

export default function ComparePageClient({
  plans,
  zipCode,
  initialUsage,
  breakdown,
}: ComparePageClientProps) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    planTypes: [],
    contractLengths: [],
    minRenewable: 0,
    providers: [],
  });

  // Extract unique providers from plans
  const availableProviders = useMemo(() => {
    const providerMap = new Map();
    plans.forEach((plan) => {
      if (!providerMap.has(plan.provider_id)) {
        providerMap.set(plan.provider_id, {
          id: plan.provider_id,
          name: plan.provider.name,
        });
      }
    });
    return Array.from(providerMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [plans]);

  // Apply filters to plans
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Plan type filter
      if (
        filters.planTypes.length > 0 &&
        !filters.planTypes.includes(plan.plan_type)
      ) {
        return false;
      }

      // Contract length filter
      if (
        filters.contractLengths.length > 0 &&
        !filters.contractLengths.includes(plan.contract_length_months)
      ) {
        return false;
      }

      // Renewable energy filter
      if (plan.renewable_percentage < filters.minRenewable) {
        return false;
      }

      // Provider filter
      if (
        filters.providers.length > 0 &&
        !filters.providers.includes(plan.provider_id)
      ) {
        return false;
      }

      return true;
    });
  }, [plans, filters]);

  const hasActiveFilters =
    filters.planTypes.length > 0 ||
    filters.contractLengths.length > 0 ||
    filters.minRenewable > 0 ||
    filters.providers.length > 0;

  return (
    <div className="space-y-6">
      {/* Usage Summary Card (if breakdown exists) */}
      {breakdown && (
        <UsageSummaryCard
          usage={breakdown.total}
          breakdown={breakdown}
          zipCode={zipCode}
        />
      )}

      {/* Two-column layout */}
      <div className="lg:flex lg:gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-80 flex-shrink-0 mb-6 lg:mb-0">
          <PlanFilters
            currentFilters={filters}
            onFilterChange={setFilters}
            availableProviders={availableProviders}
          />
        </div>

        {/* Right Content - Plans */}
        <div className="flex-1 min-w-0">
          {filteredPlans.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No plans match your filters
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filter criteria to see more plans.'
                  : 'No plans are available for this area.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() =>
                    setFilters({
                      planTypes: [],
                      contractLengths: [],
                      minRenewable: 0,
                      providers: [],
                    })
                  }
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <PlanList
              plans={filteredPlans}
              selectedUsage={
                breakdown
                  ? (breakdown.total <= 750
                      ? 500
                      : breakdown.total <= 1500
                      ? 1000
                      : 2000)
                  : (initialUsage as 500 | 1000 | 2000)
              }
              isLoading={false}
              usageBreakdown={breakdown}
            />
          )}
        </div>
      </div>
    </div>
  );
}
