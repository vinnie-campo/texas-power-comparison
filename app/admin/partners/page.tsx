'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Conversion {
  id: string
  plan_id: string
  zip_code: string
  converted_at: string
  commission_amount: number
  status: string
}

interface Stats {
  totalConversions: number
  pendingCommissions: number
  paidCommissions: number
  thisMonth: number
}

export default function PartnersPage() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [stats, setStats] = useState<Stats>({
    totalConversions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    thisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('conversions')
        .select('*')
        .order('converted_at', { ascending: false })
        .limit(50)
      
      setConversions(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const pending = data?.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0
      const paid = data?.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0
      const thisMonth = data?.filter(c => {
        const date = new Date(c.converted_at)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }).length || 0
      
      setStats({ totalConversions: total, pendingCommissions: pending, paidCommissions: paid, thisMonth })
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">REP Partner Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <span className="text-gray-600">Total Conversions</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalConversions}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-green-500" />
            <span className="text-gray-600">This Month</span>
          </div>
          <div className="text-3xl font-bold">{stats.thisMonth}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-yellow-500" />
            <span className="text-gray-600">Pending</span>
          </div>
          <div className="text-3xl font-bold">${stats.pendingCommissions.toFixed(2)}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-gray-600">Paid</span>
          </div>
          <div className="text-3xl font-bold">${stats.paidCommissions.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Conversions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Recent Conversions</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : conversions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No conversions yet. Share your affiliate links to start earning!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ZIP Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conversions.map(conv => (
                <tr key={conv.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(conv.converted_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{conv.zip_code}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    ${(conv.commission_amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      conv.status === 'paid' ? 'bg-green-100 text-green-800' :
                      conv.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {conv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
