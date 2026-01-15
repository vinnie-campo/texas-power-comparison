'use client'

import { useState, useEffect } from 'react'
import { Star, Award, Zap } from 'lucide-react'
import Link from 'next/link'

interface FeaturedPlan {
  id: string
  plan_name: string
  rate_1000kwh: number
  contract_length_months: number
  renewable_percentage: number
  plan_type: string
  affiliate_url?: string
  provider: {
    name: string
    slug: string
  }
}

export default function FeaturedPlans({ zip }: { zip?: string }) {
  const [plans, setPlans] = useState<FeaturedPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`/api/featured-plans${zip ? `?zip=${zip}` : ''}`)
        const data = await res.json()
        setPlans(data.plans || [])
      } catch (e) {
        console.error('Error fetching featured plans:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [zip])

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-xl" />
        ))}
      </div>
    )
  }

  if (plans.length === 0) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Editor's Top Picks</h2>
        <span className="text-sm text-gray-500 ml-2">Best value plans selected by our experts</span>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 overflow-hidden
              ${index === 0 ? 'border-yellow-400' : 'border-gray-200'}
            `}
          >
            {index === 0 && (
              <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold text-center py-1">
                <Star className="w-3 h-3 inline mr-1" />
                BEST OVERALL
              </div>
            )}
            {index === 1 && (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xs font-bold text-center py-1">
                <Zap className="w-3 h-3 inline mr-1" />
                LOWEST RATE
              </div>
            )}
            {index === 2 && (
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-xs font-bold text-center py-1">
                MOST POPULAR
              </div>
            )}
            
            <div className={`p-6 ${index < 3 ? 'pt-10' : ''}`}>
              <div className="text-sm text-gray-600 mb-1">{plan.provider.name}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">{plan.plan_name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-green-600">
                  {(plan.rate_1000kwh * 100).toFixed(1)}
                </span>
                <span className="text-lg text-gray-600">¢/kWh</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Contract</span>
                  <span className="font-medium">{plan.contract_length_months} months</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan Type</span>
                  <span className="font-medium">{plan.plan_type}</span>
                </div>
                {plan.renewable_percentage > 0 && (
                  <div className="flex justify-between">
                    <span>Renewable</span>
                    <span className="font-medium text-green-600">{plan.renewable_percentage}%</span>
                  </div>
                )}
              </div>
              
              
                <a
                href={plan.affiliate_url || `/compare?plan=${plan.id}`}
                target={plan.affiliate_url ? '_blank' : '_self'}
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition"
              >
                View Plan
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
