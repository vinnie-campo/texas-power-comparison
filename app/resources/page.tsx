import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/data/articles';
import FAQSection from '@/components/content/FAQSection';
import StructuredData from '@/components/seo/StructuredData';
import { generalElectricityFAQs } from '@/lib/data/faq-data';

export const metadata: Metadata = {
  title: 'Texas Electricity Resources & Guides | Power Compare',
  description:
    'Learn everything about Texas electricity with our comprehensive guides. Understand your bill, choose the best plan, switch providers, and save money on your energy costs.',
  openGraph: {
    title: 'Texas Electricity Resources & Guides',
    description:
      'Comprehensive guides to help you understand Texas electricity, choose the best plan, and save money.',
    type: 'website',
  },
};

export default function ResourcesPage() {
  // Select 8 FAQs for this page
  const resourcesFAQs = generalElectricityFAQs.slice(0, 8);

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Resources', url: 'https://texaspowercompare.com/resources' },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-sm mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Resources</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Texas Electricity Resources & Guides
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about choosing electricity plans,
              understanding your bill, and saving money on energy costs in Texas.
              Our comprehensive guides make it easy to become an informed
              electricity consumer.
            </p>
          </div>

          {/* Featured Article */}
          {articles[0] && (
            <div className="mb-12 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 md:p-10 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Featured Guide
                    </span>
                    <span className="flex items-center gap-1 text-blue-100 text-sm">
                      <Clock className="w-4 h-4" />
                      {articles[0].readTime} min read
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {articles[0].title}
                  </h2>
                  <p className="text-lg text-blue-100 mb-6">
                    {articles[0].description}
                  </p>
                  <Link
                    href={`/resources/${articles[0].slug}`}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Read Guide
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Article Grid */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Popular Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {articles.slice(1).map((article) => {
                const Icon = article.icon;
                return (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 hover:border-blue-300 group"
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {article.description}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Key Topics Section */}
          <section className="mb-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Choosing Plans
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li>• How to compare electricity rates</li>
                    <li>• Fixed vs variable rate plans</li>
                    <li>• Understanding contract terms</li>
                    <li>• Avoiding hidden fees</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Understanding Bills
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li>• Reading your electricity bill</li>
                    <li>• TDU charges explained</li>
                    <li>• Energy vs delivery costs</li>
                    <li>• Electricity Facts Labels</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Switching Providers
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li>• Step-by-step switching guide</li>
                    <li>• Early termination fees</li>
                    <li>• Timeline and process</li>
                    <li>• When to switch</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Saving Money
                  </h3>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li>• Energy efficiency tips</li>
                    <li>• Smart thermostat benefits</li>
                    <li>• Time-of-use strategies</li>
                    <li>• Seasonal savings tactics</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12 max-w-4xl mx-auto">
            <FAQSection
              title="Common Questions About Texas Electricity"
              description="Quick answers to the most frequently asked questions about electricity in Texas"
              faqs={resourcesFAQs}
              includeSchema={true}
            />
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Perfect Plan?
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Armed with knowledge from our guides, you're ready to compare rates
              and save money on your electricity bill.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Compare Electricity Plans
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cities"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Browse by City →
              </Link>
              <Link
                href="/providers"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All Providers →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
