'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface ZipSearchProps {
  onSearch?: (zipCode: string) => void;
  variant?: 'default' | 'inline';
}

export default function ZipSearch({ onSearch, variant = 'default' }: ZipSearchProps) {
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

  // Inline variant for hero section
  if (variant === 'inline') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Label - visually hidden but accessible */}
          <label htmlFor="zip-code" className="sr-only">
            Enter Your ZIP Code
          </label>

          {/* Input + Button Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <div className="w-full sm:w-auto">
              <input
                id="zip-code"
                type="text"
                inputMode="numeric"
                value={zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                maxLength={5}
                className={`
                  w-full sm:w-[220px] px-6 py-4 text-lg rounded-xl
                  bg-white text-[#003366] placeholder:text-gray-400
                  border-2 shadow-lg
                  focus:outline-none focus:ring-4 focus:ring-[#00943C]/30
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white focus:border-[#00943C]'
                  }
                `}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'zip-error' : undefined}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto px-8 py-4 text-lg rounded-xl shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Get a Quote</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p
              id="zip-error"
              className="text-red-100 text-sm font-medium flex items-center gap-1 mt-3 justify-center"
              role="alert"
            >
              <span className="inline-block w-4 h-4 text-center leading-4 bg-red-200 rounded-full text-xs text-red-800">!</span>
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Default variant (original design)
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <label
            htmlFor="zip-code"
            className="block text-lg font-semibold text-[#003366]"
          >
            Enter Your ZIP Code
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
                w-full px-5 py-4 text-lg border-2 rounded-lg
                text-[#003366] placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#00943C]
                transition-all duration-200
                ${error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#00943C]'
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
            Search Plans
          </button>
        </form>

        {/* Helper Text */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Find the best electricity rates in your area
        </p>
      </div>
    </div>
  );
}
