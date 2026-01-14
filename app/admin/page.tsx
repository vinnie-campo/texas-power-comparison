import { createServerClient } from '@/lib/supabase';
import Link from 'next/link';
import { Building2, FileText, MapPin, TrendingUp, Plus, RefreshCw } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createServerClient();

  // Fetch statistics
  const { count: providerCount } = await supabase
    .from('providers')
    .select('*', { count: 'exact', head: true });

  const { count: planCount } = await supabase
    .from('plans')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: totalPlanCount } = await supabase
    .from('plans')
    .select('*', { count: 'exact', head: true });

  const { count: cityCount } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });

  // Fetch recent plans
  const { data: recentPlans } = await supabase
    .from('plans')
    .select('id, plan_name, rate_1000kwh, created_at, provider:providers(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Manage your Texas electricity comparison platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Providers Stat */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {providerCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Providers</div>
        </div>

        {/* Plans Stat */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {planCount || 0}
          </div>
          <div className="text-sm text-gray-600">Active Plans</div>
        </div>

        {/* Total Plans Stat */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalPlanCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Plans</div>
        </div>

        {/* Cities Stat */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {cityCount || 0}
          </div>
          <div className="text-sm text-gray-600">Cities Covered</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/plans"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Manage Plans</h3>
              <p className="text-sm text-gray-600">View and edit electricity plans</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/plans/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Plan</h3>
              <p className="text-sm text-gray-600">Create a new electricity plan</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/providers"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Manage Providers</h3>
              <p className="text-sm text-gray-600">View and edit providers</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/scrape"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-orange-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Plan Scraper</h3>
              <p className="text-sm text-gray-600">Auto-update plans from Power to Choose</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Plans</h3>

        {recentPlans && recentPlans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Plan Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Provider
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Rate @ 1000 kWh
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPlans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {plan.plan_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {plan.provider?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {plan.rate_1000kwh.toFixed(1)}¢
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No plans found</p>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/admin/plans"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
