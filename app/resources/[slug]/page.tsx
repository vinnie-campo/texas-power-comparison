import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, Clock, Calendar, ArrowRight } from 'lucide-react';
import { articles, getArticleBySlug, getRelatedArticles } from '@/lib/data/articles';
import StructuredData from '@/components/seo/StructuredData';

// Generate static params for all articles
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Texas Power Compare',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} | Texas Power Compare`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.lastUpdated,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug);
  const Icon = article.icon;

  // Generate table of contents from sections
  const tableOfContents = article.content.sections.map((section) => ({
    heading: section.heading,
    id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: 'https://texaspowercompare.com/' },
          { name: 'Resources', url: 'https://texaspowercompare.com/resources' },
          {
            name: article.title,
            url: `https://texaspowercompare.com/resources/${article.slug}`,
          },
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
            <Link
              href="/resources"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Resources
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium line-clamp-1">
              {article.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Article Header */}
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Updated {new Date(article.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h1>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Article Content */}
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 prose prose-blue max-w-none">
                {/* Introduction */}
                <p className="lead text-lg text-gray-700 leading-relaxed mb-8">
                  {article.content.introduction}
                </p>

                {/* Sections */}
                {article.content.sections.map((section, sectionIndex) => (
                  <section key={sectionIndex} className="mb-10">
                    <h2
                      id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-20"
                    >
                      {section.heading}
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {section.content}
                    </p>

                    {/* Subsections */}
                    {section.subsections && section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="ml-0 md:ml-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {subsection.heading}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </section>
                ))}

                {/* Conclusion */}
                {article.content.conclusion && (
                  <div className="mt-10 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Conclusion
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {article.content.conclusion}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Section */}
              <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 md:p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">
                  Ready to Compare Rates?
                </h3>
                <p className="text-blue-100 mb-4">
                  Find the best electricity plan for your Texas home in minutes.
                </p>
                <Link
                  href="/compare"
                  className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Compare Plans Now
                </Link>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => {
                      const RelatedIcon = related.icon;
                      return (
                        <Link
                          key={related.slug}
                          href={`/resources/${related.slug}`}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <RelatedIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                              {related.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {related.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Table of Contents - Sticky */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Table of Contents
                </h3>
                <nav>
                  <ul className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <li key={index}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1"
                        >
                          {item.heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Quick CTA */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/compare"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
                  >
                    Compare Rates Now
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-bold text-blue-900 mb-3">
                  Need Help?
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/resources"
                      className="text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      → Browse All Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compare"
                      className="text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      → Compare Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cities"
                      className="text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      → Find Your City
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/providers"
                      className="text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      → View Providers
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
