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

// Helper function to generate schema from props (extracted for reuse in 'multiple' type)
function generateSchemaFromProps(props: StructuredDataProps): any {
  switch (props.type) {
    case 'organization':
      if (!props.organization) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: props.organization.name,
        url: props.organization.url,
        logo: props.organization.logo,
        description: props.organization.description,
        contactPoint: props.organization.contactPoint
          ? {
              '@type': 'ContactPoint',
              telephone: props.organization.contactPoint.telephone,
              contactType: props.organization.contactPoint.contactType,
            }
          : undefined,
      };

    case 'localBusiness':
      if (!props.localBusiness) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: props.localBusiness.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: props.localBusiness.address.streetAddress,
          addressLocality: props.localBusiness.address.addressLocality,
          addressRegion: props.localBusiness.address.addressRegion,
          postalCode: props.localBusiness.address.postalCode,
          addressCountry: props.localBusiness.address.addressCountry,
        },
        geo: props.localBusiness.geo
          ? {
              '@type': 'GeoCoordinates',
              latitude: props.localBusiness.geo.latitude,
              longitude: props.localBusiness.geo.longitude,
            }
          : undefined,
        telephone: props.localBusiness.telephone,
        priceRange: props.localBusiness.priceRange,
      };

    case 'product':
      if (!props.product) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: props.product.name,
        description: props.product.description,
        brand: props.product.brand
          ? {
              '@type': 'Brand',
              name: props.product.brand,
            }
          : undefined,
        offers: {
          '@type': 'Offer',
          price: props.product.offers.price,
          priceCurrency: props.product.offers.priceCurrency,
          availability:
            props.product.offers.availability || 'https://schema.org/InStock',
          priceValidUntil: props.product.offers.priceValidUntil,
        },
        additionalProperty: props.product.additionalProperty?.map((prop) => ({
          '@type': 'PropertyValue',
          name: prop.name,
          value: prop.value,
        })),
      };

    case 'faqPage':
      if (!props.faqItems || props.faqItems.length === 0) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

    case 'breadcrumb':
      if (!props.breadcrumbs || props.breadcrumbs.length === 0) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };

    case 'website':
      if (!props.website) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: props.website.name,
        url: props.website.url,
        potentialAction: props.website.potentialAction
          ? {
              '@type': 'SearchAction',
              target: props.website.potentialAction.target,
              'query-input': props.website.potentialAction.queryInput,
            }
          : undefined,
      };

    case 'multiple':
      if (!props.multiple || props.multiple.length === 0) return null;
      return props.multiple.map((item) => {
        // Recursively generate schemas for each type
        const nestedProps: StructuredDataProps = {
          type: item.type as any,
          ...item.data,
        };
        return generateSchemaFromProps(nestedProps);
      });

    default:
      return null;
  }
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
}: StructuredDataProps): React.ReactElement | null {
  const schema: any = generateSchemaFromProps({
    type,
    organization,
    localBusiness,
    product,
    faqItems,
    breadcrumbs,
    website,
    multiple,
  });

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
