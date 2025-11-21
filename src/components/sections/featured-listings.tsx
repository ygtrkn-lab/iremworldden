"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { generatePropertyUrl } from "@/utils/slug";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sale' | 'rent'>('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // API'den satılık ve kiralık ilanları çek
        const [saleRes, rentRes] = await Promise.all([
          fetch('/api/properties?type=sale'),
          fetch('/api/properties?type=rent')
        ]);

        const [saleData, rentData] = await Promise.all([
          saleRes.json(),
          rentRes.json()
        ]);

        // Veri kontrolü ve array'e dönüştürme
        const saleArray = Array.isArray(saleData) ? saleData : (saleData?.properties || []);
        const rentArray = Array.isArray(rentData) ? rentData : (rentData?.properties || []);

        // Her birinden 3'er tane rastgele seç
        const selectedSale = saleArray.sort(() => Math.random() - 0.5).slice(0, 3);
        const selectedRent = rentArray.sort(() => Math.random() - 0.5).slice(0, 3);

        // İki array'i birleştir ve karıştır
        const combined = [...selectedSale, ...selectedRent].sort(() => Math.random() - 0.5);
        setProperties(combined);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Cleanup function
    return () => {};
  }, []);

  const filteredProperties = properties.filter(property => {
    if (activeFilter === 'all') return true;
    return property.type === activeFilter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-primary-200/20 to-primary-300/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-primary-300/20 to-primary-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header with Animations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            Öne Çıkan İlanlarımız
          </motion.div>
          
   
          
        
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-100 flex flex-col sm:flex-row gap-2">
            {[
              { 
                key: 'all', 
                label: 'Tüm İlanlar', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              { 
                key: 'sale', 
                label: 'Satılık', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              { 
                key: 'rent', 
                label: 'Kiralık', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )
              }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeFilter === filter.key
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Properties Carousel */}
        <div className="relative mb-16">
          <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                className="w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(property.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="group relative h-full flex flex-col">
                <motion.div 
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 relative flex flex-col h-full transition-shadow duration-300 hover:shadow-lg"
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >

                  {/* Image Section with Advanced Effects */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {/* Category Badge */}
                    <motion.div 
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="absolute top-4 left-4 z-20"
                    >
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
                        <span className="hidden sm:inline">{property.category.main} - {property.category.sub}</span>
                        <span className="sm:hidden">{property.category.main}</span>
                      </div>
                    </motion.div>

                    {/* Type Badge */}
                    <motion.div 
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="absolute top-4 right-4 z-20"
                    >
                      <div className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm ${
                        property.type === 'sale' 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      }`}>
                        {property.type === 'sale' ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Satılık
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Kiralık
                          </span>
                        )}
                      </div>
                    </motion.div>


                    {/* Image with Modern Effects */}
                    <motion.div
                      className="relative h-full w-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Image
                        src={property.images[0] || '/placeholder.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover transition-all duration-500 hover:brightness-110 hover:contrast-105"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>

                    {/* Hover Overlay with Info */}
                    <AnimatePresence>
                      {hoveredCard === property.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-8 z-30"
                        >
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-center text-white"
                          >
            <div className="flex items-center justify-center gap-3 mb-3">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{property.specs?.rooms || 'N/A'}</div>
                                <div className="text-xs opacity-80">Oda Sayısı</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">{property.specs?.netSize || 'N/A'}</div>
                                <div className="text-xs opacity-80">m² Net</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">{property.specs?.age || 'N/A'}</div>
                                <div className="text-xs opacity-80">Yaş</div>
                              </div>
                            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
                              {property.buildingFeatures?.hasElevator && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🏢 Asansör</span>
                                </div>
                              )}
                              {property.buildingFeatures?.hasCarPark && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🚗 Otopark</span>
                                </div>
                              )}
                              {property.exteriorFeatures?.hasBalcony && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🏡 Balkon</span>
                                </div>
                              )}
                              {property.specs?.furnishing === 'Furnished' && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🪑 Eşyalı</span>
                                </div>
                              )}
                              {property.propertyDetails?.inSite && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🏘️ Sitede</span>
                                </div>
                              )}
                              {property.specs?.heating && (
                                <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                  <span>🔥 {property.specs.heating.split(' ')[0]}</span>
                                </div>
                              )}
                            </div>
                            <Link 
                              href={generatePropertyUrl(property)}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <span>Detayları İncele</span>
                              <motion.svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </motion.svg>
                            </Link>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <motion.h3 
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {property.title}
                    </motion.h3>
                    
            <div className="flex items-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      <motion.svg 
                        className="w-5 h-5 mr-2 text-primary-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: hoveredCard === property.id ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </motion.svg>
                      <span className="font-medium">
                        {`${property.location.city || ''} ${property.location.district || ''}`.trim() || 'Konum belirtilmemiş'}
                      </span>
                    </div>

                    {/* Enhanced Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary-200 transition-all duration-300 h-20 flex flex-col justify-center"
                      >
                        <div className="text-primary-500 mb-1">
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21h6" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{property.specs?.rooms || 'N/A'}</div>
                        <div className="text-xs text-gray-600 font-medium">Oda</div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary-200 transition-all duration-300 h-20 flex flex-col justify-center"
                      >
                        <div className="text-primary-500 mb-1">
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{property.specs?.bathrooms || 'N/A'}</div>
                        <div className="text-xs text-gray-600 font-medium">Banyo</div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary-200 transition-all duration-300 h-20 flex flex-col justify-center"
                      >
                        <div className="text-primary-500 mb-1">
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{property.specs?.netSize || 'N/A'}</div>
                        <div className="text-xs text-gray-600 font-medium">m²</div>
                      </motion.div>
                    </div>

                    {/* Price Display Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-auto"
                    >
                      <Link 
                        href={generatePropertyUrl(property)}
              className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-black">
                            ₺{new Intl.NumberFormat('tr-TR', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(property.price)}
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "60px 60px"
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.h3 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                className="text-3xl md:text-4xl font-black text-white mb-6 flex items-center justify-center gap-3"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Premium Emlak Koleksiyonu
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
              >
                Binlerce seçkin emlak arasından size özel seçenekleri keşfedin. 
                Bize danışın ve güvenilir hizmet garantisi ile yanınızdayız.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/for-sale"
                    className="inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21h6" />
                </svg>
                <span>Satılık İlanları Görüntüle</span>
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/for-rent"
                    className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                  >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Kiralık İlanları Görüntüle</span>
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}