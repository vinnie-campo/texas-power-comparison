'use client';

import { useState } from 'react';
import { PlanWithProvider } from '@/types/database';
import { Leaf, Info, Sparkles } from 'lucide-react';
import PlanDetailsModal from './PlanDetailsModal';
import ProviderLogo from '@/components/ui/ProviderLogo';

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

interface PlanCardProps {
  plan: PlanWithProvider;
  selectedUsage: 500 | 1000 | 2000;
  usageBreakdown?: UsageBreakdown;
}

export default function PlanCard({ plan, selectedUsage, usageBreakdown }: PlanCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the rate based on selected usage tier
  const getRate = (): number => {
    switch (selectedUsage) {
      case 500:
        return plan.rate_500kwh;
      case 1000:
        return plan.rate_1000kwh;
      case 2000:
        return plan.rate_2000kwh;
      default:
        return plan.rate_1000kwh;
    }
  };

  const rate = getRate();

  // Calculate estimated bill
  const calculateBill = (usage: number): number => {
    // Determine which rate to use based on usage amount
    let rateToUse: number;
    if (usage <= 750) {
      rateToUse = plan.rate_500kwh;
    } else if (usage <= 1500) {
      rateToUse = plan.rate_1000kwh;
    } else {
      rateToUse = plan.rate_2000kwh;
    }

    return (rateToUse * usage) + (plan.base_charge || 0);
  };

  // Personalized bill (if breakdown exists) uses actual calculated usage
  const personalizedBill = usageBreakdown ? calculateBill(usageBreakdown.total) : null;

  // Standard bill uses selected tier
  const standardBill = calculateBill(selectedUsage);

  // Format contract length for display
  const getContractLength = (): string => {
    if (plan.contract_length_months === 0) {
      return 'Month-to-Month';
    }
    return `${plan.contract_length_months} Months`;
  };

  // Get plan type badge color
  const getPlanTypeBadgeColor = (): string => {
    switch (plan.plan_type) {
      case 'Fixed':
        return 'bg-blue-100 text-blue-800';
      case 'Variable':
        return 'bg-orange-100 text-orange-800';
      case 'Prepaid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card-bulb flex flex-col h-full overflow-hidden">
      {/* Provider Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <ProviderLogo
            providerSlug={plan.provider.slug}
            providerName={plan.provider.name}
            size="sm"
          />
          <p className="text-sm font-medium text-secondary-blue/70">{plan.provider.name}</p>
        </div>

        {/* Plan Name */}
        <h3 className="text-xl font-bold text-[#003366] mb-3">
          {plan.plan_name}
        </h3>
      </div>

      {/* Personalized Estimated Bill (if breakdown exists) */}
      {personalizedBill !== null && usageBreakdown && (
        <div className="bg-[#F5F7FA] border-t-2 border-b-2 border-[#00943C]/20 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00943C]" />
              <p className="text-xs font-semibold text-[#00943C]">
                Your Estimated Bill
              </p>
            </div>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-[#003366] hover:opacity-80 transition-opacity"
                aria-label="Information about personalized estimate"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-6 z-10 w-48 bg-[#003366] text-white text-xs rounded-lg p-3 shadow-lg">
                  Based on your home profile and estimated {usageBreakdown.total} kWh/month usage
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-[#003366] transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#00943C]">
              ${personalizedBill.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on {usageBreakdown.total} kWh/month
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 pt-4 flex flex-col flex-grow">
        {/* Rate Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm text-gray-600">Rate:</span>
            <span className="text-2xl font-bold text-[#00943C]">
              {(rate * 100).toFixed(1)}¢
            </span>
            <span className="text-sm text-gray-600">per kWh</span>
          </div>
          <p className="text-xs text-gray-500">
            Based on {selectedUsage} kWh usage tier
          </p>
        </div>

        {/* Standard Estimated Bill (if no personalized bill) */}
        {!personalizedBill && (
          <div className="bg-[#F5F7FA] rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Estimated Monthly Bill</p>
            <p className="text-2xl font-bold text-[#003366]">
              ${standardBill.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              At {selectedUsage} kWh/month
            </p>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Contract Length Badge */}
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F7FA] text-[#003366]">
            {getContractLength()}
          </span>

          {/* Plan Type Badge */}
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getPlanTypeBadgeColor()}`}>
            {plan.plan_type}
          </span>

          {/* Renewable Badge */}
          {plan.renewable_percentage > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00943C]/10 text-[#00943C]">
              <Leaf className="w-3 h-3" />
              {plan.renewable_percentage}% Renewable
            </span>
          )}
        </div>

        {/* Additional Details */}
        <div className="text-xs text-gray-600 space-y-1 mb-4 flex-grow">
          {plan.base_charge > 0 && (
            <p>Base Charge: ${plan.base_charge.toFixed(2)}/month</p>
          )}
          {plan.early_termination_fee !== null && plan.early_termination_fee > 0 && (
            <p>Early Termination Fee: ${plan.early_termination_fee.toFixed(2)}</p>
          )}
        </div>

        {/* View Details Button */}
        <button
          className="
            w-full btn-secondary mt-auto
          "
          onClick={() => setIsModalOpen(true)}
        >
          View Details
        </button>
      </div>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        plan={plan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatedUsage={usageBreakdown?.total || selectedUsage}
      />
    </div>
  );
}
