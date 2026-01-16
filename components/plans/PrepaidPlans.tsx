'use client'

import { useState, useEffect } from 'react'
import { Shield, CreditCard, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PrepaidPlan {
  id: string
  plan_name: string
  rate_1000kwh: number
  contract_length_months: number
  provider: {
    name: string
    slug: string
  }
}

export default function PrepaidPlans({ zip }: { zip?: string }) {
  const [plans, setPlans] = useState<PrepaidPlan[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchPrepaid() {
      try {
        const res = await fetch(`/api/prepaid-plans${zip ? `?zip=${zip}` : ''}`)
        const data = await res.json()
        setPlans(data.plans || [])
      } catch (e) {
        console.error('Error fetching prepaid plans:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPrepaid()
  }, [zip])

  if (loading) {
    return (
      <div className="bg-purple-50 rounded-xl p-6 mb-8 animate-pulse">
        <div className="h-8 bg-purple-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-purple-100 rounded"></div>
      </div>
    )
  }

  if (plans.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-purple-600 p-2 rounded-lg">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('prepaidPlans')}</h2>
      </div>
      
      <div className="flex gap-4 mb-4">
        <span className="inline-flex items-center gap-1 text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          <Shield className="w-4 h-4" />
          {t('noDeposit')}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          <CreditCard className="w-4 h-4" />
          {t('noCreditCheck')}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{t('prepaidDesc')}</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        {plans.slice(0, 3).map(plan => (
          <div key={plan.id} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="text-sm text-gray-500 mb-1">{plan.provider.name}</div>
            <div className="font-semibold text-gray-900 mb-2">{plan.plan_name}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-600">
                {(plan.rate_1000kwh * 100).toFixed(1)}
              </span>
              <span className="text-gray-500">¢/kWh</span>
            </div>
            <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition">
              {t('viewDetails')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
