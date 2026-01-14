'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown, AlertTriangle, ExternalLink } from 'lucide-react';

interface PlanChange {
  type: 'new' | 'updated' | 'removed';
  planId?: string;
  planName: string;
  providerName: string;
  oldRate?: number;
  newRate?: number;
  changes?: string[];
}

interface ScrapeSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  zipCodesScraped: string[];
  totalPlansFound: number;
  uniquePlans: number;
  newPlans: PlanChange[];
  updatedPlans: PlanChange[];
  removedPlans: PlanChange[];
  errors: string[];
  warnings: string[];
  dataSource: 'api' | 'estimated' | 'mixed';
}

export default function ScrapePage() {
  const [scraping, setScraping] = useState(false);
  const [session, setSession] = useState<ScrapeSession | null>(null);
  const [lastScrapeTime, setLastScrapeTime] = useState<string | null>(null);

  const handleRunScrape = async (autoApply: boolean = false) => {
    setScraping(true);
    setSession(null);

    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ autoApply }),
      });

      const data = await response.json();

      if (data.success && data.session) {
        setSession(data.session);
        setLastScrapeTime(new Date().toISOString());
      } else {
        alert(`Scrape failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error running scrape:', error);
      alert('Error running scrape. Check console for details.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Scraper</h2>
        <p className="text-gray-600">
          Automatically fetch and update electricity plans from Power to Choose
        </p>
      </div>

      {/* Last Scrape Info */}
      {lastScrapeTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              Last scrape: {new Date(lastScrapeTime).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Run Scraper</h3>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => handleRunScrape(false)}
              disabled={scraping}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {scraping ? 'Scraping...' : 'Run Scrape (Preview Only)'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Preview changes without applying them to the database
            </p>
          </div>

          <div>
            <button
              onClick={() => handleRunScrape(true)}
              disabled={scraping}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              {scraping ? 'Scraping...' : 'Run Scrape & Auto-Apply'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Automatically update database with rate changes and deactivate removed plans
            </p>
          </div>
        </div>

        {scraping && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">
                Scraping electricity plans from Power to Choose...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scrape Results */}
      {session && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Scrape Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {session.totalPlansFound}
                </div>
                <div className="text-sm text-blue-800">Total Plans Found</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {session.newPlans.length}
                </div>
                <div className="text-sm text-green-800">New Plans</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {session.updatedPlans.length}
                </div>
                <div className="text-sm text-orange-800">Updated Plans</div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {session.removedPlans.length}
                </div>
                <div className="text-sm text-red-800">Removed Plans</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>ZIP codes scraped: {session.zipCodesScraped.join(', ')}</p>
              <p>Unique plans: {session.uniquePlans}</p>
              <p>Status: <span className={`font-medium ${session.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{session.status}</span></p>
              <p className="flex items-center gap-2 mt-2">
                Data Source:
                {session.dataSource === 'api' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Live API Data
                  </span>
                )}
                {session.dataSource === 'estimated' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Estimated Market Data
                  </span>
                )}
                {session.dataSource === 'mixed' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Mixed Sources
                  </span>
                )}
              </p>
            </div>

            {/* Data Source Warning */}
            {(session.dataSource === 'estimated' || session.dataSource === 'mixed') && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      Using Estimated Market Data
                    </h4>
                    <p className="text-sm text-yellow-800 mb-2">
                      Unable to connect to Power to Choose API directly. The data shown is based on estimated current market rates for Texas electricity plans.
                    </p>
                    <p className="text-sm text-yellow-800 mb-3">
                      <strong>Important:</strong> Please verify all rates and plan details at Power to Choose before publishing to users.
                    </p>
                    <a
                      href="https://www.powertochoose.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-yellow-900 hover:text-yellow-700 underline"
                    >
                      Verify rates at powertochoose.org
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* General Warnings */}
            {session.warnings && session.warnings.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  Warnings ({session.warnings.length})
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {session.warnings.map((warning, i) => (
                    <li key={i}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {session.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Errors ({session.errors.length})
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {session.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* New Plans */}
          {session.newPlans.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">{session.newPlans.length}</span>
                </span>
                New Plans Found
              </h3>

              <div className="space-y-2">
                {session.newPlans.map((change, i) => (
                  <div key={i} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{change.planName}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          by {change.providerName}
                        </span>
                      </div>
                      <div className="text-green-700 font-bold">
                        {change.newRate?.toFixed(1)}¢ per kWh
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                ℹ️ New plans are not automatically added to the database. Review and add manually through the admin panel.
              </p>
            </div>
          )}

          {/* Updated Plans */}
          {session.updatedPlans.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">{session.updatedPlans.length}</span>
                </span>
                Price Changes Detected
              </h3>

              <div className="space-y-2">
                {session.updatedPlans.map((change, i) => {
                  const rateIncrease = (change.newRate || 0) > (change.oldRate || 0);
                  return (
                    <div key={i} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-medium text-gray-900">{change.planName}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            by {change.providerName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">
                          {change.oldRate?.toFixed(1)}¢
                        </span>
                        {rateIncrease ? (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        )}
                        <span className={`font-bold ${rateIncrease ? 'text-red-600' : 'text-green-600'}`}>
                          {change.newRate?.toFixed(1)}¢
                        </span>
                        <span className={`text-xs ${rateIncrease ? 'text-red-600' : 'text-green-600'}`}>
                          ({rateIncrease ? '+' : ''}{((change.newRate || 0) - (change.oldRate || 0)).toFixed(1)}¢)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Removed Plans */}
          {session.removedPlans.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">{session.removedPlans.length}</span>
                </span>
                Plans No Longer Available
              </h3>

              <div className="space-y-2">
                {session.removedPlans.map((change, i) => (
                  <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{change.planName}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          by {change.providerName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Was {change.oldRate?.toFixed(1)}¢
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Attempts to fetch electricity plan data from Power to Choose (official Texas site)</li>
          <li>• Falls back to estimated market data based on current Texas electricity rates if API is unavailable</li>
          <li>• Checks major ZIP codes across Texas (Houston, Dallas, Austin, Fort Worth, San Antonio, El Paso)</li>
          <li>• Deduplicates plans that appear in multiple ZIP codes</li>
          <li>• Compares with your database to identify new plans, price changes, and removed plans</li>
          <li>• Auto-apply mode: Updates rates and deactivates removed plans automatically</li>
          <li>• Preview mode: Shows changes without modifying the database</li>
          <li>• Rate limiting: 2-second delay between ZIP code requests to be respectful</li>
        </ul>

        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">About Estimated Data</h4>
          <p className="text-sm text-gray-700 mb-2">
            Power to Choose uses a dynamic website that doesn't provide a simple API. When the direct connection isn't available, the scraper generates estimated plan data based on current Texas electricity market conditions (typically 8-16¢ per kWh).
          </p>
          <p className="text-sm text-gray-700">
            <strong>Always verify</strong> estimated data at <a href="https://www.powertochoose.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">powertochoose.org</a> before publishing to users.
          </p>
        </div>
      </div>
    </div>
  );
}
