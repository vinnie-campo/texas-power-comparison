import { Info } from 'lucide-react';

export interface KeyFact {
  label: string;
  value: string;
  description?: string;
  unit?: string;
}

interface KeyFactsProps {
  title?: string;
  description?: string;
  facts: KeyFact[];
  lastUpdated?: Date | string;
  source?: string;
  className?: string;
}

export default function KeyFacts({
  title = 'Key Facts & Statistics',
  description,
  facts,
  lastUpdated,
  source,
  className = '',
}: KeyFactsProps) {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 md:p-8 ${className}`}
      itemScope
      itemType="https://schema.org/QuantitativeValue"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            data-fact-label={fact.label}
            data-fact-value={fact.value}
            data-fact-unit={fact.unit || ''}
            itemProp="value"
          >
            <div className="text-sm font-medium text-gray-600 mb-2">
              {fact.label}
            </div>
            <div className="flex items-baseline gap-1">
              <div
                className="text-3xl font-bold text-blue-600"
                itemProp="value"
              >
                {fact.value}
              </div>
              {fact.unit && (
                <div className="text-lg text-gray-500" itemProp="unitText">
                  {fact.unit}
                </div>
              )}
            </div>
            {fact.description && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {fact.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Metadata Footer */}
      {(lastUpdated || source) && (
        <div className="mt-6 pt-4 border-t border-blue-200 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Last updated:</span>
              <time
                dateTime={
                  typeof lastUpdated === 'string'
                    ? lastUpdated
                    : lastUpdated.toISOString()
                }
                className="text-gray-700"
              >
                {formatDate(lastUpdated)}
              </time>
            </div>
          )}
          {source && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Source:</span>
              <span className="text-gray-700">{source}</span>
            </div>
          )}
        </div>
      )}

      {/* Machine-readable metadata */}
      <meta itemProp="description" content={description || title} />
      {lastUpdated && (
        <meta
          itemProp="dateModified"
          content={
            typeof lastUpdated === 'string'
              ? lastUpdated
              : lastUpdated.toISOString()
          }
        />
      )}
    </section>
  );
}
