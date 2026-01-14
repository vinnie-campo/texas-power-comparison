'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
}

const PLAN_FEATURES = [
  { id: 'free_nights', label: 'Free Nights' },
  { id: 'free_weekends', label: 'Free Weekends' },
  { id: 'bill_credit', label: 'Bill Credit' },
  { id: 'no_deposit', label: 'No Deposit' },
  { id: 'smart_thermostat', label: 'Smart Thermostat Included' },
  { id: 'renewable_energy', label: '100% Renewable Energy' },
  { id: 'fixed_rate', label: 'Fixed Rate Guarantee' },
  { id: 'no_cancellation_fee', label: 'No Cancellation Fee' },
];

export default function NewPlan() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    provider_id: '',
    plan_name: '',
    plan_type: 'Fixed',
    contract_length_months: 12,
    rate_500kwh: '',
    rate_1000kwh: '',
    rate_2000kwh: '',
    base_charge: '0',
    early_termination_fee: '0',
    renewable_percentage: '0',
    features: [] as string[],
    efl_url: '',
    tos_url: '',
    yrac_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    const features = formData.features.includes(featureId)
      ? formData.features.filter((f) => f !== featureId)
      : [...formData.features, featureId];
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.provider_id || !formData.plan_name) {
        setError('Provider and Plan Name are required');
        setLoading(false);
        return;
      }

      if (!formData.rate_500kwh || !formData.rate_1000kwh || !formData.rate_2000kwh) {
        setError('All rate tiers (500, 1000, 2000 kWh) are required');
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const planData = {
        provider_id: formData.provider_id,
        plan_name: formData.plan_name,
        plan_type: formData.plan_type,
        contract_length_months: parseInt(formData.contract_length_months.toString()),
        rate_500kwh: parseFloat(formData.rate_500kwh),
        rate_1000kwh: parseFloat(formData.rate_1000kwh),
        rate_2000kwh: parseFloat(formData.rate_2000kwh),
        base_charge: parseFloat(formData.base_charge),
        early_termination_fee: parseFloat(formData.early_termination_fee),
        renewable_percentage: parseInt(formData.renewable_percentage),
        features: formData.features,
        efl_url: formData.efl_url || null,
        tos_url: formData.tos_url || null,
        yrac_url: formData.yrac_url || null,
        is_active: formData.is_active,
      };

      const response = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/plans');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create plan');
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      setError('An error occurred while creating the plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/plans"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Plans
        </Link>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Plan</h2>
        <p className="text-gray-600">Create a new electricity plan</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            ✓ Plan created successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Provider Selection */}
        <div>
          <label htmlFor="provider_id" className="block text-sm font-medium text-gray-700 mb-2">
            Provider *
          </label>
          <select
            id="provider_id"
            name="provider_id"
            value={formData.provider_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Name */}
        <div>
          <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700 mb-2">
            Plan Name *
          </label>
          <input
            type="text"
            id="plan_name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleChange}
            required
            placeholder="e.g., Energy Saver 12"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Plan Type & Contract Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="plan_type" className="block text-sm font-medium text-gray-700 mb-2">
              Plan Type *
            </label>
            <select
              id="plan_type"
              name="plan_type"
              value={formData.plan_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Fixed">Fixed</option>
              <option value="Variable">Variable</option>
              <option value="Prepaid">Prepaid</option>
            </select>
          </div>

          <div>
            <label htmlFor="contract_length_months" className="block text-sm font-medium text-gray-700 mb-2">
              Contract Length (months) *
            </label>
            <input
              type="number"
              id="contract_length_months"
              name="contract_length_months"
              value={formData.contract_length_months}
              onChange={handleChange}
              required
              min="0"
              placeholder="0 for month-to-month"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Rates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rates (cents per kWh) *
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="rate_500kwh" className="block text-sm font-medium text-gray-700 mb-2">
                @ 500 kWh
              </label>
              <input
                type="number"
                id="rate_500kwh"
                name="rate_500kwh"
                value={formData.rate_500kwh}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                placeholder="12.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rate_1000kwh" className="block text-sm font-medium text-gray-700 mb-2">
                @ 1,000 kWh
              </label>
              <input
                type="number"
                id="rate_1000kwh"
                name="rate_1000kwh"
                value={formData.rate_1000kwh}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                placeholder="11.2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rate_2000kwh" className="block text-sm font-medium text-gray-700 mb-2">
                @ 2,000 kWh
              </label>
              <input
                type="number"
                id="rate_2000kwh"
                name="rate_2000kwh"
                value={formData.rate_2000kwh}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                placeholder="10.8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="base_charge" className="block text-sm font-medium text-gray-700 mb-2">
              Base Charge ($/month)
            </label>
            <input
              type="number"
              id="base_charge"
              name="base_charge"
              value={formData.base_charge}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="9.95"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="early_termination_fee" className="block text-sm font-medium text-gray-700 mb-2">
              Early Termination Fee ($)
            </label>
            <input
              type="number"
              id="early_termination_fee"
              name="early_termination_fee"
              value={formData.early_termination_fee}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="150.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Renewable Percentage */}
        <div>
          <label htmlFor="renewable_percentage" className="block text-sm font-medium text-gray-700 mb-2">
            Renewable Energy Percentage (0-100)
          </label>
          <input
            type="number"
            id="renewable_percentage"
            name="renewable_percentage"
            value={formData.renewable_percentage}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLAN_FEATURES.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Document URLs */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Documents</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="efl_url" className="block text-sm font-medium text-gray-700 mb-2">
                Electricity Facts Label (EFL) URL
              </label>
              <input
                type="url"
                id="efl_url"
                name="efl_url"
                value={formData.efl_url}
                onChange={handleChange}
                placeholder="https://example.com/efl.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="tos_url" className="block text-sm font-medium text-gray-700 mb-2">
                Terms of Service (TOS) URL
              </label>
              <input
                type="url"
                id="tos_url"
                name="tos_url"
                value={formData.tos_url}
                onChange={handleChange}
                placeholder="https://example.com/tos.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="yrac_url" className="block text-sm font-medium text-gray-700 mb-2">
                Your Rights as a Customer (YRAC) URL
              </label>
              <input
                type="url"
                id="yrac_url"
                name="yrac_url"
                value={formData.yrac_url}
                onChange={handleChange}
                placeholder="https://example.com/yrac.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#003366] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Plan is Active (visible to users)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Plan'}
          </button>

          <Link
            href="/admin/plans"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
