import React from 'react';

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
}

export interface LocalBusinessSchema {
  name: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  priceRange?: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  brand?: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability?: string;
    priceValidUntil?: string;
  };
  additionalProperty?: Array<{
    name: string;
    value: string;
  }>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface StructuredDataProps {
  type:
    | 'organization'
    | 'localBusiness'
    | 'product'
    | 'faqPage'
    | 'breadcrumb'
    | 'website'
    | 'multiple';
  organization?: OrganizationSchema;
  localBusiness?: LocalBusinessSchema;
  product?: ProductSchema;
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  website?: {
    name: string;
    url: string;
    potentialAction?: {
      target: string;
      queryInput: string;
    };
  };
  multiple?: Array<{
    type: string;
    data: any;
  }>;
}

export default function StructuredData({
  type,
  organization,
  localBusiness,
  product,
  faqItems,
  breadcrumbs,
  website,
  multiple,
}: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        if (!organization) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: organization.name,
          url: organization.url,
          logo: organization.logo,
          description: organization.description,
          contactPoint: organization.contactPoint
            ? {
                '@type': 'ContactPoint',
                telephone: organization.contactPoint.telephone,
                contactType: organization.contactPoint.contactType,
              }
            : undefined,
        };

      case 'localBusiness':
        if (!localBusiness) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: localBusiness.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: localBusiness.address.streetAddress,
            addressLocality: localBusiness.address.addressLocality,
            addressRegion: localBusiness.address.addressRegion,
            postalCode: localBusiness.address.postalCode,
            addressCountry: localBusiness.address.addressCountry,
          },
          geo: localBusiness.geo
            ? {
                '@type': 'GeoCoordinates',
                latitude: localBusiness.geo.latitude,
                longitude: localBusiness.geo.longitude,
              }
            : undefined,
          telephone: localBusiness.telephone,
          priceRange: localBusiness.priceRange,
        };

      case 'product':
        if (!product) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          brand: product.brand
            ? {
                '@type': 'Brand',
                name: product.brand,
              }
            : undefined,
          offers: {
            '@type': 'Offer',
            price: product.offers.price,
            priceCurrency: product.offers.priceCurrency,
            availability:
              product.offers.availability || 'https://schema.org/InStock',
            priceValidUntil: product.offers.priceValidUntil,
          },
          additionalProperty: product.additionalProperty?.map((prop) => ({
            '@type': 'PropertyValue',
            name: prop.name,
            value: prop.value,
          })),
        };

      case 'faqPage':
        if (!faqItems || faqItems.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        };

      case 'breadcrumb':
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        };

      case 'website':
        if (!website) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: website.name,
          url: website.url,
          potentialAction: website.potentialAction
            ? {
                '@type': 'SearchAction',
                target: website.potentialAction.target,
                'query-input': website.potentialAction.queryInput,
              }
            : undefined,
        };

      case 'multiple':
        if (!multiple || multiple.length === 0) return null;
        return multiple.map((item) => {
          // Recursively generate schemas for each type
          const props = {
            type: item.type as any,
            ...item.data,
          };
          return generateSchemaForType(props);
        });

      default:
        return null;
    }
  };

  const generateSchemaForType = (props: any) => {
    // Helper to generate schema for nested types
    const structuredData = StructuredData(props);
    return structuredData ? JSON.parse(structuredData.props.children) : null;
  };

  const schema = generateSchema();

  if (!schema) return null;

  // Handle multiple schemas
  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((s, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}
      </>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
