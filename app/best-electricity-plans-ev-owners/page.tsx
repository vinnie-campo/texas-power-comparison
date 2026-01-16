import { Metadata } from 'next';
import Link from 'next/link';
import {
  Car,
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  TrendingDown,
  Battery,
  Moon,
  Calculator,
} from 'lucide-react';
import ZipSearch from '@/components/search/ZipSearch';
import FAQSection from '@/components/content/FAQSection';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Best Electricity Plans for EV Owners in Texas | Free Nights & Charging Savings',
  description:
    'Find the best electricity plans for electric vehicle owners in Texas. Compare free nights plans, calculate charging costs, and save up to $100/month on EV charging at home.',
  keywords: 'EV electricity plans Texas, electric vehicle charging rates, free nights electricity, Tesla charging plans, EV home charging costs',
  openGraph: {
    title: 'Best Electricity Plans for EV Owners in Texas',
    description:
      'Compare electricity plans optimized for EV charging. Free nights plans can save you $100+/month on home charging.',
    type: 'website',
  },
};

const evFAQs = [
  {
    question: 'How much electricity does an EV use per month?',
    answer:
      'The average EV driver uses about 300-400 kWh per month for charging, depending on driving habits. This is roughly equivalent to driving 1,000-1,200 miles per month. At Texas electricity rates, this typically costs $30-60/month with a standard plan, but can be much less with a free nights plan.',
  },
  {
    question: 'What are free nights electricity plans?',
    answer:
      'Free nights plans offer zero-cost electricity during nighttime hours (typically 9 PM - 6 AM). Since most EV owners charge overnight, this can eliminate your charging costs entirely. The trade-off is slightly higher daytime rates, but for EV owners who charge at night, the savings are substantial.',
  },
  {
    question: 'Can I charge my Tesla for free with a free nights plan?',
    answer:
      'Yes! If you schedule your Tesla (or any EV) to charge during free hours, your charging costs can be $0. Most EVs have built-in charging schedulers. For a Tesla Model 3 driving 1,000 miles/month, this saves approximately $40-50/month compared to standard rates.',
  },
  {
    question: 'What electricity rate should EV owners look for?',
    answer:
      'EV owners should consider: 1) Free nights plans if you can charge overnight, 2) Time-of-use plans with low off-peak rates, or 3) Fixed-rate plans under 10¢/kWh. Calculate your total bill including both home and EV usage to find the best overall value.',
  },
  {
    question: 'How do I calculate my EV charging costs?',
    answer:
      'Use this formula: (Monthly miles ÷ EV efficiency in miles/kWh) × electricity rate = monthly cost. For example: 1,000 miles ÷ 3.5 miles/kWh × $0.12/kWh = $34/month. With free nights charging, this could be $0.',
  },
  {
    question: 'Is it cheaper to charge at home or at public chargers?',
    answer:
      'Home charging is almost always cheaper. Public DC fast chargers typically cost $0.30-0.50/kWh, while Texas home electricity averages $0.10-0.14/kWh. With a free nights plan, home charging is essentially free. Level 2 home charging is the most economical option for daily driving.',
  },
];

export default function EVOwnersPage() {
  return (
    <>
      <StructuredData
        type="faqPage"
        faqItems={evFAQs}
      />

      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <Car className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Best Electricity Plans for
                <br />
                <span className="text-green-300">EV Owners</span> in Texas
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Charge your electric vehicle for <strong>FREE</strong> with overnight charging plans.
                Save up to <strong>$100/month</strong> on home charging costs.
              </p>

              <div className="max-w-xl mx-auto mb-8">
                <ZipSearch variant="inline" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-green-300" />
                  <span>Free Nights Plans Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-300" />
                  <span>~400 kWh Extra for EV</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-300" />
                  <span>$0 Charging Possible</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EV SAVINGS CALCULATOR SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Calculator className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">EV Charging Cost Comparison</h2>
                </div>

                <p className="text-gray-600 mb-8">
                  See how much you can save with a free nights plan vs. standard electricity rates.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Standard Plan */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Standard Plan (12¢/kWh)</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Home usage (1,000 kWh)</span>
                        <span className="font-medium">$120</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EV charging (400 kWh)</span>
                        <span className="font-medium">$48</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900">Monthly Total</span>
                        <span className="font-bold text-gray-900">$168</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Nights Plan */}
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-500 relative">
                    <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      RECOMMENDED
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-4">Free Nights Plan (14¢ day / FREE nights)</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Home usage (1,000 kWh)</span>
                        <span className="font-medium">$105*</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EV charging at night (400 kWh)</span>
                        <span className="font-medium text-green-600">$0</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900">Monthly Total</span>
                        <span className="font-bold text-green-600">$105</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">*Assumes 75% daytime usage</p>
                  </div>
                </div>

                <div className="mt-8 bg-green-100 rounded-lg p-6 text-center">
                  <p className="text-green-800 font-semibold text-lg">
                    Potential Monthly Savings: <span className="text-2xl font-bold">$63</span>
                  </p>
                  <p className="text-green-700 text-sm mt-1">That&apos;s $756/year back in your pocket!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why EV Owners Love Free Nights Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The perfect match for electric vehicle charging habits
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Moon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Charge While You Sleep</h3>
                <p className="text-gray-600">
                  Schedule your EV to charge during free hours (typically 9 PM - 6 AM). Wake up to a full battery and $0 charging cost.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingDown className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Offset Higher Day Rates</h3>
                <p className="text-gray-600">
                  Free nights plans have higher daytime rates, but EV charging savings more than offset the difference for most households.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Run High-Power Appliances</h3>
                <p className="text-gray-600">
                  Laundry, dishwasher, pool pump - run energy-intensive appliances at night for additional savings beyond EV charging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EV-SPECIFIC TIPS */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                EV Charging Tips for Maximum Savings
              </h2>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Set Your Charging Schedule</h3>
                    <p className="text-gray-600">
                      Use your EV&apos;s built-in scheduler or your home charger&apos;s app to start charging at 9 PM. Tesla, Ford, Chevy, and most EVs have this feature.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Battery className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Install a Level 2 Charger</h3>
                    <p className="text-gray-600">
                      A 240V Level 2 charger adds 25-30 miles of range per hour. This ensures your EV is fully charged even if you arrive home late.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Calculate Your Break-Even Point</h3>
                    <p className="text-gray-600">
                      Free nights plans typically break even at 300-400 kWh of nighttime usage. With an EV, you&apos;ll likely exceed this easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Car className="w-16 h-16 mx-auto mb-6 text-green-300" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Find the Best Plan for Your EV
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Enter your ZIP code to compare free nights and EV-optimized plans in your area
              </p>
              <div className="max-w-xl mx-auto mb-6">
                <ZipSearch />
              </div>
              <p className="text-sm text-white/70">
                Free comparison - no obligation to switch
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <FAQSection
              title="EV Electricity Plan FAQs"
              description="Common questions about electricity plans for electric vehicle owners"
              faqs={evFAQs}
              includeSchema={false}
            />
          </div>
        </section>
      </div>
    </>
  );
}
