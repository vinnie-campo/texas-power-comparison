import Link from 'next/link';
import { ChevronLeft, Building2 } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';

export default async function ProvidersManagement() {
  const supabase = await createServerClient();

  const { data: providers } = await supabase
    .from('providers')
    .select('*, plans:plans(count)')
    .order('name');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Electricity Providers
            </h2>
            <p className="text-gray-600">
              View and manage electricity providers
            </p>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers?.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600">{provider.slug}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              {provider.website && (
                <p className="text-gray-600">
                  <span className="font-medium">Website:</span>{' '}
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {provider.website.replace('https://', '').replace('www.', '')}
                  </a>
                </p>
              )}
              {provider.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {provider.phone}
                </p>
              )}
              {provider.rating && (
                <p className="text-gray-600">
                  <span className="font-medium">Rating:</span> {provider.rating}/5.0
                </p>
              )}
            </div>

            {provider.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {provider.description}
              </p>
            )}

            <div className="pt-4 border-t border-gray-200">
              <Link
                href={`/admin/plans?provider=${provider.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Plans →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          Provider Management
        </h3>
        <p className="text-blue-800 text-sm mb-4">
          Provider information was imported using the update script. To add new providers or
          update existing ones, use the provider update script or edit directly in the database.
        </p>
        <p className="text-blue-700 text-sm">
          <code className="bg-blue-100 px-2 py-1 rounded">npm run update:providers</code>
        </p>
      </div>
    </div>
  );
}
