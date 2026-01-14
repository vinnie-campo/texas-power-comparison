'use client';

import { useState } from 'react';
import { Home, Building2, Building, Users, Ruler, Car, Sun, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getClimateModifier } from '@/lib/climate';

interface UsageCalculatorQuizProps {
  zipCode: string;
  onCalculated: (usage: number, breakdown: UsageBreakdown) => void;
}

interface UsageBreakdown {
  base: number;
  bedrooms: number;
  sqft: number;
  ev: number;
  solar: number;
  climate: number;
  total: number;
}

type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse';
type Bedrooms = '1' | '2' | '3' | '4' | '5+';
type SquareFootage = '<1000' | '1000-1500' | '1500-2000' | '2000-3000' | '3000+';
type EVStatus = 'yes' | 'no' | 'planning';
type SolarStatus = 'yes' | 'no' | 'considering';

export default function UsageCalculatorQuiz({
  zipCode,
  onCalculated,
}: UsageCalculatorQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [bedrooms, setBedrooms] = useState<Bedrooms | null>(null);
  const [sqft, setSqft] = useState<SquareFootage | null>(null);
  const [ev, setEV] = useState<EVStatus | null>(null);
  const [solar, setSolar] = useState<SolarStatus | null>(null);
  const [breakdown, setBreakdown] = useState<UsageBreakdown | null>(null);

  const totalSteps = 5;

  // Calculate usage based on all factors
  const calculateUsage = (): UsageBreakdown => {
    // Base usage by property type
    const baseUsage: Record<PropertyType, number> = {
      apartment: 600,
      condo: 700,
      townhouse: 900,
      house: 1100,
    };
    const base = propertyType ? baseUsage[propertyType] : 0;

    // Bedroom modifier
    const bedroomCount = bedrooms === '5+' ? 5 : parseInt(bedrooms || '2');
    const bedroomModifier = Math.max((bedroomCount - 2) * 150, 0);

    // Square footage modifier
    const sqftModifiers: Record<SquareFootage, number> = {
      '<1000': -100,
      '1000-1500': 0,
      '1500-2000': 100,
      '2000-3000': 200,
      '3000+': 350,
    };
    const sqftModifier = sqft ? sqftModifiers[sqft] : 0;

    // EV modifier
    const evModifier = ev === 'yes' ? 350 : ev === 'planning' ? 175 : 0;

    // Calculate subtotal before solar
    let subtotal = base + bedroomModifier + sqftModifier + evModifier;

    // Solar modifier (percentage reduction)
    const solarReduction = solar === 'yes' ? subtotal * 0.4 : 0;
    subtotal -= solarReduction;

    // Climate modifier based on ZIP code
    const climateModifierPercentage = getClimateModifier(zipCode);
    const climateModifier = subtotal * climateModifierPercentage;
    const total = Math.round(subtotal + climateModifier);

    return {
      base,
      bedrooms: bedroomModifier,
      sqft: sqftModifier,
      ev: evModifier,
      solar: -Math.round(solarReduction),
      climate: Math.round(climateModifier),
      total,
    };
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate and show results
      const result = calculateUsage();
      setBreakdown(result);
      setCurrentStep(6); // Show summary
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (breakdown) {
      onCalculated(breakdown.total, breakdown);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return propertyType !== null;
      case 2:
        return bedrooms !== null;
      case 3:
        return sqft !== null;
      case 4:
        return ev !== null;
      case 5:
        return solar !== null;
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      {currentStep <= totalSteps && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Question 1: Property Type */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What type of property do you have?
            </h2>
            <p className="text-gray-600">This helps us estimate your base energy usage</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'house' as PropertyType, label: 'House', icon: Home },
              { value: 'apartment' as PropertyType, label: 'Apartment', icon: Building2 },
              { value: 'condo' as PropertyType, label: 'Condo', icon: Building },
              { value: 'townhouse' as PropertyType, label: 'Townhouse', icon: Building2 },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setPropertyType(option.value)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    propertyType === option.value
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-300 hover:border-blue-400 hover:shadow'
                  }`}
                >
                  <Icon className={`w-10 h-10 mx-auto mb-3 ${
                    propertyType === option.value ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div className={`font-semibold ${
                    propertyType === option.value ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question 2: Bedrooms */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              How many bedrooms?
            </h2>
            <p className="text-gray-600">More bedrooms typically mean higher energy use</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {(['1', '2', '3', '4', '5+'] as Bedrooms[]).map((num) => (
              <button
                key={num}
                onClick={() => setBedrooms(num)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  bedrooms === num
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                }`}
              >
                <div className={`text-2xl font-bold ${
                  bedrooms === num ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {num}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question 3: Square Footage */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <Ruler className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What's your square footage?
            </h2>
            <p className="text-gray-600">Larger spaces require more heating and cooling</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: '<1000' as SquareFootage, label: 'Under 1,000 sq ft' },
              { value: '1000-1500' as SquareFootage, label: '1,000 - 1,500 sq ft' },
              { value: '1500-2000' as SquareFootage, label: '1,500 - 2,000 sq ft' },
              { value: '2000-3000' as SquareFootage, label: '2,000 - 3,000 sq ft' },
              { value: '3000+' as SquareFootage, label: 'Over 3,000 sq ft' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSqft(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  sqft === option.value
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                }`}
              >
                <div className={`font-semibold ${
                  sqft === option.value ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question 4: Electric Vehicle */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <Car className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Do you have an Electric Vehicle?
            </h2>
            <p className="text-gray-600">Charging at home significantly increases usage</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'yes' as EVStatus, label: 'Yes, I charge at home', extra: '+350 kWh/month' },
              { value: 'planning' as EVStatus, label: 'Planning to get one', extra: '+175 kWh/month' },
              { value: 'no' as EVStatus, label: 'No', extra: 'No change' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setEV(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  ev === option.value
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                }`}
              >
                <div className={`font-semibold mb-1 ${
                  ev === option.value ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-500">{option.extra}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question 5: Solar Panels */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <Sun className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Do you have Solar Panels?
            </h2>
            <p className="text-gray-600">Solar can significantly reduce grid usage</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'yes' as SolarStatus, label: 'Yes, I have solar panels', extra: '-40% usage' },
              { value: 'considering' as SolarStatus, label: 'Considering installation', extra: 'No change yet' },
              { value: 'no' as SolarStatus, label: 'No solar panels', extra: 'No change' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSolar(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  solar === option.value
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                }`}
              >
                <div className={`font-semibold mb-1 ${
                  solar === option.value ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-500">{option.extra}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {currentStep === 6 && breakdown && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Estimated Monthly Usage
            </h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {breakdown.total} kWh
            </div>
            <p className="text-gray-600">Based on your home profile</p>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">Usage Breakdown:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base usage ({propertyType}):</span>
                <span className="font-medium">{breakdown.base} kWh</span>
              </div>
              {breakdown.bedrooms > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms adjustment:</span>
                  <span className="font-medium">+{breakdown.bedrooms} kWh</span>
                </div>
              )}
              {breakdown.sqft !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Square footage:</span>
                  <span className="font-medium">
                    {breakdown.sqft > 0 ? '+' : ''}{breakdown.sqft} kWh
                  </span>
                </div>
              )}
              {breakdown.ev > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Electric vehicle:</span>
                  <span className="font-medium">+{breakdown.ev} kWh</span>
                </div>
              )}
              {breakdown.solar < 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Solar panels:</span>
                  <span className="font-medium text-green-600">{breakdown.solar} kWh</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Climate adjustment:</span>
                <span className="font-medium">+{breakdown.climate} kWh</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">{breakdown.total} kWh</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Find Plans for {breakdown.total} kWh/month
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      {currentStep <= totalSteps && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Calculate' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
