/**
 * Provider logo mappings and utilities
 * Maps provider slugs to their logo URLs or initials
 */

export interface ProviderLogoConfig {
  slug: string;
  initials: string;
  brandColor: string;
  logoUrl?: string;
}

// Provider logo configurations - All 25 Texas electricity providers
const providerConfigs: Record<string, ProviderLogoConfig> = {
  'txu-energy': {
    slug: 'txu-energy',
    initials: 'TXU',
    brandColor: '#0066CC', // TXU blue
  },
  'reliant-energy': {
    slug: 'reliant-energy',
    initials: 'RE',
    brandColor: '#FF6B35', // Reliant orange
  },
  'direct-energy': {
    slug: 'direct-energy',
    initials: 'DE',
    brandColor: '#00A651', // Direct green
  },
  'gexa-energy': {
    slug: 'gexa-energy',
    initials: 'GE',
    brandColor: '#7C3AED', // Gexa purple
  },
  'green-mountain-energy': {
    slug: 'green-mountain-energy',
    initials: 'GM',
    brandColor: '#10B981', // Green Mountain green
  },
  '4change-energy': {
    slug: '4change-energy',
    initials: '4C',
    brandColor: '#F59E0B', // 4Change amber
  },
  'frontier-utilities': {
    slug: 'frontier-utilities',
    initials: 'FU',
    brandColor: '#3B82F6', // Frontier blue
  },
  'constellation': {
    slug: 'constellation',
    initials: 'CO',
    brandColor: '#1E40AF', // Constellation dark blue
  },
  'discount-power': {
    slug: 'discount-power',
    initials: 'DP',
    brandColor: '#DC2626', // Discount red
  },
  'chariot-energy': {
    slug: 'chariot-energy',
    initials: 'CE',
    brandColor: '#F97316', // Chariot orange
  },
  'champion-energy': {
    slug: 'champion-energy',
    initials: 'CH',
    brandColor: '#059669', // Champion green
  },
  'cirro-energy': {
    slug: 'cirro-energy',
    initials: 'CI',
    brandColor: '#0891B2', // Cirro cyan
  },
  'rhythm-energy': {
    slug: 'rhythm-energy',
    initials: 'RH',
    brandColor: '#8B5CF6', // Rhythm purple
  },
  'trieagle-energy': {
    slug: 'trieagle-energy',
    initials: 'TE',
    brandColor: '#B91C1C', // TriEagle red
  },
  'payless-power': {
    slug: 'payless-power',
    initials: 'PP',
    brandColor: '#15803D', // Payless green
  },
  'apge': {
    slug: 'apge',
    initials: 'APG',
    brandColor: '#4338CA', // APGE indigo
  },
  'amigo-energy': {
    slug: 'amigo-energy',
    initials: 'AM',
    brandColor: '#EA580C', // Amigo orange
  },
  'pulse-power': {
    slug: 'pulse-power',
    initials: 'PU',
    brandColor: '#0E7490', // Pulse teal
  },
  'veteran-energy': {
    slug: 'veteran-energy',
    initials: 'VE',
    brandColor: '#991B1B', // Veteran red
  },
  'goodcharlie': {
    slug: 'goodcharlie',
    initials: 'GC',
    brandColor: '#A855F7', // GoodCharlie purple
  },
  'express-energy': {
    slug: 'express-energy',
    initials: 'EE',
    brandColor: '#EF4444', // Express red
  },
  'texpo-energy': {
    slug: 'texpo-energy',
    initials: 'TX',
    brandColor: '#0369A1', // Texpo blue
  },
  'pennywise-power': {
    slug: 'pennywise-power',
    initials: 'PW',
    brandColor: '#65A30D', // Pennywise lime
  },
  'tomorrow-energy': {
    slug: 'tomorrow-energy',
    initials: 'TM',
    brandColor: '#16A34A', // Tomorrow green
  },
};

/**
 * Get provider logo configuration by slug
 * @param slug - Provider slug
 * @returns Provider logo configuration or null if not found
 */
export function getProviderConfig(slug: string): ProviderLogoConfig | null {
  return providerConfigs[slug] || null;
}

/**
 * Get provider logo URL by slug
 * Falls back to null if no logo is configured
 * @param slug - Provider slug
 * @returns Logo URL or null
 */
export function getProviderLogo(slug: string): string | null {
  const config = providerConfigs[slug];
  return config?.logoUrl || null;
}

/**
 * Get provider initials by slug
 * @param slug - Provider slug
 * @returns Initials (e.g., 'TXU') or first two letters of slug
 */
export function getProviderInitials(slug: string): string {
  const config = providerConfigs[slug];
  if (config) {
    return config.initials;
  }

  // Fallback: first two letters of slug
  return slug.substring(0, 2).toUpperCase();
}

/**
 * Get provider brand color by slug
 * @param slug - Provider slug
 * @returns Hex color code or default gray
 */
export function getProviderBrandColor(slug: string): string {
  const config = providerConfigs[slug];
  return config?.brandColor || '#6B7280'; // Default gray
}

/**
 * Generate SVG logo with provider initials
 * @param initials - Provider initials
 * @param color - Brand color
 * @param size - Size in pixels
 * @returns Data URL for inline SVG
 */
export function generateInitialsLogo(
  initials: string,
  color: string,
  size: number = 48
): string {
  const fontSize = size * 0.4;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.15}"/>
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >
        ${initials}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
