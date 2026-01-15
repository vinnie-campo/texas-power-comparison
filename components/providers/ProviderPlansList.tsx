'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, Leaf } from 'lucide-react';
import { Plan, Provider } from '@/types/database';
import PlanDetailsModal from '@/components/plans/PlanDetailsModal';

interface ProviderPlansListProps {
  plans: Plan[];
  provider: Provider;
}

export default function ProviderPlansList({ plans, provider }: ProviderPlansListProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          No active plans currently available from {provider.name}.
        </p>
        <Link
          href="/compare"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Compare Other Providers →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Plan Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {plan.plan_name}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {plan.contract_length_months === 0
                      ? 'Month-to-Month'
                      : `${plan.contract_length_months} months`}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {plan.plan_type}
                  </span>
                  {plan.renewable_percentage > 0 && (
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      {plan.renewable_percentage}% Renewable
                    </span>
                  )}
                </div>
              </div>

              {/* Rate & CTA */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    Rate at 1000 kWh
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {(plan.rate_1000kwh * 100).toFixed(1)}¢
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(plan)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlan && (
        <PlanDetailsModal
          plan={{ ...selectedPlan, provider }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
