"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store } from "@/types/store";
import { motion } from "framer-motion";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        const result = await response.json();
        if (result.success) {
          setStores(result.data);
          setFilteredStores(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    let filtered = stores;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(s => s.contact.city === cityFilter);
    }

    if (specialtyFilter) {
      filtered = filtered.filter(s => s.specialties.includes(specialtyFilter));
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(s => s.featured);
    }

    setFilteredStores(filtered);
  }, [searchTerm, cityFilter, specialtyFilter, showFeaturedOnly, stores]);

  const cities = Array.from(new Set(stores.map(s => s.contact.city))).sort();
  const allSpecialties = Array.from(
    new Set(stores.flatMap(s => s.specialties))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emlak Mağazaları
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Güvenilir gayrimenkul danışmanlarımızı keşfedin. Deneyimli ekipler
            ve geniş portföylerle hayalinizdeki emlağı bulun.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Mağaza ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tüm Uzmanlıklar</option>
              {allSpecialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={e => setShowFeaturedOnly(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Sadece Öne Çıkanlar</span>
            </label>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredStores.length}
            </span>{" "}
            mağaza bulundu
          </p>
        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mağaza bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun mağaza bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/store/${store.slug}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                      {store.coverImage ? (
                        <img
                          src={store.coverImage}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-20 h-20 text-primary-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {store.featured && (
                          <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            ⭐ Öne Çıkan
                          </span>
                        )}
                        {store.verified && (
                          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Doğrulanmış
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logo */}
                    <div className="relative px-6 -mt-12 mb-4">
                      <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden">
                        <img
                          src={store.logo}
                          alt={store.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {store.name}
                      </h3>
                      {store.tagline && (
                        <p className="text-sm text-primary-600 font-medium mb-3">
                          {store.tagline}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {store.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-gray-900">
                            {store.stats.activeListings}
                          </p>
                          <p className="text-xs text-gray-500">Aktif İlan</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-gray-900">
                            {store.stats.yearsInBusiness}
                          </p>
                          <p className="text-xs text-gray-500">Yıllık Deneyim</p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {store.specialties.slice(0, 3).map(spec => (
                          <span
                            key={spec}
                            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {store.specialties.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{store.specialties.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Location & Rating */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {store.contact.city}
                        </div>
                        {store.rating && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-900">
                              {store.rating}
                            </span>
                            {store.reviewCount && (
                              <span className="text-xs text-gray-500">
                                ({store.reviewCount})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
