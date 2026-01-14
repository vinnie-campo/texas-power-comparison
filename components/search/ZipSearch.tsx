'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface ZipSearchProps {
  onSearch?: (zipCode: string) => void;
}

export default function ZipSearch({ onSearch }: ZipSearchProps) {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  const validateZipCode = (zip: string): boolean => {
    // Check if exactly 5 digits
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and limit to 5 characters
    if (value === '' || /^\d{0,5}$/.test(value)) {
      setZipCode(value);
      setError(''); // Clear error when user types
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!zipCode) {
      setError('Please enter a ZIP code');
      return;
    }

    if (!validateZipCode(zipCode)) {
      setError('ZIP code must be exactly 5 digits');
      return;
    }

    // Clear error and trigger search
    setError('');

    // If onSearch callback is provided, use it; otherwise navigate to compare page
    if (onSearch) {
      onSearch(zipCode);
    } else {
      router.push(`/compare?zip=${zipCode}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <label
            htmlFor="zip-code"
            className="block text-lg font-semibold text-secondary-blue"
          >
            enter your ZIP code
          </label>

          {/* Input Field */}
          <div className="relative">
            <input
              id="zip-code"
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={handleInputChange}
              placeholder="75001"
              maxLength={5}
              className={`
                w-full px-5 py-4 text-lg border-2 rounded-2xl
                focus:outline-none focus:ring-2 focus:ring-[#E5007D]
                transition-all duration-200
                ${error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#E5007D]'
                }
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'zip-error' : undefined}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p
              id="zip-error"
              className="text-red-600 text-sm font-medium flex items-center gap-1"
              role="alert"
            >
              <span className="inline-block w-4 h-4 text-center leading-4 bg-red-100 rounded-full text-xs">!</span>
              {error}
            </p>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            search plans
          </button>
        </form>

        {/* Helper Text */}
        <p className="mt-4 text-sm text-secondary-blue/70 text-center">
          find the best electricity rates in your area
        </p>
      </div>
    </div>
  );
}
