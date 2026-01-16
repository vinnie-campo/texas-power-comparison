import { Metadata } from 'next';
import Link from 'next/link';
import {
  Moon,
  Sun,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Zap,
  Home,
  Tv,
  WashingMachine,
  Car,
  ThermometerSun,
} from 'lucide-react';
import ZipSearch from '@/components/search/ZipSearch';
import FAQSection from '@/components/content/FAQSection';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Free Nights & Weekends Electricity Plans Texas | Compare 2025 Rates',
  description:
    'Compare free nights and free weekends electricity plans in Texas. Learn how they work, who they\'re best for, and find the best plan for your lifestyle.',
  keywords: 'free nights electricity Texas, free weekends power, TXU free nights, Reliant free nights, night owl electricity plans',
  openGraph: {
    title: 'Free Nights & Weekends Electricity Plans in Texas',
    description:
      'Get FREE electricity at night or on weekends. Perfect for EV owners, night owls, and anyone who can shift usage to off-peak hours.',
    type: 'website',
  },
};

const freeNightsFAQs = [
  {
    question: 'How do free nights electricity plans work?',
    answer:
      'Free nights plans offer $0 electricity during specific nighttime hours (typically 9 PM - 6 AM or similar). In exchange, you pay a higher rate during daytime hours. Your total bill depends on how much electricity you use during free vs. paid hours. If you can shift usage to nights, you can significantly reduce your bill.',
  },
  {
    question: 'What are the typical free hours?',
    answer:
      'Free hours vary by provider: <br><br><strong>Free Nights:</strong> Usually 9 PM - 6 AM (9 hours)<br><strong>Free Weekends:</strong> Friday 6 PM - Sunday 11:59 PM (54 hours)<br><strong>Free Nights + Weekends:</strong> Combination of both<br><br>Some plans start free hours at 8 PM or extend to 7 AM. Check the specific plan details.',
  },
  {
    question: 'Who should get a free nights plan?',
    answer:
      'Free nights plans work best for: <br>• <strong>EV owners</strong> who charge overnight<br>• <strong>Night shift workers</strong> home during the day<br>• <strong>Pool owners</strong> who can run pumps at night<br>• <strong>Anyone</strong> willing to run dishwashers, laundry, etc. after 9 PM<br><br>They\'re NOT ideal if you work from home during the day or can\'t shift usage patterns.',
  },
  {
    question: 'Are free nights plans actually cheaper?',
    answer:
      'It depends on your usage pattern. Free nights plans have higher daytime rates (typically 15-20¢/kWh vs 10-12¢ for standard plans). You need to use approximately 30-40% of your electricity during free hours to break even. Use more at night, and you save. Use more during the day, and you may pay more than a standard plan.',
  },
  {
    question: 'What about free weekends plans?',
    answer:
      'Free weekends plans give you 54 hours of free electricity every week (Friday evening through Sunday night). These can be great if you\'re home on weekends and away during the week, or if you can concentrate laundry, cooking, and other high-usage activities on weekends. Daytime weekday rates are typically 14-18¢/kWh.',
  },
  {
    question: 'Can I use smart home devices to maximize savings?',
    answer:
      'Yes! Smart home devices are perfect for free nights plans: <br>• <strong>Smart thermostats:</strong> Pre-cool your home before free hours end<br>• <strong>Smart plugs:</strong> Schedule appliances to run at night<br>• <strong>EV chargers:</strong> Schedule charging during free hours<br>• <strong>Pool pumps:</strong> Run on timers during night hours<br><br>Automation removes the hassle of manually shifting usage.',
  },
];

