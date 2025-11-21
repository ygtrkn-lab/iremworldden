import { MetadataRoute } from 'next';
import { readAllCountries } from '@/lib/server-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.iremworld.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/property`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/investment-opportunities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic property pages
  const countries = readAllCountries();
  const propertyPages: MetadataRoute.Sitemap = [];

  for (const country of countries) {
    const properties = country.properties || [];
    
    for (const property of properties) {
      if (property && property.slug) {
        propertyPages.push({
          url: `${baseUrl}/property/${property.slug}`,
          lastModified: new Date(property.updatedAt || property.createdAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  return [...staticPages, ...propertyPages];
}
