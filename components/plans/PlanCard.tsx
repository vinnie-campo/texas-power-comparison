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

    return (rateToUse * usage) / 100 + plan.base_charge;
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
        <h3 className="text-xl font-bold text-secondary-blue mb-3">
          {plan.plan_name}
        </h3>
      </div>

      {/* Personalized Estimated Bill (if breakdown exists) */}
      {personalizedBill !== null && usageBreakdown && (
        <div className="bg-light-blue border-t-2 border-b-2 border-[#E5007D]/20 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-pink" />
              <p className="text-xs font-semibold text-primary-pink">
                your estimated bill
              </p>
            </div>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-primary-pink hover:opacity-80 transition-opacity"
                aria-label="Information about personalized estimate"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-6 z-10 w-48 bg-secondary-blue text-white text-xs rounded-2xl p-3 shadow-lg">
                  based on your home profile and estimated {usageBreakdown.total} kWh/month usage
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-secondary-blue transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-pink">
              ${personalizedBill.toFixed(2)}
            </span>
            <span className="text-sm text-secondary-blue/70">/month</span>
          </div>
          <p className="text-xs text-secondary-blue/60 mt-1">
            based on {usageBreakdown.total} kWh/month
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 pt-4 flex flex-col flex-grow">
        {/* Rate Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm text-secondary-blue/60">rate:</span>
            <span className="text-2xl font-bold text-primary-pink">
              {rate.toFixed(1)}¢
            </span>
            <span className="text-sm text-secondary-blue/60">per kWh</span>
          </div>
          <p className="text-xs text-secondary-blue/50">
            based on {selectedUsage} kWh usage tier
          </p>
        </div>

        {/* Standard Estimated Bill (if no personalized bill) */}
        {!personalizedBill && (
          <div className="bg-light-blue rounded-2xl p-4 mb-4">
            <p className="text-xs text-secondary-blue/70 mb-1">estimated monthly bill</p>
            <p className="text-2xl font-bold text-secondary-blue">
              ${standardBill.toFixed(2)}
            </p>
            <p className="text-xs text-secondary-blue/50">
              at {selectedUsage} kWh/month
            </p>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Contract Length Badge */}
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-light-blue text-secondary-blue">
            {getContractLength()}
          </span>

          {/* Plan Type Badge */}
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getPlanTypeBadgeColor()}`}>
            {plan.plan_type}
          </span>

          {/* Renewable Badge */}
          {plan.renewable_percentage > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#00D4AA]/10 text-accent-teal">
              <Leaf className="w-3 h-3" />
              {plan.renewable_percentage}% renewable
            </span>
          )}
        </div>

        {/* Additional Details */}
        <div className="text-xs text-secondary-blue/60 space-y-1 mb-4 flex-grow">
          {plan.base_charge > 0 && (
            <p>base charge: ${plan.base_charge.toFixed(2)}/month</p>
          )}
          {plan.early_termination_fee !== null && plan.early_termination_fee > 0 && (
            <p>early termination fee: ${plan.early_termination_fee.toFixed(2)}</p>
          )}
        </div>

        {/* View Details Button */}
        <button
          className="
            w-full btn-primary mt-auto
          "
          onClick={() => setIsModalOpen(true)}
        >
          view details
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
