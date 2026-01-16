'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Star, ExternalLink, Search } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Plan {
  id: string
  plan_name: string
  rate_1000kwh: number
  contract_length_months: number
  plan_type: string
  is_featured: boolean
  is_active: boolean
  affiliate_url: string | null
  provider: {
    name: string
  }
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured'>('all')
  const [editingUrl, setEditingUrl] = useState<string | null>(null)
  const [urlValue, setUrlValue] = useState('')

  useEffect(() => {
    fetchPlans()
  }, [])

  async function fetchPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select(`
        id,
        plan_name,
        rate_1000kwh,
        contract_length_months,
        plan_type,
        is_featured,
        is_active,
        affiliate_url,
        provider:providers(name)
      `)
      .eq('is_active', true)
      .order('rate_1000kwh', { ascending: true })
      .limit(200)

    if (!error && data) {
      // Supabase returns provider as array, normalize to single object
      const normalized = data.map((plan: any) => ({
        ...plan,
        provider: Array.isArray(plan.provider) ? plan.provider[0] : plan.provider
      }))
      setPlans(normalized as Plan[])
    }
    setLoading(false)
  }

  async function toggleFeatured(planId: string, currentValue: boolean) {
    // Count current featured plans
    const featuredCount = plans.filter(p => p.is_featured).length
    
    // Don't allow more than 3 featured unless we're unfeaturing
    if (!currentValue && featuredCount >= 3) {
      alert('Maximum 3 featured plans allowed. Unfeature another plan first.')
      return
    }

    const { error } = await supabase
      .from('plans')
      .update({ is_featured: !currentValue })
      .eq('id', planId)

    if (!error) {
      setPlans(plans.map(p => 
        p.id === planId ? { ...p, is_featured: !currentValue } : p
      ))
    }
  }

  async function saveAffiliateUrl(planId: string) {
    const { error } = await supabase
      .from('plans')
      .update({ affiliate_url: urlValue || null })
      .eq('id', planId)

    if (!error) {
      setPlans(plans.map(p => 
        p.id === planId ? { ...p, affiliate_url: urlValue || null } : p
      ))
      setEditingUrl(null)
      setUrlValue('')
    }
  }

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(search.toLowerCase()) ||
      plan.provider.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'featured' && plan.is_featured)
    return matchesSearch && matchesFilter
  })

  const featuredCount = plans.filter(p => p.is_featured).length

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Plans</h1>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{featuredCount}/3 Featured Plans</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search plans or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'featured')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Plans</option>
          <option value="featured">Featured Only</option>
        </select>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affiliate URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No plans found</td>
              </tr>
            ) : (
              filteredPlans.map(plan => (
                <tr key={plan.id} className={plan.is_featured ? 'bg-yellow-50' : ''}>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(plan.id, plan.is_featured)}
                      className={`p-2 rounded-lg transition ${
                        plan.is_featured 
                          ? 'bg-yellow-400 text-yellow-900' 
                          : 'bg-gray-100 text-gray-400 hover:bg-yellow-100'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${plan.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">{plan.plan_name}</td>
                  <td className="px-4 py-3 text-gray-600">{plan.provider.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-green-600">
                      {(plan.rate_1000kwh * 100).toFixed(1)}¢
                    </span>
                  </td>
                  <td className="px-4 py-3">{plan.contract_length_months} mo</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      plan.plan_type === 'Fixed' ? 'bg-blue-100 text-blue-800' :
                      plan.plan_type === 'Variable' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {plan.plan_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingUrl === plan.id ? (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlValue}
                          onChange={(e) => setUrlValue(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <button
                          onClick={() => saveAffiliateUrl(plan.id)}
                          className="px-2 py-1 text-sm bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingUrl(null); setUrlValue(''); }}
                          className="px-2 py-1 text-sm bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {plan.affiliate_url ? (
                          <>
                            <a 
                              href={plan.affiliate_url} 
                              target="_blank" 
                              className="text-blue-600 hover:underline text-sm truncate max-w-[150px]"
                            >
                              {plan.affiliate_url}
                            </a>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">Not set</span>
                        )}
                        <button
                          onClick={() => { setEditingUrl(plan.id); setUrlValue(plan.affiliate_url || ''); }}
                          className="ml-auto px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
