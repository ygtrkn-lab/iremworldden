"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Property } from "@/types/property";
import { generatePropertyUrl } from "@/utils/slug";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&auto=format&fit=crop";

export default function FeaturedRentListings() {
  const [listings, setListings] = useState<Property[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/properties-json?country=TR&type=rent&limit=4&sort=recent`,
          { signal: controller.signal }
        );
        const result = await response.json();

        if (!controller.signal.aborted) {
          if (result.success) {
            setListings(result.data as Property[]);
          } else {
            setListings([]);
            setError("İlanlar yüklenemedi");
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Featured rent listings fetch failed", err);
          setListings([]);
          setError("İlanlar yüklenemedi");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!listings.length) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = { ...prev };

        listings.forEach((listing) => {
          const totalImages = listing.images?.length ?? 0;
          if (totalImages > 1) {
            next[listing.id] = ((prev[listing.id] || 0) + 1) % totalImages;
          }
        });

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [listings]);

  const getListingImages = (listing: Property) =>
    listing.images && listing.images.length > 0 ? listing.images : [FALLBACK_IMAGE];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
            style={{ borderColor: '#f07f38', color: '#f07f38', boxShadow: '0 10px 25px rgba(240, 127, 56, 0.1)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#f07f38' }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
            Öne Çıkan Kiralık İlanlar
          </motion.div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            En seçkin kiralık gayrimenkul fırsatları
          </p>
        </motion.div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && (
            <div className="col-span-full flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-gray-500">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-4 text-sm font-medium">İlanlar yükleniyor...</p>
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-gray-500">
              <p className="text-sm font-medium">
                {error ?? "Şu anda öne çıkan kiralık ilan bulunamadı."}
              </p>
            </div>
          )}

          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={generatePropertyUrl(listing)}>
                <motion.div
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* Image Carousel Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {getListingImages(listing).map((image, imageIndex) => (
                      <motion.div
                        key={image}
                        className="absolute inset-0"
                        initial={{ opacity: imageIndex === 0 ? 1 : 0 }}
                        animate={{ 
                          opacity: (currentImageIndex[listing.id] || 0) === imageIndex ? 1 : 0
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={image}
                          alt={`${listing.title} - Görsel ${imageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                    
                    {/* Image Indicators */}
                    {getListingImages(listing).length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {getListingImages(listing).map((_, imageIndex) => (
                          <div
                            key={imageIndex}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              (currentImageIndex[listing.id] || 0) === imageIndex 
                                ? 'bg-white' 
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Location Badge */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {[listing.location.district, listing.location.city]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-[#f07f38] transition-colors duration-300">
                      {listing.title}
                    </h3>

                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {listing.specs?.rooms ?? '—'}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {listing.specs?.netSize ?? '--'}m²
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {listing.specs?.bathrooms ?? 0} Banyo
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-[#f07f38] font-bold text-xl">
                        ₺{formatPrice(listing.price)}/ay
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Horizontal Compact Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/for-rent">
            <motion.button
              className="bg-gradient-to-r from-[#f07f38] to-[#e06b2a] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Tüm Kiralık İlanları Görüntüle
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
