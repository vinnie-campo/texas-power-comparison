import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sun,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Home,
  Calculator,
  Leaf,
  RefreshCw,
} from 'lucide-react';
import ZipSearch from '@/components/search/ZipSearch';
import FAQSection from '@/components/content/FAQSection';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Best Solar Buyback Plans in Texas 2025 | Compare Net Metering Rates',
  description:
    'Compare solar buyback and net metering plans in Texas. Find the best rates for selling excess solar energy back to the grid. Get paid for your solar production.',
  keywords: 'solar buyback Texas, net metering Texas, solar panel electricity plans, sell solar energy Texas, solar export rates',
  openGraph: {
    title: 'Best Solar Buyback Plans in Texas 2025',
    description:
      'Find electricity plans with the best solar buyback rates. Compare net metering options and maximize your solar panel investment.',
    type: 'website',
  },
};

const solarFAQs = [
  {
    question: 'How does solar buyback work in Texas?',
    answer:
      'Solar buyback (also called net metering) credits you for excess electricity your solar panels send to the grid. When your panels produce more than you use, the excess flows to the grid and you receive a credit on your bill. In Texas, buyback rates vary by provider - some offer retail rate credits, others offer wholesale rates around 5-8¢/kWh.',
  },
  {
    question: 'What is the best solar buyback rate in Texas?',
    answer:
      'The best solar buyback rates in Texas range from 8-12¢/kWh, with some plans offering 1:1 net metering (you get credited at the same rate you pay). Look for plans labeled "solar buyback" or "net metering" and compare the export rate vs. the import rate. The best plans have minimal spread between the two.',
  },
  {
    question: 'Do I need a special electricity plan for solar panels?',
    answer:
      'Yes, you need a plan that offers solar buyback or net metering. Standard plans don\'t credit you for excess production. Some providers offer dedicated solar plans with better buyback rates, while others include buyback as an option on regular plans. Always confirm the export rate before signing up.',
  },
  {
    question: 'Can I sell electricity back to the grid in Texas?',
    answer:
      'Yes! Texas allows residential solar customers to sell excess electricity back to the grid through solar buyback programs. You won\'t receive a check - instead, you get bill credits that offset your electricity costs. Some months you may have a $0 bill or carry credits forward.',
  },
  {
    question: 'What happens to unused solar credits?',
    answer:
      'In Texas, unused solar credits typically roll over month-to-month within your contract term. However, policies vary by provider - some may cash out credits annually, others may expire credits. Read your contract carefully. The best plans allow unlimited rollover during your contract period.',
  },
  {
    question: 'Is solar worth it in Texas without net metering?',
    answer:
      'Solar can still be worth it without full net metering, but your payback period will be longer. Texas has excellent sun exposure (4.5-5.5 peak sun hours daily), and even with lower buyback rates, you\'ll offset daytime usage. Pair solar with battery storage to maximize self-consumption and reduce grid dependence.',
  },
];

