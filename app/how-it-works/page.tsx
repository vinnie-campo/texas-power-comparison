import { Metadata } from 'next'
import Link from 'next/link'
import { Search, BarChart3, CheckCircle, Zap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How It Works | Texas Power Compare',
  description: 'Learn how to compare and switch electricity providers in Texas. Our simple 3-step process helps you find the best rates in minutes.',
}

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Enter Your ZIP Code',
      description: 'Start by entering your ZIP code to see available electricity plans in your area. Different areas have different providers and rates.',
      details: [
        'See all available providers in your area',
        'Filter by plan type (fixed, variable, renewable)',
        'View rates at different usage levels'
      ]
    },
    {
      number: 2,
      icon: BarChart3,
      title: 'Compare Plans',
      description: 'Review and compare plans side by side. We show you the true cost including all fees, so there are no surprises.',
      details: [
        'Compare rates at 500, 1000, and 2000 kWh',
        'See contract length and cancellation fees',
        'Check renewable energy percentage'
      ]
    },
    {
      number: 3,
      icon: CheckCircle,
      title: 'Choose & Switch',
      description: 'Select your preferred plan and sign up directly with the provider. Switching is seamless with no service interruption.',
      details: [
        'No service interruption during switch',
        'Provider handles the transition',
        'Start saving on your next bill'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl text-blue-100">
              Finding the best electricity rate in Texas is easy. Just follow these three simple steps.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-[39px] top-[100px] w-0.5 h-[calc(100%-60px)] bg-blue-200" />
                  )}

                  <div className="flex gap-6 md:gap-8">
                    {/* Step number */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl shadow-md p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          Step {step.number}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Common Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Will my power be interrupted when I switch?',
                  a: 'No. The switch happens seamlessly behind the scenes. Your electricity service continues without interruption.'
                },
                {
                  q: 'How long does it take to switch providers?',
                  a: 'Most switches complete within 1-2 billing cycles. Your new rate typically takes effect on your next meter read date.'
                },
                {
                  q: 'Do I need to notify my current provider?',
                  a: 'No. Your new provider handles the switch notification. You don\'t need to contact your current provider.'
                },
                {
                  q: 'Are there fees to switch providers?',
                  a: 'Check your current contract for early termination fees. If your contract is ending soon, you can switch without penalty.'
                },
                {
                  q: 'Is Texas Power Compare free to use?',
                  a: 'Yes! Our comparison service is completely free. We may receive a commission from providers when you sign up.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-8 md:p-12 text-center text-white">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-green-100 mb-8">
              Find the best electricity rate for your home in just minutes.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-8 rounded-lg transition"
            >
              Compare Rates Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
