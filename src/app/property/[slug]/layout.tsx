import { Metadata } from "next";
import { findCountryPropertyBySlug } from "@/lib/server-utils";
import { 
  generateSEOTitle, 
  generateSEODescription, 
  generatePropertyKeywords,
  generateAlternateLinks
} from "@/lib/seo-utils";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (error) {
    console.warn('Slug decode failed:', error);
  }

  const potentialId = decodedSlug.split('-').pop();
  const property = findCountryPropertyBySlug(decodedSlug, potentialId);

  if (!property) {
    return {
      title: 'İlan Bulunamadı | IREMWORLD',
      description: 'Aradığınız emlak ilanı bulunamadı.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Use SEO utilities for optimized metadata
  const title = generateSEOTitle(property);
  const description = generateSEODescription(property);
  const keywords = generatePropertyKeywords(property);

  const typeLabel = property.type === 'sale' ? 'Satılık' : 'Kiralık';
  const categoryLabel = [property.category?.main, property.category?.sub]
    .filter(Boolean)
    .join(' ') || 'Emlak';
  
  const location = [
    property.location?.neighborhood,
    property.location?.district,
    property.location?.city,
  ].filter(Boolean).join(', ');

  const priceText = property.price 
    ? `₺${new Intl.NumberFormat('tr-TR').format(property.price)}`
    : 'Fiyat Bilgisi İçin İletişime Geçin';

  const specs = [
    property.specs?.rooms,
    property.specs?.netSize ? `${property.specs.netSize}m²` : null,
  ].filter(Boolean).join(' • ');

  const images = property.images || [];
  const mainImage = images[0] || 'https://www.iremworld.com/images/headers/default-property.jpg';

  // Canonical URL
  const canonicalUrl = `https://www.iremworld.com/property/${decodedSlug}`;

  // Generate alternate links
  const alternateLinks = generateAlternateLinks(`/property/${decodedSlug}`);

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'IREMWORLD Real Estate' }],
    creator: 'IREMWORLD',
    publisher: 'IREMWORLD Real Estate',
    
    // Open Graph for social media
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'IREMWORLD Real Estate',
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'tr_TR',
      type: 'article',
      publishedTime: property.createdAt || new Date().toISOString(),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
      creator: '@iremworld',
      site: '@iremworld',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Alternates with hreflang
    alternates: alternateLinks,

    // Revisit frequency for search engines
    other: {
      'revisit-after': '7 days',
      'rating': 'general',
      'referrer': 'no-referrer-when-downgrade',
      'property:type': property.type,
      'property:category': categoryLabel,
      'property:location': location,
      'property:price': property.price?.toString() || 'contact',
      'property:price:currency': 'TRY',
      'property:rooms': property.specs?.rooms || '',
      'property:size': property.specs?.netSize?.toString() || '',
      'geo.region': 'TR',
      'geo.placename': property.location?.city || '',
      'ICBM': property.location?.coordinates 
        ? `${property.location.coordinates.lat}, ${property.location.coordinates.lng}` 
        : '',
    },
  };
}

export default function PropertyLayout({ children }: Props) {
  return children;
}
