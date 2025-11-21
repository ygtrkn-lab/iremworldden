"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { governmentProperties } from "@/data/government-properties";
import { GovernmentProperty, GOVERNMENT_CATEGORY_NAMES, GovernmentCategory } from "@/types/government";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactCountryFlag from 'react-country-flag';

function DevletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<GovernmentCategory | "all">("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // URL parametrelerini state'e yükle
  useEffect(() => {
    const categoryParam = searchParams.get('category') as GovernmentCategory | null;
    const cityParam = searchParams.get('city');
    
    if (categoryParam && Object.keys(GOVERNMENT_CATEGORY_NAMES).includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  // Filtreleme
  const filteredProperties = useMemo(() => {
    return governmentProperties.filter(prop => {
      if (selectedCategory !== "all" && prop.category !== selectedCategory) {
        return false;
      }
      
      if (selectedCity !== "all" && prop.location.city !== selectedCity) {
        return false;
      }
      
      if (selectedCountry !== "all" && prop.location.country !== selectedCountry) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          prop.title.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query) ||
          prop.authorizedInstitution.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [selectedCategory, selectedCity, selectedCountry, searchQuery]);

  // Şehir listesi
  const cities = useMemo(() => {
    const filteredProps = selectedCountry === "all" 
      ? governmentProperties 
      : governmentProperties.filter(p => p.location.country === selectedCountry);
      
    const citySet = new Set(filteredProps.map(p => p.location.city));
    return Array.from(citySet).sort();
  }, [selectedCountry]);

  // Seçili şehir mevcut listede yoksa sıfırla (örn: ülke değiştiğinde)
  useEffect(() => {
    if (selectedCity !== "all" && !cities.includes(selectedCity)) {
      setSelectedCity("all");
    }
  }, [cities, selectedCity]);

  // Ülke listesi ve ISO kodları
  const countryCodes: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "GB",
    "United Arab Emirates": "AE",
    "Germany": "DE",
    "France": "FR",
    "Japan": "JP",
    "Singapore": "SG",
    "Canada": "CA",
    "Switzerland": "CH",
    "South Korea": "KR",
    "Sweden": "SE",
    "Australia": "AU",
    "Türkiye": "TR"
  };

  const countries = useMemo(() => {
    const countrySet = new Set(governmentProperties.map(p => p.location.country));
    return Array.from(countrySet).sort();
  }, []);

  const categories = Object.keys(GOVERNMENT_CATEGORY_NAMES) as GovernmentCategory[];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tamamlandı": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Aktif Kullanımda": return "text-blue-700 bg-blue-50 border-blue-200";
      case "İnşaat Devam Ediyor": return "text-amber-700 bg-amber-50 border-amber-200";
      case "İhale Aşamasında": return "text-orange-700 bg-orange-50 border-orange-200";
      case "Planlama Aşamasında": return "text-slate-700 bg-slate-50 border-slate-200";
      default: return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section - Modern with Background Image */}
      <div className="relative bg-slate-900 overflow-hidden h-[500px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/uploads/projects/225/iremworld-project-225-1.jpg"
            alt="Government Projects - Smart City"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Kamu Altyapı & Yatırım Projeleri</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Devlet Projeleri
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl">
              Uluslararası kamu projeleri, altyapı yatırımları ve devlet gayrimenkul portföyü
            </p>
            
            {/* Info Notice */}
            <div className="mt-8 inline-flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-500/10 backdrop-blur-sm border border-amber-400/20">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-100">
                <span className="font-semibold">Demo Veriler:</span> Gösterilen proje bilgileri örnek amaçlıdır, gerçek kamu projeleri değildir.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Filters - Clean & Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Proje Ara
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Proje adı, kurum adı veya lokasyon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-shadow"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-shadow appearance-none cursor-pointer"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {GOVERNMENT_CATEGORY_NAMES[cat]}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div ref={countryDropdownRef}>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Ülke
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="w-full px-4 py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-left flex items-center gap-3"
                >
                  {selectedCountry === "all" ? (
                    <>
                      <span className="text-2xl">🌍</span>
                      <span className="flex-1">Tüm Ülkeler</span>
                    </>
                  ) : (
                    <>
                      <ReactCountryFlag
                        countryCode={countryCodes[selectedCountry]}
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                          borderRadius: '0.25rem',
                        }}
                      />
                      <span className="flex-1">{selectedCountry}</span>
                    </>
                  )}
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {countryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-h-80 overflow-y-auto"
                    >
                      <button
                        onClick={() => {
                          setSelectedCountry("all");
                          setCountryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 ${
                          selectedCountry === "all" ? "bg-slate-50" : ""
                        }`}
                      >
                        <span className="text-2xl">🌍</span>
                        <span className="flex-1 text-slate-900 font-medium">Tüm Ülkeler</span>
                      </button>
                      {countries.map(country => (
                        <button
                          key={country}
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountryDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0 ${
                            selectedCountry === country ? "bg-slate-50" : ""
                          }`}
                        >
                          <ReactCountryFlag
                            countryCode={countryCodes[country]}
                            svg
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                              borderRadius: '0.25rem',
                            }}
                          />
                          <span className="flex-1 text-slate-900 font-medium">{country}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Şehir
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-shadow appearance-none cursor-pointer"
              >
                <option value="all">Tüm Şehirler</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results & View Toggle */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900 text-lg">{filteredProperties.length}</span>
              <span className="ml-2">proje bulundu</span>
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  view === "grid"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  view === "list"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/government/${property.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 h-full">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <Image
                          src={property.coverImage}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(property.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {property.status}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-white/95 backdrop-blur-sm text-slate-900 border border-white/20">
                            {GOVERNMENT_CATEGORY_NAMES[property.category]}
                          </span>
                        </div>

                        {/* Country Flag */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                            <ReactCountryFlag
                              countryCode={countryCodes[property.location.country] || "UN"}
                              svg
                              style={{
                                width: '2em',
                                height: '2em',
                                borderRadius: '0.25rem',
                              }}
                              title={property.location.country}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors leading-snug">
                          {property.title}
                        </h3>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {property.description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-2.5 mb-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{property.location.city}</span>
                            <span className="text-slate-400">•</span>
                            <span>{property.location.district}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="line-clamp-1">{property.authorizedInstitution}</span>
                          </div>
                        </div>

                        {/* Budget */}
                        {property.budget && (
                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toplam Bütçe</span>
                              <span className="text-lg font-bold text-slate-900">
                                {formatCurrency(property.budget.total)} ₺
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/government/${property.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-96 h-64 md:h-auto overflow-hidden flex-shrink-0 bg-slate-100">
                          <Image
                            src={property.coverImage}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(property.status)}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {property.status}
                            </span>
                          </div>
                          
                          {/* Country Flag */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                              <ReactCountryFlag
                                countryCode={countryCodes[property.location.country] || "UN"}
                                svg
                                style={{
                                  width: '2em',
                                  height: '2em',
                                  borderRadius: '0.25rem',
                                }}
                                title={property.location.country}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 mb-3">
                                  {GOVERNMENT_CATEGORY_NAMES[property.category]}
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                                  {property.title}
                                </h3>
                              </div>
                              
                              {property.budget && (
                                <div className="text-right">
                                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Bütçe</p>
                                  <p className="text-2xl font-bold text-slate-900">
                                    {formatCurrency(property.budget.total / 1000000)} M ₺
                                  </p>
                                </div>
                              )}
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">
                              {property.description}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Konum</p>
                                <p className="text-sm font-semibold text-slate-900">{property.location.city}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Kurum</p>
                                <p className="text-sm font-semibold text-slate-900 line-clamp-1">{property.authorizedInstitution.split(' ')[0]}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Alan</p>
                                <p className="text-sm font-semibold text-slate-900">{formatCurrency(property.specs.totalArea)} m²</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Kapasite</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {property.specs.capacity ? `${formatCurrency(property.specs.capacity)}` : '—'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Proje Bulunamadı</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Arama kriterlerinize uygun proje bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsiniz.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function DevletPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f07f38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Devlet projeleri yükleniyor...</p>
        </div>
      </div>
    }>
      <DevletContent />
    </Suspense>
  );
}
