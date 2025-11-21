"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyFilters as Filters } from '@/types/property';

interface PropertyFiltersProps {
  initialFilters: Filters;
  onFilterChange: (filters: Filters) => void;
  cities: string[];
  districts: string[];
}

export default function PropertyFilters({
  initialFilters,
  onFilterChange,
  cities,
  districts
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    onFilterChange(filters);
    updateURL(filters);
  }, [filters, onFilterChange]);

  const updateURL = (newFilters: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Mevcut parametreleri temizle (sadece filtre parametrelerini)
    const filterKeys = [
      'category', 'city', 'district', 'minPrice', 'maxPrice', 'rooms', 
      'minSize', 'maxSize', 'kitchenType', 'heatingType', 'furnishing',
      'usageStatus', 'deedStatus', 'fromWho', 'maxMonthlyFee',
      'hasParking', 'hasElevator', 'isFurnished', 'hasBalcony', 
      'inSite', 'creditEligible', 'exchangeAvailable'
    ];
    
    filterKeys.forEach(key => params.delete(key));

    // Yeni filtreleri ekle
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'category' && typeof value === 'object') {
          // Kategori objesi için JSON string kullan
          params.set('category', JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else if (typeof value === 'number') {
          params.set(key, value.toString());
        } else {
          params.set(key, value.toString());
        }
      }
    });

    // URL'yi güncelle
    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  };

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === null || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      
      // Şehir değiştiğinde ilçeyi temizle
      if (key === 'city' && value !== prev.city) {
        delete newFilters.district;
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">Filtreler</h4>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Temizle
        </button>
      </div>

      {/* Ana Kategori */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ana Kategori
        </label>
        <select
          value={filters.category?.main || ''}
          onChange={(e) => {
            const mainCategory = e.target.value;
            if (mainCategory) {
              updateFilter('category', { 
                main: mainCategory as 'Konut' | 'İş Yeri' | 'Arsa' | 'Bina' | 'Turistik Tesis' | 'Devremülk', 
                sub: '' 
              });
            } else {
              updateFilter('category', undefined);
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="Konut">Konut</option>
          <option value="İş Yeri">İş Yeri</option>
          <option value="Arsa">Arsa</option>
          <option value="Bina">Bina</option>
          <option value="Turistik Tesis">Turistik Tesis</option>
          <option value="Devremülk">Devremülk</option>
          <option value="Devlet">Devlet</option>
        </select>
      </div>

      {/* Alt Kategori */}
      {filters.category?.main && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Alt Kategori
          </label>
          <select
            value={filters.category?.sub || ''}
            onChange={(e) => {
              if (filters.category) {
                updateFilter('category', { ...filters.category, sub: e.target.value });
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Tüm Alt Kategoriler</option>
            {filters.category.main === 'Konut' && (
              <>
                <option value="Daire">Daire</option>
                <option value="Villa">Villa</option>
                <option value="Müstakil Ev">Müstakil Ev</option>
                <option value="Dubleks">Dubleks</option>
                <option value="Tripleks">Tripleks</option>
                <option value="Rezidans">Rezidans</option>
                <option value="Stüdyo">Stüdyo</option>
              </>
            )}
            {filters.category.main === 'İş Yeri' && (
              <>
                <option value="Ofis">Ofis</option>
                <option value="Büro">Büro</option>
                <option value="Plaza">Plaza</option>
                <option value="İş Merkezi">İş Merkezi</option>
                <option value="Dükkan">Dükkan</option>
                <option value="Mağaza">Mağaza</option>
                <option value="Depo">Depo</option>
                <option value="Fabrika">Fabrika</option>
                <option value="Atölye">Atölye</option>
              </>
            )}
            {filters.category.main === 'Arsa' && (
              <>
                <option value="İmarlı Arsa">İmarlı Arsa</option>
                <option value="Tarla">Tarla</option>
                <option value="Bağ-Bahçe">Bağ-Bahçe</option>
                <option value="Konut İmarlı">Konut İmarlı</option>
                <option value="Ticari İmarlı">Ticari İmarlı</option>
                <option value="Sanayi İmarlı">Sanayi İmarlı</option>
              </>
            )}
            {filters.category.main === 'Bina' && (
              <>
                <option value="Apartman">Apartman</option>
                <option value="İş Hanı">İş Hanı</option>
                <option value="Plaza">Plaza</option>
              </>
            )}
            {filters.category.main === 'Turistik Tesis' && (
              <>
                <option value="Otel">Otel</option>
                <option value="Apart Otel">Apart Otel</option>
                <option value="Tatil Köyü">Tatil Köyü</option>
                <option value="Motel">Motel</option>
              </>
            )}
            {filters.category.main === 'Devlet' && (
              <>
                <option value="Devlet (Kamu) Gayrimenkulleri & Altyapı">Devlet (Kamu) Gayrimenkulleri & Altyapı</option>
                <option value="Kamu Binaları (bakanlık, belediye, adliye, güvenlik birimleri)">Kamu Binaları (bakanlık, belediye, adliye, güvenlik birimleri)</option>
                <option value="Eğitim & Sağlık Yapıları (okullar, üniversiteler, şehir/devlet hastaneleri)">Eğitim & Sağlık Yapıları (okullar, üniversiteler, şehir/devlet hastaneleri)</option>
                <option value="Kültür & Sosyal Tesisler (müzeler, spor, kültür merkezleri)">Kültür & Sosyal Tesisler (müzeler, spor, kültür merkezleri)</option>
                <option value="Altyapı Projeleri (köprü, yol, tünel, demiryolu, havalimanı, baraj, enerji)">Altyapı Projeleri (köprü, yol, tünel, demiryolu, havalimanı, baraj, enerji)</option>
                <option value="Kamu Arazileri (hazine, orman, mera)">Kamu Arazileri (hazine, orman, mera)</option>
              </>
            )}
          </select>
        </div>
      )}

      {/* Şehir */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Şehir
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => updateFilter('city', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tüm Şehirler</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* İlçe */}
      {filters.city && districts.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            İlçe
          </label>
          <select
            value={filters.district || ''}
            onChange={(e) => updateFilter('district', e.target.value || undefined)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Tüm İlçeler</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      )}

      {/* Fiyat Aralığı */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fiyat Aralığı (₺)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Oda Sayısı */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Oda Sayısı
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Stüdyo', '1+0', '1+1', '2+0', '2+1', '3+1', '3+2', '4+1', '4+2', '5+1', '5+2', '6+ Oda'].map((room) => (
            <button
              key={room}
              onClick={() => updateFilter('rooms', filters.rooms === room ? undefined : room)}
              className={`py-2 px-2 text-xs rounded-lg border transition-all ${
                filters.rooms === room
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Net Metrekare */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Net Metrekare
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min m²"
            value={filters.minSize || ''}
            onChange={(e) => updateFilter('minSize', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <input
            type="number"
            placeholder="Max m²"
            value={filters.maxSize || ''}
            onChange={(e) => updateFilter('maxSize', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Mutfak Tipi */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mutfak Tipi
        </label>
        <select
          value={filters.kitchenType || ''}
          onChange={(e) => updateFilter('kitchenType', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Açık">Açık</option>
          <option value="Kapalı">Kapalı</option>
          <option value="Amerikan">Amerikan</option>
        </select>
      </div>

      {/* Isıtma Tipi */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Isıtma Tipi
        </label>
        <select
          value={filters.heatingType || ''}
          onChange={(e) => updateFilter('heatingType', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Kombi Doğalgaz">Kombi Doğalgaz</option>
          <option value="Merkezi Doğalgaz">Merkezi Doğalgaz</option>
          <option value="Yerden Isıtma">Yerden Isıtma</option>
          <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
          <option value="Klima">Klima</option>
          <option value="Şömine">Şömine</option>
          <option value="Soba">Soba</option>
          <option value="Isıtma Yok">Isıtma Yok</option>
        </select>
      </div>

      {/* Eşya Durumu */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Eşya Durumu
        </label>
        <select
          value={filters.furnishing || ''}
          onChange={(e) => updateFilter('furnishing', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Furnished">Eşyalı</option>
          <option value="Unfurnished">Eşyasız</option>
          <option value="Partially Furnished">Kısmen Eşyalı</option>
        </select>
      </div>

      {/* Kullanım Durumu */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kullanım Durumu
        </label>
        <select
          value={filters.usageStatus || ''}
          onChange={(e) => updateFilter('usageStatus', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Boş">Boş</option>
          <option value="Kiracılı">Kiracılı</option>
          <option value="Mülk Sahibi">Mülk Sahibi</option>
          <option value="Yeni Yapılmış">Yeni Yapılmış</option>
        </select>
      </div>

      {/* Tapu Durumu */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tapu Durumu
        </label>
        <select
          value={filters.deedStatus || ''}
          onChange={(e) => updateFilter('deedStatus', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Kat Mülkiyeti">Kat Mülkiyeti</option>
          <option value="Kat İrtifakı">Kat İrtifakı</option>
          <option value="Arsa Tapulu">Arsa Tapulu</option>
          <option value="Hisseli Tapu">Hisseli Tapu</option>
          <option value="Müstakil Tapulu">Müstakil Tapulu</option>
        </select>
      </div>

      {/* Kimden */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kimden
        </label>
        <select
          value={filters.fromWho || ''}
          onChange={(e) => updateFilter('fromWho', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Sahibinden">Sahibinden</option>
          <option value="Emlak Ofisinden">Emlak Ofisinden</option>
          <option value="Bankadan">Bankadan</option>
          <option value="Müteahhitten">Müteahhitten</option>
          <option value="Belediyeden">Belediyeden</option>
        </select>
      </div>

      {/* Maksimum Aylık Aidat */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Maksimum Aylık Aidat (₺)
        </label>
        <input
          type="number"
          placeholder="Max aidat"
          value={filters.maxMonthlyFee || ''}
          onChange={(e) => updateFilter('maxMonthlyFee', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Özellikler */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Özellikler
        </label>
        <div className="space-y-2">
          {[
            { key: 'hasBalcony', label: 'Balkon' },
            { key: 'hasParking', label: 'Otopark' },
            { key: 'hasElevator', label: 'Asansör' },
            { key: 'isFurnished', label: 'Eşyalı' },
            { key: 'inSite', label: 'Site İçerisinde' },
            { key: 'creditEligible', label: 'Krediye Uygun' },
            { key: 'exchangeAvailable', label: 'Takas Yapılır' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(filters[key as keyof Filters]) || false}
                onChange={(e) => updateFilter(key as keyof Filters, e.target.checked || undefined)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
