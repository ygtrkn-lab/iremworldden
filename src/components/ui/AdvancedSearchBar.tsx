"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFilters, PropertyCategory } from '@/types/property';
import { useSearch } from '@/contexts/SearchContext';

interface AdvancedSearchBarProps {
  initialFilters?: PropertyFilters;
}

interface LocationOption {
  value: string;
  label: string;
}

interface LocationData {
  countries: LocationOption[];
  cities: { [country: string]: LocationOption[] };
  districts: { [city: string]: LocationOption[] };
}

export default function AdvancedSearchBar({ initialFilters }: AdvancedSearchBarProps) {
  const router = useRouter();
  const { isMobileSearchOpen, setIsMobileSearchOpen } = useSearch();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({ 
    ...initialFilters, 
    country: 'TR' // Türkiye'yi varsayılan olarak ayarla
  });
  const [locationData, setLocationData] = useState<LocationData>({
    countries: [],
    cities: {},
    districts: {}
  });
  const [searchText, setSearchText] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Body scroll kontrolü - mobil modal açıldığında
  useEffect(() => {
    if (isMobileSearchOpen) {
      // Ana sayfanın scroll'unu tamamen engelle
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Scroll'u geri aç
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileSearchOpen]);

    useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const url = filters.propertyType 
          ? `/api/locations?type=${filters.propertyType}`
          : '/api/locations';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setLocationData(data);
        } else {
          console.error('Failed to fetch locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [filters.propertyType]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    // Ana filtreler
    if (filters.propertyType) queryParams.append('type', filters.propertyType);
    if (filters.category) queryParams.append('category', JSON.stringify(filters.category));
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.district) queryParams.append('district', filters.district);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (searchText.trim()) queryParams.append('search', searchText.trim());
    
    // Gelişmiş filtreler
    if (filters.rooms) queryParams.append('rooms', filters.rooms);
    if (filters.minSize) queryParams.append('minSize', filters.minSize.toString());
    if (filters.maxSize) queryParams.append('maxSize', filters.maxSize.toString());
    if (filters.furnishing) queryParams.append('furnishing', filters.furnishing);
    if (filters.kitchenType) queryParams.append('kitchenType', filters.kitchenType);
    if (filters.heatingType) queryParams.append('heatingType', filters.heatingType);
    if (filters.usageStatus) queryParams.append('usageStatus', filters.usageStatus);
    if (filters.deedStatus) queryParams.append('deedStatus', filters.deedStatus);
    if (filters.fromWho) queryParams.append('fromWho', filters.fromWho);
    if (filters.maxMonthlyFee) queryParams.append('maxMonthlyFee', filters.maxMonthlyFee.toString());

    // Özellikler
    if (filters.hasParking) queryParams.append('hasParking', 'true');
    if (filters.hasElevator) queryParams.append('hasElevator', 'true');
    if (filters.isFurnished) queryParams.append('isFurnished', 'true');
    if (filters.hasBalcony) queryParams.append('hasBalcony', 'true');
    if (filters.inSite) queryParams.append('inSite', 'true');
    if (filters.creditEligible) queryParams.append('creditEligible', 'true');
    if (filters.exchangeAvailable) queryParams.append('exchangeAvailable', 'true');

    // Yönlendirme - Eğer propertyType seçilmemişse /all'a git
    let targetPath = '/all';
    if (filters.propertyType === 'sale') {
      targetPath = '/for-sale';
    } else if (filters.propertyType === 'rent') {
      targetPath = '/for-rent';
    }

    const queryString = queryParams.toString();
    router.push(`${targetPath}${queryString ? `?${queryString}` : ''}`);
  };

  // Kategori seçenekleri - PropertyCategory tipine uygun
  const categoryOptions: { main: string; sub: string; label: string }[] = [
    // Konut
    { main: "Konut", sub: "Daire", label: "Daire" },
    { main: "Konut", sub: "Villa", label: "Villa" },
    { main: "Konut", sub: "Müstakil Ev", label: "Müstakil Ev" },
    { main: "Konut", sub: "Dubleks", label: "Dubleks" },
    { main: "Konut", sub: "Tripleks", label: "Tripleks" },
    { main: "Konut", sub: "Rezidans", label: "Rezidans" },
    { main: "Konut", sub: "Stüdyo", label: "Stüdyo" },
    // İş Yeri
    { main: "İş Yeri", sub: "Ofis", label: "Ofis" },
    { main: "İş Yeri", sub: "Büro", label: "Büro" },
    { main: "İş Yeri", sub: "Plaza", label: "Plaza" },
    { main: "İş Yeri", sub: "İş Merkezi", label: "İş Merkezi" },
    { main: "İş Yeri", sub: "Dükkan", label: "Dükkan" },
    { main: "İş Yeri", sub: "Mağaza", label: "Mağaza" },
    { main: "İş Yeri", sub: "Depo", label: "Depo" },
    { main: "İş Yeri", sub: "Fabrika", label: "Fabrika" },
    { main: "İş Yeri", sub: "Atölye", label: "Atölye" },
    // Arsa
    { main: "Arsa", sub: "Konut Arsası", label: "Konut Arsası" },
    { main: "Arsa", sub: "Ticari Arsa", label: "Ticari Arsa" },
    { main: "Arsa", sub: "Sanayi Arsası", label: "Sanayi Arsası" },
    { main: "Arsa", sub: "Tarla", label: "Tarla" },
    { main: "Arsa", sub: "Bağ-Bahçe", label: "Bağ-Bahçe" },
    // Turistik Tesis
    { main: "Turistik Tesis", sub: "Otel", label: "Otel" },
    { main: "Turistik Tesis", sub: "Apart Otel", label: "Apart Otel" },
    { main: "Turistik Tesis", sub: "Pansiyon", label: "Pansiyon" },
  ];

  const groupedCategories = categoryOptions.reduce((acc, option) => {
    if (!acc[option.main]) acc[option.main] = [];
    acc[option.main].push(option);
    return acc;
  }, {} as Record<string, typeof categoryOptions>);

  return (
    <div className="w-full max-w-6xl mx-auto relative z-50">
      {/* Desktop Search Bar */}
      <div className="hidden md:block relative bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-hidden shadow-2xl">
        <div className="flex items-center overflow-x-auto">
          {/* İşlem Tipi */}
          <select
            className="flex-none w-32 py-5 pl-6 pr-2 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
            value={filters.propertyType || ''}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" className="text-gray-900">Tümü</option>
            <option value="sale" className="text-gray-900">Satılık</option>
            <option value="rent" className="text-gray-900">Kiralık</option>
          </select>

          {/* Ülke Seçimi */}
          <select
            className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
            value={filters.country || 'TR'}
            onChange={(e) => {
              const country = e.target.value || undefined;
              setFilters({ 
                ...filters, 
                country,
                city: undefined,
                district: undefined 
              });
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {isLoadingLocations ? (
              <option value="TR" className="text-gray-900">Yükleniyor...</option>
            ) : (
              locationData.countries.map(country => (
                <option key={country.value} value={country.value} className="text-gray-900">
                  {country.label}
                </option>
              ))
            )}
          </select>

          {/* Şehir Seçimi */}
          <select
            className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
            value={filters.city || ''}
            onChange={(e) => {
              const city = e.target.value || undefined;
              setFilters({ 
                ...filters, 
                city,
                district: undefined 
              });
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" className="text-gray-900">Şehir</option>
            {filters.country && locationData.cities[filters.country] && 
              locationData.cities[filters.country].map(city => (
                <option key={city.value} value={city.value} className="text-gray-900">
                  {city.label}
                </option>
              ))
            }
          </select>

          {/* İlçe Seçimi */}
          {filters.city && locationData.districts[filters.city] && locationData.districts[filters.city].length > 0 && (
            <select
              className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
              value={filters.district || ''}
              onChange={(e) => {
                const district = e.target.value || undefined;
                setFilters({ ...filters, district });
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" className="text-gray-900">İlçe</option>
              {locationData.districts[filters.city].map(district => (
                <option key={district.value} value={district.value} className="text-gray-900">
                  {district.label}
                </option>
              ))}
            </select>
          )}

          {/* Arama Kutusu - Flex-1 ile kalan boşluğu doldurur */}
          <div className="flex-1 flex items-center pl-4 min-w-0">
            <svg 
              className="w-5 h-5 text-white/80 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Konum, özellik veya kelime ara..."
              className="flex-1 ml-3 py-5 bg-transparent text-white placeholder-white/70 border-none focus:outline-none text-lg min-w-0"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Gelişmiş Arama Butonu */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex-none px-6 text-white/80 hover:text-white border-l border-white/20"
          >
            <svg
              className={`w-6 h-6 transform transition-transform ${isAdvancedOpen ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          {/* Arama Butonu */}
          <button
            onClick={handleSearch}
            className="flex-none bg-primary-500 hover:bg-primary-600 text-white px-8 py-5 font-semibold transition-all duration-300 rounded-full mr-1"
          >
            Ara
          </button>
        </div>
      </div>

      {/* Gelişmiş Arama Paneli */}
      {isAdvancedOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-3 bg-gray-900 rounded-2xl border border-white/20 p-6 shadow-xl z-[200] max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Emlak Kategorisi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.category ? `${filters.category.main}:${filters.category.sub}` : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const [main, sub] = value.split(':');
                    setFilters({ 
                      ...filters, 
                      category: { main: main as any, sub } as PropertyCategory 
                    });
                  } else {
                    setFilters({ ...filters, category: undefined });
                  }
                }}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Tüm Kategoriler</option>
                {Object.entries(groupedCategories).map(([group, options]) => (
                  <optgroup key={group} label={group} className="text-gray-900">
                    {options.map(option => (
                      <option key={`${option.main}:${option.sub}`} value={`${option.main}:${option.sub}`} className="text-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Fiyat Aralığı */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Fiyat Aralığı (₺)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min fiyat"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  placeholder="Max fiyat"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Oda Sayısı */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Oda Sayısı
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.rooms || ''}
                onChange={(e) => setFilters({ ...filters, rooms: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                {['1+0', '1+1', '2+1', '3+1', '4+1', '5+1'].map(room => (
                  <option key={room} value={room} className="text-gray-900">{room}</option>
                ))}
              </select>
            </div>

            {/* Metrekare */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Metrekare
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min m²"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.minSize || ''}
                  onChange={(e) => setFilters({ ...filters, minSize: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  placeholder="Max m²"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.maxSize || ''}
                  onChange={(e) => setFilters({ ...filters, maxSize: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Mutfak Tipi */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mutfak Tipi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.kitchenType || ''}
                onChange={(e) => setFilters({ ...filters, kitchenType: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                <option value="Açık" className="text-gray-900">Açık</option>
                <option value="Kapalı" className="text-gray-900">Kapalı</option>
              </select>
            </div>

            {/* Isıtma Tipi */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Isıtma Tipi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.heatingType || ''}
                onChange={(e) => setFilters({ ...filters, heatingType: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                <option value="Kombi" className="text-gray-900">Kombi</option>
                <option value="Doğalgaz" className="text-gray-900">Doğalgaz</option>
                <option value="Merkezi" className="text-gray-900">Merkezi</option>
                <option value="Payölçer" className="text-gray-900">Payölçer</option>
                <option value="Yerden Isıtma" className="text-gray-900">Yerden Isıtma</option>
              </select>
            </div>
          </div>

          {/* Özellikler */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Özellikler
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'hasParking', label: 'Otopark' },
                { key: 'hasElevator', label: 'Asansör' },
                { key: 'isFurnished', label: 'Eşyalı' },
                { key: 'hasBalcony', label: 'Balkon' },
                { key: 'inSite', label: 'Site İçerisinde' },
                { key: 'creditEligible', label: 'Krediye Uygun' },
                { key: 'exchangeAvailable', label: 'Takas Yapılır' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center group cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary"
                    checked={Boolean(filters[key as keyof PropertyFilters]) || false}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.checked || undefined })}
                  />
                  <span className="ml-2 text-sm text-white/90 group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl flex items-center justify-between text-white"
        >
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-white/90">Emlak ara...</span>
          </div>
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 md:hidden" style={{ zIndex: 99999 }}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileSearchOpen(false)}
            style={{ zIndex: 99998 }}
          />
          
          {/* Modal - Kompakt ve İyileştirilmiş */}
          <div className="fixed inset-x-3 top-6 bottom-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden" style={{ zIndex: 99999 }}>
            {/* Header - Kompakt */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-blue-600/20 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-white">Emlak Ara</h2>
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - Kompakt */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Arama Metni - Kompakt */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Konum, özellik ara..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder-white/40 text-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>

                {/* İşlem Tipi - Kompakt */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wide">
                    İşlem Tipi
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { value: '', label: 'Tümü', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { value: 'sale', label: 'Satılık', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                      { value: 'rent', label: 'Kiralık', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters({ ...filters, propertyType: option.value || undefined })}
                        className={`py-2 px-2 rounded-lg border transition-all text-xs font-medium flex items-center justify-center space-x-2 ${
                          filters.propertyType === option.value
                            ? 'bg-primary/20 text-primary-300 border-primary/30'
                            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={option.icon} />
                        </svg>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lokasyon - Kompakt */}
                <div className="space-y-2">
                  {/* Ülke Seçimi */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Ülke</label>
                    <select
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 text-sm appearance-none [&>option]:bg-gray-800 [&>option]:text-white"
                      value={filters.country || 'TR'}
                      onChange={(e) => {
                        const country = e.target.value || undefined;
                        setFilters({ 
                          ...filters, 
                          country,
                          city: undefined,
                          district: undefined 
                        });
                      }}
                    >
                      {isLoadingLocations ? (
                        <option value="TR" className="bg-gray-800 text-white">Yükleniyor...</option>
                      ) : (
                        locationData.countries.map(country => (
                          <option key={country.value} value={country.value} className="bg-gray-800 text-white">
                            {country.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Şehir ve İlçe Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Şehir</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 text-sm appearance-none [&>option]:bg-gray-800 [&>option]:text-white"
                        value={filters.city || ''}
                        onChange={(e) => {
                          const city = e.target.value || undefined;
                          setFilters({ 
                            ...filters, 
                            city,
                            district: undefined 
                          });
                        }}
                      >
                        <option value="" className="bg-gray-800 text-white">Tüm Şehirler</option>
                        {filters.country && locationData.cities[filters.country] && 
                          locationData.cities[filters.country].map(city => (
                            <option key={city.value} value={city.value} className="bg-gray-800 text-white">
                              {city.label}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {filters.city && locationData.districts[filters.city] && locationData.districts[filters.city].length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">İlçe</label>
                        <select
                          className="w-full px-3 py-2 bg-gray-800 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 text-sm appearance-none [&>option]:bg-gray-800 [&>option]:text-white"
                          value={filters.district || ''}
                          onChange={(e) => {
                            const district = e.target.value || undefined;
                            setFilters({ ...filters, district });
                          }}
                        >
                          <option value="" className="bg-gray-800 text-white">Tüm İlçeler</option>
                          {locationData.districts[filters.city].map(district => (
                            <option key={district.value} value={district.value} className="bg-gray-800 text-white">
                              {district.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fiyat Aralığı - Kompakt */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wide">
                    Fiyat Aralığı (₺)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-white/5 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 placeholder-white/40 text-sm"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-white/5 text-white border border-white/10 rounded-lg focus:ring-1 focus:ring-primary/50 placeholder-white/40 text-sm"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>

                {/* Oda Sayısı - Kompakt */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wide">
                    Oda Sayısı
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {['1+0', '1+1', '2+1', '3+1', '4+1', '5+1'].map((room) => (
                      <button
                        key={room}
                        onClick={() => setFilters({ ...filters, rooms: filters.rooms === room ? undefined : room })}
                        className={`py-1.5 px-1 rounded-md border transition-all text-xs font-medium ${
                          filters.rooms === room
                            ? 'bg-primary/20 text-primary-300 border-primary/30'
                            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Özellikler - Kompakt Grid */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wide">
                    Özellikler
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: 'hasParking', label: 'Otopark', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                      { key: 'hasElevator', label: 'Asansör', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
                      { key: 'isFurnished', label: 'Eşyalı', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
                      { key: 'hasBalcony', label: 'Balkon', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { key: 'inSite', label: 'Site İçi', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                      { key: 'creditEligible', label: 'Kredili', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
                    ].map(({ key, label, icon }) => (
                      <label key={key} className={`flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-lg transition-colors text-xs ${
                        Boolean(filters[key as keyof PropertyFilters])
                          ? 'bg-primary/20 text-primary-300'
                          : 'bg-white/5 text-white/80 hover:bg-white/10'
                      }`}>
                        <input
                          type="checkbox"
                          className="w-3 h-3 rounded text-primary focus:ring-primary/50 bg-white/10 border-white/20"
                          checked={Boolean(filters[key as keyof PropertyFilters]) || false}
                          onChange={(e) => setFilters({ ...filters, [key]: e.target.checked || undefined })}
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                        <span className="font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Kompakt ve Sabit */}
            <div className="border-t border-white/10 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setFilters({ country: 'TR' });
                    setSearchText('');
                  }}
                  className="py-2.5 px-4 bg-white/10 text-white/90 border border-white/20 rounded-lg hover:bg-white/20 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Temizle</span>
                </button>
                <button
                  onClick={() => {
                    handleSearch();
                    setIsMobileSearchOpen(false);
                  }}
                  className="py-2.5 px-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all font-medium text-sm flex items-center justify-center space-x-1 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Ara</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