export default function FreeNightsPage() {
  return (
    <>
      <StructuredData
        type="faqPage"
        faqItems={freeNightsFAQs}
      />

      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <Moon className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Free Nights & Weekends
                <br />
                <span className="text-purple-300">Electricity Plans</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Pay <strong>$0 for electricity</strong> during off-peak hours.
                Perfect for night owls, EV owners, and weekend homebodies.
              </p>

              <div className="max-w-xl mx-auto mb-8">
                <ZipSearch variant="inline" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-300" />
                  <span>9+ Free Hours Nightly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-purple-300" />
                  <span>Free Weekends Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-purple-300" />
                  <span>Great for EV Charging</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREE HOURS VISUAL */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                When Is Electricity Free?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Typical free hours for popular plan types
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Free Nights */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Moon className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Free Nights Plan</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium text-gray-900">FREE: 9 PM - 6 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="font-medium text-gray-700">Paid: 6 AM - 9 PM (~15-18¢/kWh)</span>
                    </div>
                  </div>

                  {/* 24-hour visual */}
                  <div className="mb-4">
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      <div className="bg-green-500 w-[25%]" title="12-6 AM"></div>
                      <div className="bg-orange-500 w-[62.5%]" title="6 AM - 9 PM"></div>
                      <div className="bg-green-500 w-[12.5%]" title="9 PM - 12 AM"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12 AM</span>
                      <span>6 AM</span>
                      <span>12 PM</span>
                      <span>6 PM</span>
                      <span>12 AM</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    <strong>9 hours free</strong> every night = 63 free hours/week
                  </p>
                </div>
              </div>

              {/* Free Weekends */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-purple-600 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Sun className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Free Weekends Plan</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium text-gray-900">FREE: Fri 6PM - Sun Midnight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="font-medium text-gray-700">Paid: Mon-Fri daytime (~14-17¢/kWh)</span>
                    </div>
                  </div>

                  {/* Week visual */}
                  <div className="mb-4">
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      <div className="bg-orange-500 w-[14.3%]" title="Mon"></div>
                      <div className="bg-orange-500 w-[14.3%]" title="Tue"></div>
                      <div className="bg-orange-500 w-[14.3%]" title="Wed"></div>
                      <div className="bg-orange-500 w-[14.3%]" title="Thu"></div>
                      <div className="bg-gradient-to-r from-orange-500 to-green-500 w-[14.3%]" title="Fri"></div>
                      <div className="bg-green-500 w-[14.3%]" title="Sat"></div>
                      <div className="bg-green-500 w-[14.3%]" title="Sun"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    <strong>54 hours free</strong> every weekend = over 2 full days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO SHOULD GET FREE NIGHTS */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Is a Free Nights Plan Right for You?
              </h2>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Good For */}
              <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-800">Great For</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Car className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">EV Owners</strong>
                      <p className="text-gray-600 text-sm">Schedule overnight charging for $0</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Moon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Night Owls</strong>
                      <p className="text-gray-600 text-sm">Stay up late? Your peak usage is already free</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <WashingMachine className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Flexible Schedulers</strong>
                      <p className="text-gray-600 text-sm">Run laundry, dishwasher after 9 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Home className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Pool Owners</strong>
                      <p className="text-gray-600 text-sm">Run pumps during free nighttime hours</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Not Ideal For */}
              <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h3 className="text-2xl font-bold text-red-800">Not Ideal For</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Home className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Work From Home</strong>
                      <p className="text-gray-600 text-sm">High daytime usage = higher bills</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ThermometerSun className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Heavy A/C Users</strong>
                      <p className="text-gray-600 text-sm">Texas summers mean high daytime cooling</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Tv className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Stay-at-Home Parents</strong>
                      <p className="text-gray-600 text-sm">Kids at home = daytime usage spikes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Rigid Schedules</strong>
                      <p className="text-gray-600 text-sm">Can&apos;t shift appliance usage to nights</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SAVINGS TIPS */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Maximize Your Free Nights Savings
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">1</span>
                    Pre-Cool Before 9 PM
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Lower your thermostat in the evening, then let it rise a few degrees overnight. Your home retains the cool air during free hours.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">2</span>
                    Use Appliance Timers
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Set your dishwasher&apos;s delay start for 9 PM. Load the washing machine before bed and schedule it to run overnight.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</span>
                    Schedule EV Charging
                  </h3>
                  <p className="text-gray-600 text-sm">
                    All modern EVs let you schedule charging. Set it to start at 9 PM and charge for free every night.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">4</span>
                    Monitor Your Usage
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Use your provider&apos;s app or Smart Meter Texas to track when you use electricity. Aim for 40%+ during free hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Moon className="w-16 h-16 mx-auto mb-6 text-purple-300" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Find Free Nights Plans in Your Area
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Compare all free nights and free weekends plans available at your address
              </p>
              <div className="max-w-xl mx-auto mb-6">
                <ZipSearch />
              </div>
              <p className="text-sm text-white/70">
                See all plan types - filter by free nights, free weekends, or both
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <FAQSection
              title="Free Nights & Weekends FAQs"
              description="Everything you need to know about time-of-use electricity plans"
              faqs={freeNightsFAQs}
              includeSchema={false}
            />
          </div>
        </section>
      </div>
    </>
  );
}
