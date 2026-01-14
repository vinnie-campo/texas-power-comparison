'use client';

import { getProviderConfig, getProviderBrandColor, getProviderInitials } from '@/lib/provider-logos';

export interface ProviderLogoProps {
  providerSlug: string;
  providerName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export default function ProviderLogo({
  providerSlug,
  providerName,
  size = 'md',
  className = '',
}: ProviderLogoProps) {
  const config = getProviderConfig(providerSlug);
  const sizeInPx = sizeMap[size];
  const initials = getProviderInitials(providerSlug);
  const brandColor = getProviderBrandColor(providerSlug);

  // If we have a logo URL, use it
  if (config?.logoUrl) {
    return (
      <img
        src={config.logoUrl}
        alt={`${providerName || config.slug} logo`}
        width={sizeInPx}
        height={sizeInPx}
        className={`rounded-lg ${className}`}
        style={{ width: `${sizeInPx}px`, height: `${sizeInPx}px` }}
      />
    );
  }

  // Otherwise, show styled initials
  const fontSize = sizeInPx * 0.4;

  return (
    <div
      className={`flex items-center justify-center rounded-lg font-bold text-white ${className}`}
      style={{
        width: `${sizeInPx}px`,
        height: `${sizeInPx}px`,
        backgroundColor: brandColor,
        fontSize: `${fontSize}px`,
      }}
      aria-label={`${providerName || providerSlug} logo`}
    >
      {initials}
    </div>
  );
}
