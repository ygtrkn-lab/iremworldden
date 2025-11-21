"use client";

import { Property, PropertyView } from '@/types/property';
import { Store } from '@/types/store';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  view: PropertyView;
}

export default function PropertyGrid({ properties, view }: PropertyGridProps) {
  const cardView: 'grid' | 'list' = view === 'map' ? 'list' : view;
  const [storeMap, setStoreMap] = useState<Record<string, Store | undefined>>({});

  useEffect(() => {
    // fetch store data client-side and build map
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/stores');
        const json = await res.json();
        if (json.success) {
          const map: Record<string, Store> = {};
          json.data.forEach((s: Store) => (map[s.id] = s));
          setStoreMap(map);
        }
      } catch (error) {
        // ignore
      }
    };

    fetchStores();
  }, []);

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <svg 
            className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Emlak bulunamadı
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Arama kriterlerinize uygun emlak bulunamadı. Filtrelerinizi değiştirmeyi deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${cardView === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
        : 'space-y-6'
      }
    `}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          view={cardView}
          onFavoriteToggle={() => {}}
          isFavorite={false}
          store={property.storeId ? storeMap[property.storeId ?? ''] ?? null : null}
        />
      ))}
    </div>
  );
}