export default function SolarBuybackPage() {
  return (
    <>
      <StructuredData
        type="faqPage"
        faqItems={solarFAQs}
      />

      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-orange-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <Sun className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Best Solar Buyback Plans
                <br />
                <span className="text-yellow-200">in Texas</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Get <strong>paid for your solar production</strong>. Compare net metering rates
                and find plans that maximize your solar investment.
              </p>

              <div className="max-w-xl mx-auto mb-8">
                <ZipSearch variant="inline" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-200" />
                  <span>Up to 12¢/kWh Buyback</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-yellow-200" />
                  <span>Credits Roll Over</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-yellow-200" />
                  <span>100% Renewable</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW SOLAR BUYBACK WORKS */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Solar Buyback Works in Texas
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Understand the process and maximize your solar savings
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <Sun className="w-10 h-10 text-orange-500 mx-auto mb-4 mt-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Panels Generate Power</h3>
                  <p className="text-sm text-gray-600">Your solar panels convert sunlight into electricity</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <Home className="w-10 h-10 text-orange-500 mx-auto mb-4 mt-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Power Your Home</h3>
                  <p className="text-sm text-gray-600">Electricity powers your home first, reducing grid usage</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <Zap className="w-10 h-10 text-orange-500 mx-auto mb-4 mt-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Export Excess</h3>
                  <p className="text-sm text-gray-600">Extra power flows back to the grid automatically</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500 mx-auto mb-4 mt-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Earn Credits</h3>
                  <p className="text-sm text-gray-600">Receive bill credits for every kWh exported</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUYBACK RATE COMPARISON */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Calculator className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Solar Buyback Rate Comparison</h2>
                </div>

                <p className="text-gray-600 mb-8">
                  See how different buyback rates affect your annual savings (based on 8,000 kWh solar production with 40% exported)
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan Type</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Buyback Rate</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Annual Export (kWh)</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Annual Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Wholesale Buyback</td>
                        <td className="py-4 px-4 text-center text-gray-600">5¢/kWh</td>
                        <td className="py-4 px-4 text-center text-gray-600">3,200</td>
                        <td className="py-4 px-4 text-right font-medium text-gray-900">$160</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-700">Standard Solar Plan</td>
                        <td className="py-4 px-4 text-center text-gray-600">8¢/kWh</td>
                        <td className="py-4 px-4 text-center text-gray-600">3,200</td>
                        <td className="py-4 px-4 text-right font-medium text-gray-900">$256</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-green-50">
                        <td className="py-4 px-4 text-gray-700 font-medium">Premium Solar Buyback</td>
                        <td className="py-4 px-4 text-center text-green-600 font-medium">10¢/kWh</td>
                        <td className="py-4 px-4 text-center text-gray-600">3,200</td>
                        <td className="py-4 px-4 text-right font-bold text-green-600">$320</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-4 px-4 text-gray-700 font-medium">1:1 Net Metering</td>
                        <td className="py-4 px-4 text-center text-green-600 font-medium">12¢/kWh</td>
                        <td className="py-4 px-4 text-center text-gray-600">3,200</td>
                        <td className="py-4 px-4 text-right font-bold text-green-600">$384</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 bg-orange-50 rounded-lg p-6">
                  <p className="text-orange-800 font-medium">
                    <strong>Pro tip:</strong> The difference between wholesale (5¢) and 1:1 net metering (12¢) is <strong>$224/year</strong> in this example.
                    Over a 25-year panel lifespan, that&apos;s <strong>$5,600</strong> in additional savings!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO LOOK FOR */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What to Look for in a Solar Buyback Plan
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Key factors that affect your solar ROI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">High Buyback Rate</h3>
                <p className="text-gray-600 text-sm">
                  Look for rates of 8¢/kWh or higher. Some plans offer retail rate (1:1) credits up to 12¢/kWh.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Credit Rollover</h3>
                <p className="text-gray-600 text-sm">
                  Ensure unused credits roll over month-to-month. Summer production should cover winter bills.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Export Limits</h3>
                <p className="text-gray-600 text-sm">
                  Avoid plans that cap how much you can export. Unlimited exports maximize your solar value.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Low Import Rate</h3>
                <p className="text-gray-600 text-sm">
                  Compare the rate you pay when drawing from the grid. Evening and night usage still matters.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Low Base Charges</h3>
                <p className="text-gray-600 text-sm">
                  Monthly fees eat into savings. Look for plans with base charges under $10/month.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Contract Flexibility</h3>
                <p className="text-gray-600 text-sm">
                  Consider contract length and early termination fees. Rates change - flexibility has value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Sun className="w-16 h-16 mx-auto mb-6 text-yellow-200" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Find the Best Solar Buyback Plan
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Compare solar-friendly plans in your area and maximize your panel investment
              </p>
              <div className="max-w-xl mx-auto mb-6">
                <ZipSearch />
              </div>
              <p className="text-sm text-white/70">
                Free comparison - see buyback rates for all providers
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <FAQSection
              title="Solar Buyback Plan FAQs"
              description="Common questions about solar net metering and buyback rates in Texas"
              faqs={solarFAQs}
              includeSchema={false}
            />
          </div>
        </section>
      </div>
    </>
  );
}
