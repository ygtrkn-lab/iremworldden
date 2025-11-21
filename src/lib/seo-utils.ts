/**
 * SEO Utilities for IREMWORLD
 * Advanced SEO optimization similar to sahibinden.com
 */

import { Property } from '@/types/property';

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate SEO-optimized keywords based on property attributes
 */
export function generatePropertyKeywords(property: Property): string {
  const keywords: string[] = [];
  
  // Property type
  const typeMap: Record<string, string[]> = {
    'sale': ['satılık', 'satılık emlak', 'satılık konut', 'emlak satış'],
    'rent': ['kiralık', 'kiralık emlak', 'kiralık konut', 'kira'],
  };
  
  if (property.type && typeMap[property.type]) {
    keywords.push(...typeMap[property.type]);
  }
  
  // Property category
  const categoryKeywords: Record<string, string[]> = {
    'daire': ['daire', 'apartman dairesi', 'konut'],
    'villa': ['villa', 'müstakil ev', 'lüks villa'],
    'residence': ['residence', 'rezidans', 'lüks konut'],
    'ofis': ['ofis', 'iş yeri', 'ticari alan'],
    'arsa': ['arsa', 'ticari arsa', 'konut arsası'],
    'yazlık': ['yazlık', 'yazlık ev', 'tatil evi'],
  };
  
  const categoryMain = property.category?.main?.toLowerCase() || '';
  const categorySub = property.category?.sub?.toLowerCase() || '';
  Object.entries(categoryKeywords).forEach(([key, values]) => {
    if (categoryMain.includes(key) || categorySub.includes(key)) {
      keywords.push(...values);
    }
  });
  
  // Room configuration
  if (property.specs?.rooms) {
    keywords.push(`${property.specs.rooms}`, `${property.specs.rooms} oda`);
  }
  
  // Location-based keywords
  if (property.location?.city) {
    keywords.push(
      property.location.city,
      `${property.location.city} emlak`,
      `${property.location.city} ${property.type === 'sale' ? 'satılık' : 'kiralık'}`
    );
  }
  
  if (property.location?.district) {
    keywords.push(
      property.location.district,
      `${property.location.district} ${property.type === 'sale' ? 'satılık' : 'kiralık'}`,
      `${property.location.district} ${property.location.city || ''}`
    );
  }
  
  if (property.location?.neighborhood) {
    keywords.push(property.location.neighborhood);
  }
  
  // Price range keywords
  if (property.price) {
    const priceInTL = parseInt(property.price.toString().replace(/[^0-9]/g, ''));
    if (!isNaN(priceInTL)) {
      if (priceInTL >= 10000000) {
        keywords.push('lüks', 'prestijli', 'premium');
      } else if (priceInTL >= 5000000) {
        keywords.push('üst segment', 'kaliteli');
      }
    }
  }
  
  // Features
  if (property.buildingFeatures) {
    if (property.buildingFeatures.hasPool) {
      keywords.push('havuzlu', 'yüzme havuzlu');
    }
    if (property.buildingFeatures.hasSecurity || property.buildingFeatures.has24HourSecurity) {
      keywords.push('güvenlikli', 'korunaklı', '24 saat güvenlik');
    }
    if (property.buildingFeatures.hasCarPark || property.buildingFeatures.hasClosedCarPark) {
      keywords.push('otoparklı', 'kapalı otopark');
    }
    if (property.exteriorFeatures?.hasSeaView) {
      keywords.push('deniz manzaralı', 'deniz manzarası');
    }
    if (property.exteriorFeatures?.hasGarden) {
      keywords.push('bahçeli', 'bahçe kullanımlı');
    }
  }
  
  // General keywords
  keywords.push(
    'emlak',
    'gayrimenkul',
    'IREMWORLD',
    'INTERNATIONAL REAL ESTATE MARKETING',
    'emlak ilanları',
    'gayrimenkul ilanları'
  );
  
  // Remove duplicates and empty strings
  return [...new Set(keywords)].filter(Boolean).join(', ');
}

/**
 * Generate SEO-optimized title (max 60 characters)
 */
export function generateSEOTitle(property: Property): string {
  const parts: string[] = [];
  
  // Title base
  if (property.title && property.title.length <= 40) {
    return `${property.title} | IREMWORLD`;
  }
  
  // Construct from attributes
  if (property.specs?.rooms) {
    parts.push(property.specs.rooms);
  }
  
  if (property.location?.district) {
    parts.push(property.location.district);
  } else if (property.location?.city) {
    parts.push(property.location.city);
  }
  
  parts.push(property.type === 'sale' ? 'Satılık' : 'Kiralık');
  
  let title = parts.join(' ');
  
  // Truncate if too long
  if (title.length > 45) {
    title = title.substring(0, 42) + '...';
  }
  
  return `${title} | IREMWORLD`;
}

/**
 * Generate SEO-optimized description (max 160 characters)
 */
