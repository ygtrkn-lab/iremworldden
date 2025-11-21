"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Property } from '@/types/property';

export default function ComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingIds, setMissingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadComparison = async (tryAll = false) => {
      try {
        const id = params.id as string;
        
        // Fetch comparison data
        const comparisonRes = await fetch(`/api/comparisons?id=${id}`);
        if (!comparisonRes.ok) {
          throw new Error('Karşılaştırma bulunamadı');
        }
        
        const comparison = await comparisonRes.json();
        const compIds: string[] = (comparison.propertyIds || []).map((pid: any) => String(pid));
        
        // Prefer fetching only requested ids (faster) - fallback to fetching all
        let allProperties: any[] = [];
        try {
          const idsFetch = await fetch(`/api/properties-json?ids=${compIds.join(',')}`);
          if (idsFetch.ok) {
            const idsData = await idsFetch.json();
            allProperties = Array.isArray(idsData) ? idsData : (idsData.data || idsData.properties || []);
          }
        } catch (err) {
          // silent (we'll fallback below)
        }

        if ((!allProperties || allProperties.length === 0) && tryAll) {
          const propertiesRes = await fetch('/api/properties-json');
          if (!propertiesRes.ok) {
            throw new Error('İlanlar yüklenemedi');
          }
          const propertiesData = await propertiesRes.json();
          allProperties = Array.isArray(propertiesData) ? propertiesData : (propertiesData.data || propertiesData.properties || []);
        }
        
        console.log('All properties:', allProperties?.length || 0);
        console.log('Looking for IDs:', compIds);
        
        // Filter properties by IDs
        const filteredProperties = allProperties.filter((p: any) => compIds.includes(String(p.id)));
        
        console.log('Filtered properties:', filteredProperties.length);
        // Determine missing IDs
        const missing = compIds.filter(id => !allProperties.some((p: any) => String(p.id) === id));
        setMissingIds(missing);
        
        setProperties(filteredProperties);
        return filteredProperties;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        return [];
      } finally {
        setLoading(false);
      }
    };

    // Try preferred flow: fetch by IDs first, then fallback to all if nothing found
    (async () => {
      const first = await loadComparison(false);
      if (!first || first.length === 0) {
        await loadComparison(true);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Karşılaştırma yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Hata</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/property')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            İlan Listesine Dön
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg px-6 py-8 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900">Karşılaştırılacak ilan bulunamadı</h3>
          <p className="mt-2 text-sm text-gray-600">Bu karşılaştırma için kayıtlı ilanlar veritabanında bulunamadı. Bunun nedeni ilanların silinmiş veya gizlenmiş olması ya da ID eşleşmesi kaynaklı olabilir.</p>
          {missingIds && missingIds.length > 0 && (
            <div className="mt-4 text-sm text-gray-700 text-left">
              <div className="font-medium">Bulunamayan İlan ID'leri:</div>
              <ul className="mt-2 list-disc list-inside">
                {missingIds.map((mid) => (
                  <li key={mid}>{mid}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { navigator.clipboard.writeText(currentUrl); alert('Link kopyalandı!'); }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
            >
              Linki Kopyala
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => router.push('/property')}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İlan Listesine Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getPropertyCover = (property: any) => {
    if (property?.images && property.images.length > 0) {
      return property.images[0];
    }
    return '/images/placeholder-property.jpg';
  };

  const getCountryName = (code: string) => {
    const countryNames: Record<string, string> = {
      TR: 'Türkiye',
      US: 'Amerika',
      GB: 'İngiltere',
      DE: 'Almanya',
      FR: 'Fransa',
      ES: 'İspanya',
      IT: 'İtalya',
    };
    return countryNames[code] || code;
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = 'İlan Karşılaştırma - IREMWORLD';
    const shareText = `${properties.length} ilanı karşılaştır: ${properties.map(p => p.title).slice(0, 2).join(', ')}...`;

    // Native share API (Mobile + Desktop modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link kopyalandı! Paylaşabilirsiniz.');
    } catch (err) {
      // Final fallback: Show URL in prompt
      prompt('Bu linki kopyalayın:', shareUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">İlan Karşılaştırma</h1>
              <p className="mt-2 text-gray-600">{properties.length} ilan karşılaştırılıyor</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Paylaş
              </button>
              <button
                onClick={() => router.push('/property')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Geri
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] relative">
                <img
                  src={getPropertyCover(property)}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-property.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-2">{property.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {property.location.city}, {getCountryName(property.location.country)}
                </p>
                <p className="text-lg font-bold text-primary-600 mt-2">
                  {property.price.toLocaleString('tr-TR')} {property.currency}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Özellik
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İlan {property.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fiyat</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {property.price.toLocaleString('tr-TR')} {property.currency}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alan (m²)</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {property.area} m²
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Oda Sayısı</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {property.rooms}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Banyo</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {property.bathrooms}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Konum</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-sm text-gray-700">
                      {property.location.city}, {getCountryName(property.location.country)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
