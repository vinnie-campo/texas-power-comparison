import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase';
import { articles } from '@/lib/data/articles';

/**
 * Generate sitemap for SEO
 * Includes static pages and dynamic pages from database
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://texaspowercompare.com';
  const supabase = createStaticClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Fetch all cities from database
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, updated_at')
    .order('name');

  const cityPages: MetadataRoute.Sitemap = (cities || []).map((city) => ({
    url: `${siteUrl}/cities/${city.slug}`,
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch all providers from database
  const { data: providers } = await supabase
    .from('providers')
    .select('slug, updated_at')
    .order('name');

  const providerPages: MetadataRoute.Sitemap = (providers || []).map((provider) => ({
    url: `${siteUrl}/providers/${provider.slug}`,
    lastModified: provider.updated_at ? new Date(provider.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Get all article slugs from articles data
  const resourcePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/resources/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Combine all pages
  return [...staticPages, ...cityPages, ...providerPages, ...resourcePages];
}