export function generateSEODescription(property: Property): string {
  const parts: string[] = [];
  
  // Location
  if (property.location?.neighborhood && property.location?.district) {
    parts.push(`${property.location.neighborhood}, ${property.location.district}`);
  } else if (property.location?.district) {
    parts.push(property.location.district);
  }
  
  if (property.location?.city) {
    parts.push(property.location.city);
  }
  
  // Property details
  const details: string[] = [];
  if (property.specs?.rooms) details.push(property.specs.rooms);
  if (property.specs?.netSize) details.push(`${property.specs.netSize}m²`);
  
  if (details.length > 0) {
    parts.push(details.join(', '));
  }
  
  // Type
  parts.push(property.type === 'sale' ? 'Satılık' : 'Kiralık');
  
  // Price
  if (property.price) {
    parts.push(`${property.price} TL`);
  }
  
  let description = parts.join(' - ');
  
  // Add suffix
  const suffix = ' | IREMWORLD REAL ESTATE';
  
  // Truncate if needed
  const maxLength = 160 - suffix.length;
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description + suffix;
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.iremworld.com${item.url}`,
    })),
  };
}

/**
 * Generate property breadcrumbs
 */
export function generatePropertyBreadcrumbs(property: Property): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
  ];
  
  // Type
  if (property.type === 'sale') {
    breadcrumbs.push({ name: 'Satılık', url: '/for-sale' });
  } else if (property.type === 'rent') {
    breadcrumbs.push({ name: 'Kiralık', url: '/for-rent' });
  }
  
  // City
  if (property.location?.city) {
    const citySlug = property.location.city.toLowerCase().replace(/\s+/g, '-');
    breadcrumbs.push({
      name: property.location.city,
      url: `/${property.type === 'sale' ? 'for-sale' : 'for-rent'}?city=${citySlug}`,
    });
  }
  
  // District
  if (property.location?.district) {
    const districtSlug = property.location.district.toLowerCase().replace(/\s+/g, '-');
    breadcrumbs.push({
      name: property.location.district,
      url: `/${property.type === 'sale' ? 'for-sale' : 'for-rent'}?district=${districtSlug}`,
    });
  }
  
  // Current property (no link)
  breadcrumbs.push({
    name: property.title?.substring(0, 40) || 'İlan Detayı',
    url: `/property/${property.slug}`,
  });
  
  return breadcrumbs;
}

/**
 * Generate search page breadcrumbs
 */
export function generateSearchBreadcrumbs(params: {
  type?: 'sale' | 'rent';
  city?: string;
  district?: string;
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
  ];
  
  if (params.type) {
    const name = params.type === 'sale' ? 'Satılık' : 'Kiralık';
    breadcrumbs.push({
      name,
      url: `/${params.type === 'sale' ? 'for-sale' : 'for-rent'}`,
    });
  }
  
  if (params.city) {
    breadcrumbs.push({
      name: params.city,
      url: `/${params.type === 'sale' ? 'for-sale' : 'for-rent'}?city=${params.city}`,
    });
  }
  
  if (params.district) {
    breadcrumbs.push({
      name: params.district,
      url: `/${params.type === 'sale' ? 'for-sale' : 'for-rent'}?city=${params.city}&district=${params.district}`,
    });
  }
  
  return breadcrumbs;
}

/**
 * Generate SEO-friendly slug with keywords
 */
export function generateSEOSlug(property: Property): string {
  const parts: string[] = [];
  
  // Type
  parts.push(property.type === 'sale' ? 'satilik' : 'kiralik');
  
  // Category
  if (property.category?.sub) {
    parts.push(property.category.sub.toLowerCase().replace(/\s+/g, '-'));
  }
  
  // Location
  if (property.location?.district) {
    parts.push(property.location.district.toLowerCase().replace(/\s+/g, '-'));
  }
  
  if (property.location?.neighborhood) {
    parts.push(property.location.neighborhood.toLowerCase().replace(/\s+/g, '-'));
  }
  
  // Rooms
  if (property.specs?.rooms) {
    parts.push(property.specs.rooms.toLowerCase().replace(/\+/g, '-'));
  }
  
  // ID for uniqueness
  if (property.id) {
    parts.push(property.id);
  }
  
  return parts
    .join('-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate pagination links for search results
 */
export interface PaginationLinks {
  prev?: string;
  next?: string;
  canonical: string;
}

export function generatePaginationLinks(
  baseUrl: string,
  currentPage: number,
  totalPages: number
): PaginationLinks {
  const links: PaginationLinks = {
    canonical: currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`,
  };
  
  if (currentPage > 1) {
    links.prev = currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`;
  }
  
  if (currentPage < totalPages) {
    links.next = `${baseUrl}?page=${currentPage + 1}`;
  }
  
  return links;
}

/**
 * Generate alternate language links
 */
export function generateAlternateLinks(path: string) {
  return {
    canonical: `https://www.iremworld.com${path}`,
    languages: {
      'tr-TR': `https://www.iremworld.com${path}`,
      'en-US': `https://www.iremworld.com/en${path}`,
    },
  };
}
