'use client';

import { useState } from 'react';
import { Filter, Zap, Calendar, Leaf, Building2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

// Filter state type
export interface FilterState {
  planTypes: string[];
  contractLengths: number[];
  minRenewable: number;
  providers: string[];
}

interface Provider {
  id: string;
  name: string;
}

interface PlanFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  availableProviders?: Provider[];
}

export default function PlanFilters({
  onFilterChange,
  currentFilters,
  availableProviders = [],
}: PlanFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');

  // Plan type options
  const planTypeOptions = [
    { value: 'Fixed', label: 'Fixed Rate' },
    { value: 'Variable', label: 'Variable Rate' },
    { value: 'Prepaid', label: 'Prepaid' },
  ];

  // Contract length options
  const contractLengthOptions = [
    { value: 0, label: 'Month-to-Month' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '12 Months' },
    { value: 24, label: '24 Months' },
    { value: 36, label: '36 Months' },
  ];

  // Calculate active filter count
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (currentFilters.planTypes.length > 0) count += currentFilters.planTypes.length;
    if (currentFilters.contractLengths.length > 0) count += currentFilters.contractLengths.length;
    if (currentFilters.minRenewable > 0) count += 1;
    if (currentFilters.providers.length > 0) count += currentFilters.providers.length;
    return count;
  };

  // Handle plan type toggle
  const handlePlanTypeToggle = (type: string) => {
    const newTypes = currentFilters.planTypes.includes(type)
      ? currentFilters.planTypes.filter((t) => t !== type)
      : [...currentFilters.planTypes, type];

    onFilterChange({ ...currentFilters, planTypes: newTypes });
  };

  // Handle contract length toggle
  const handleContractLengthToggle = (length: number) => {
    const newLengths = currentFilters.contractLengths.includes(length)
      ? currentFilters.contractLengths.filter((l) => l !== length)
      : [...currentFilters.contractLengths, length];

    onFilterChange({ ...currentFilters, contractLengths: newLengths });
  };

  // Handle renewable slider change
  const handleRenewableChange = (value: number) => {
    onFilterChange({ ...currentFilters, minRenewable: value });
  };

  // Handle provider toggle
  const handleProviderToggle = (providerId: string) => {
    const newProviders = currentFilters.providers.includes(providerId)
      ? currentFilters.providers.filter((p) => p !== providerId)
      : [...currentFilters.providers, providerId];

    onFilterChange({ ...currentFilters, providers: newProviders });
  };

  // Clear all filters
  const handleClearAll = () => {
    onFilterChange({
      planTypes: [],
      contractLengths: [],
      minRenewable: 0,
      providers: [],
    });
    setProviderSearch('');
  };

  // Filter providers by search
  const filteredProviders = availableProviders.filter((provider) =>
    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const displayedProviders = showAllProviders
    ? filteredProviders
    : filteredProviders.slice(0, 5);

  const activeCount = getActiveFilterCount();

  // Filter content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {activeCount > 0 && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {activeCount} active
          </span>
        )}
      </div>

      {/* Plan Type Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">Plan Type</h4>
        </div>
        <div className="space-y-2">
          {planTypeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={currentFilters.planTypes.includes(option.value)}
                onChange={() => handlePlanTypeToggle(option.value)}
                className="w-4 h-4 text-[#E5007D] border-gray-300 rounded focus:ring-2 focus:ring-[#E5007D]"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contract Length Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">Contract Length</h4>
        </div>
        <div className="space-y-2">
          {contractLengthOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={currentFilters.contractLengths.includes(option.value)}
                onChange={() => handleContractLengthToggle(option.value)}
                className="w-4 h-4 text-[#E5007D] border-gray-300 rounded focus:ring-2 focus:ring-[#E5007D]"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Renewable Energy Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-4 h-4 text-green-600" />
          <h4 className="font-medium text-gray-900">Renewable Energy</h4>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Minimum {currentFilters.minRenewable}% renewable
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={currentFilters.minRenewable}
            onChange={(e) => handleRenewableChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D4AA]"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Providers Section */}
      {availableProviders.length > 0 && (
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Providers</h4>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Provider list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {displayedProviders.length > 0 ? (
              displayedProviders.map((provider) => (
                <label
                  key={provider.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={currentFilters.providers.includes(provider.id)}
                    onChange={() => handleProviderToggle(provider.id)}
                    className="w-4 h-4 text-[#E5007D] border-gray-300 rounded focus:ring-2 focus:ring-[#E5007D]"
                  />
                  <span className="text-sm text-gray-700">{provider.name}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No providers found
              </p>
            )}
          </div>

          {/* Show more/less button */}
          {filteredProviders.length > 5 && (
            <button
              onClick={() => setShowAllProviders(!showAllProviders)}
              className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
            >
              {showAllProviders ? (
                <>
                  Show less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show {filteredProviders.length - 5} more
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Clear All Button */}
      {activeCount > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Filter Button and Drawer */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {/* Drawer Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Sticky Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-4 bg-light-blue rounded-2xl shadow-lg p-6">
          <FilterContent />
        </div>
      </div>
    </>
  );
}
