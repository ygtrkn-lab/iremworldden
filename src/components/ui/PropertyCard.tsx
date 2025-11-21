"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Store } from '@/types/store';
import { formatPrice, formatLocation } from '@/lib/client-utils';
import { generatePropertyUrl } from '@/utils/slug';

interface PropertyCardProps {
  property: Property;
  view: 'grid' | 'list';
  onFavoriteToggle: (id: string) => void;
  isFavorite: boolean;
  store?: Store | null;
}

export const PropertyCard = ({ 
  property, 
  view, 
  onFavoriteToggle, 
  isFavorite,
  store
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    if (isQuickViewOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isQuickViewOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800
        ${view === 'list' ? 'flex md:flex-row flex-col' : 'flex flex-col'}
        transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className={`
        relative overflow-hidden
        ${view === 'list' ? 'md:w-2/5 w-full' : 'w-full'}
        ${view === 'list' ? 'md:h-full h-64' : 'h-64'}
      `}>
        <img
          src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : `https://source.unsplash.com/800x600/?apartment,house&sig=${property.id}`}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick View CTA */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <button
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-105 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
        >
          Hızlı Görüntüle
        </button>
        
        {/* Image Navigation */}
        {isHovered && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Property Badge */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {property.type === 'sale' ? 'SATILIK' : 'KİRALIK'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteToggle(property.id)}
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-primary text-white' 
              : 'bg-black/20 text-white hover:bg-black/40'
          } backdrop-blur-sm`}
        >
          <svg 
            className="w-5 h-5" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className={`
        flex flex-col p-6
        ${view === 'list' ? 'md:w-3/5 w-full' : 'w-full'}
      `}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {formatLocation(property.location)}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {property.title}
        </h3>

        <div className="text-2xl font-bold text-primary mb-4">
          {formatPrice(property.price)} ₺
        </div>

        {/* Store Info */}
        {store && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <Link
              href={`/store/${store.slug}`}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {store.name}
            </Link>
            {store.verified && (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          {property.category.main === "Arsa" ? (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.specs.netSize} m²
              </div>
              {property.landDetails?.pricePerSquareMeter && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {property.landDetails.pricePerSquareMeter.toLocaleString('tr-TR')} ₺/m²
                </div>
              )}
              {property.landDetails?.zoningStatus && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {property.landDetails.zoningStatus}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.specs.rooms}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {property.specs.bathrooms} Banyo
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.specs.netSize} m²
              </div>
            </>
          )}
        </div>

        {view === 'list' && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={generatePropertyUrl(property)}
            className="btn btn-primary w-full text-center"
          >
            Detayları Gör
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsQuickViewOpen(false)}
          />
          <div className="relative z-[61] mx-4 w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/80 p-1 shadow-2xl backdrop-blur-2xl dark:border-white/5 dark:bg-gray-900/90">
              <div className="absolute -inset-[120%] bg-gradient-to-r from-primary/30 via-transparent to-blue-500/30 blur-3xl" aria-hidden />
              <div className="relative grid gap-6 rounded-[28px] bg-white/90 p-6 dark:bg-gray-900/80 md:grid-cols-2">
                <button
                  aria-label="Kapat"
                  className="absolute right-4 top-4 rounded-full bg-black/10 p-2 text-gray-600 transition hover:bg-black/20 dark:text-gray-200"
                  onClick={() => setIsQuickViewOpen(false)}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 md:h-full">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : `https://source.unsplash.com/800x600/?apartment,house&sig=${property.id}`}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {property.category.main}
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatLocation(property.location)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Başlangıç fiyatı</div>
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)} ₺
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="rounded-xl border border-gray-100 bg-white/70 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                      <p className="text-xs uppercase tracking-wider text-gray-400">Oda</p>
                      <p className="text-lg font-semibold">{property.specs.rooms}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white/70 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                      <p className="text-xs uppercase tracking-wider text-gray-400">Banyo</p>
                      <p className="text-lg font-semibold">{property.specs.bathrooms ?? '-'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white/70 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                      <p className="text-xs uppercase tracking-wider text-gray-400">Metrekare</p>
                      <p className="text-lg font-semibold">{property.specs.netSize ?? '-'} m²</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white/70 p-3 dark:border-gray-800 dark:bg-gray-900/70">
                      <p className="text-xs uppercase tracking-wider text-gray-400">Durum</p>
                      <p className="text-lg font-semibold">{property.type === 'sale' ? 'Satılık' : 'Kiralık'}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {property.description || 'İlan detayına giderek daha fazla bilgi alabilirsiniz.'}
                  </p>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <button
                      className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => setIsQuickViewOpen(false)}
                    >
                      Kapat
                    </button>
                    <Link
                      href={generatePropertyUrl(property)}
                      className="flex-1 rounded-full bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
                      onClick={() => setIsQuickViewOpen(false)}
                    >
                      İlanı Aç
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
