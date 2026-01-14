'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, ExternalLink } from 'lucide-react';
import { PlanWithProvider } from '@/types/database';

interface PlanDetailsModalProps {
  plan: PlanWithProvider;
  isOpen: boolean;
  onClose: () => void;
  calculatedUsage?: number;
}

export default function PlanDetailsModal({
  plan,
  isOpen,
  onClose,
  calculatedUsage = 1000,
}: PlanDetailsModalProps) {
  // Track if component is mounted (for SSR safety)
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key press and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Parse features from JSON
  let features: string[] = [];
  if (plan.features) {
    try {
      features = typeof plan.features === 'string'
        ? JSON.parse(plan.features)
        : plan.features;
    } catch (e) {
      features = [];
    }
  }

  // Don't render anything if not open or not mounted (SSR safety)
  if (!isOpen || !mounted) return null;

  // Modal content
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Deep Blue Background */}
        <div className="bg-secondary-blue p-8 rounded-t-2xl relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header Content */}
          <div className="pr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {plan.plan_name}
            </h2>
            <p className="text-lg text-white/80">
              {plan.provider?.name || 'Provider'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">

          {/* Key Features Section */}
          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00D4AA]/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-accent-teal" />
                    </div>
                    <span className="text-secondary-blue/80 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rate Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Pricing
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-300">
                      {/* Empty cell */}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-r border-gray-300">
                      Apartment
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-r border-gray-300">
                      Small Home
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300">
                      Large Home
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-r border-gray-300">
                      Usage amount
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-b border-r border-gray-300">
                      500 kWh
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-b border-r border-gray-300">
                      1,000 kWh
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-b border-gray-300">
                      2,000 kWh
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300">
                      Average price per kWh
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 border-r border-gray-300">
                      {plan.rate_500kwh.toFixed(1)}¢
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 border-r border-gray-300">
                      {plan.rate_1000kwh.toFixed(1)}¢
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                      {plan.rate_2000kwh.toFixed(1)}¢
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Rates shown include average monthly TDU delivery charges and fees.
            </p>
          </div>

          {/* Plan Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Contract Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Contract Details
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Contract Length: </span>
                  <span className="font-medium text-gray-900">
                    {plan.contract_length_months === 0
                      ? 'Month-to-Month'
                      : `${plan.contract_length_months} Months`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Plan Type: </span>
                  <span className="font-medium text-gray-900">
                    {plan.plan_type}
                  </span>
                </div>
                {plan.renewable_percentage > 0 && (
                  <div>
                    <span className="text-gray-600">Renewable Energy: </span>
                    <span className="font-medium text-accent-teal">
                      {plan.renewable_percentage}%
                    </span>
                  </div>
                )}
                {plan.base_charge > 0 && (
                  <div>
                    <span className="text-gray-600">Base Charge: </span>
                    <span className="font-medium text-gray-900">
                      ${plan.base_charge.toFixed(2)}/month
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Plan Documents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Plan Documents
              </h4>
              <div className="space-y-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-sm text-primary-pink hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Electricity Facts Label (EFL)</span>
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-sm text-primary-pink hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Terms of Service (TOS)</span>
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-sm text-primary-pink hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Your Rights as a Customer (YRAC)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Early Termination Fee */}
          {plan.early_termination_fee !== null && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Early Termination Fee (ETF)
              </h4>
              <p className="text-lg font-bold text-gray-900 mb-2">
                {plan.early_termination_fee > 0
                  ? `$${plan.early_termination_fee.toFixed(2)}`
                  : 'None'}
              </p>
              {plan.early_termination_fee > 0 && (
                <p className="text-xs text-gray-700">
                  This fee will not be charged if you end your contract early
                  because you are moving out of the service area.
                </p>
              )}
            </div>
          )}

          {/* Footer - CTA Button */}
          <div className="space-y-3">
            <a
              href={plan.provider?.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full btn-primary text-center py-4 px-6 shadow-lg"
            >
              Check Availability
            </a>
            <button
              onClick={onClose}
              className="block w-full btn-secondary text-center py-3 px-6"
            >
              Back to Results
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Plans and pricing subject to change. Please review all plan documents
            before enrolling.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );

  // Use React Portal to render modal at document.body level
  return createPortal(modalContent, document.body);
}
