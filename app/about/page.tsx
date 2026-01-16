import { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Users, Target, Shield, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Texas Power Compare',
  description: 'Learn about Texas Power Compare - helping Texans find the best electricity rates since 2024. Our mission is to simplify electricity shopping.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Making Electricity Shopping Simple
            </h1>
            <p className="text-xl text-blue-100">
              We help Texans compare electricity rates from dozens of providers to find the best plan for their needs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  Texas has a deregulated electricity market, which means you have the power to choose your electricity provider. But with dozens of providers and hundreds of plans, finding the right one can be overwhelming.
                </p>
                <p className="text-gray-600 mb-4">
                  That&apos;s where we come in. Texas Power Compare makes it easy to compare rates, understand plan details, and switch to a better plan in minutes.
                </p>
                <p className="text-gray-600">
                  We believe every Texan deserves access to affordable electricity without the hassle of sifting through confusing rate structures and hidden fees.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Transparency First</h3>
                      <p className="text-sm text-gray-600">We show real rates with all fees included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Customer Focused</h3>
                      <p className="text-sm text-gray-600">Your needs come first, always</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Unbiased Comparisons</h3>
                      <p className="text-sm text-gray-600">We show all options, not just partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Rate Comparison',
                  description: 'Compare electricity rates from 50+ providers in seconds'
                },
                {
                  icon: CheckCircle,
                  title: 'Plan Analysis',
                  description: 'Understand the true cost with our detailed breakdowns'
                },
                {
                  icon: Users,
                  title: 'Provider Reviews',
                  description: 'Read reviews and ratings from real Texas customers'
                },
                {
                  icon: Target,
                  title: 'Usage Calculator',
                  description: 'Estimate your monthly bill based on your usage'
                },
                {
                  icon: Shield,
                  title: 'No Hidden Fees',
                  description: 'We show all-in rates so you know exactly what you\'ll pay'
                },
                {
                  icon: Zap,
                  title: 'Easy Switching',
                  description: 'Switch providers directly through our platform'
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Find a Better Rate?</h2>
            <p className="text-green-100 mb-8">
              Enter your ZIP code to compare electricity plans in your area.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-8 rounded-lg transition"
            >
              Compare Plans Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
