'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ClientConsultantsSearch from './client-ConsultantsSearch';
import ReactCountryFlag from 'react-country-flag';
import consultantsData from '@/data/consultants.json';
import { consultantTypes, consultantCategoryLabel } from '@/data/consultant-types';

const consultantCountryOptions = Array.from(
  consultantsData.reduce((map, consultant) => {
    if (!map.has(consultant.country)) {
      map.set(consultant.country, consultant.countryName);
    }
    return map;
  }, new Map<string, string>())
).map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const ConsultantCard = ({ consultant }: { consultant: (typeof consultantsData)[number] }) => {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/90 shadow-sm hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img
          src={consultant.photo}
          alt={consultant.name}
          className="w-14 h-14 rounded-full object-cover border border-orange-200"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f07f38] uppercase tracking-[0.2em]">{consultant.categoryName}</p>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{consultant.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ReactCountryFlag countryCode={consultant.country} svg className="rounded" style={{ width: '1.2em', height: '1.2em' }} />
            <span>{consultant.countryName}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="rounded-xl bg-orange-50/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c26428]">E-posta</p>
          <p className="font-medium text-gray-900 break-all">{consultant.email}</p>
        </div>
        <div className="rounded-xl bg-orange-50/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c26428]">Telefon</p>
          <p className="font-medium text-gray-900">{consultant.phone}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">Global Ağ</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">Doğrulanmış Profil</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={`mailto:${consultant.email}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#f07f38]/40 px-4 py-2 text-sm font-medium text-[#f07f38] hover:bg-[#fff1e7]"
        >
          E-posta Gönder
        </a>
        <a
          href={`tel:${consultant.phone.replace(/\s+/g, '')}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-[#f07f38] to-[#ff8c4a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
          Hemen Ara
        </a>
      </div>
    </div>
  );
};

export default function ConsultantsPage() {
  const router = useRouter();
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Keep page controlled state; client search component will initialize from URL
  }, []);

  const syncQueryParams = (country: string, specialty: string) => {
    const params = new URLSearchParams();
    if (country !== 'all') params.set('country', country);
    if (specialty !== 'all') params.set('specialty', specialty);
    router.replace(`/consultants${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const handleCountryChange = (value: string) => {
    setCountryFilter(value);
    syncQueryParams(value, specialtyFilter);
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialtyFilter(value);
    syncQueryParams(countryFilter, value);
  };

  const filteredConsultants = useMemo(() => {
    return consultantsData.filter(consultant => {
      const matchesCountry = countryFilter === 'all' ? true : consultant.country === countryFilter;
      const matchesSpecialty = specialtyFilter === 'all' ? true : consultant.category === specialtyFilter;
      const matchesQuery = query
        ? consultant.name.toLowerCase().includes(query.toLowerCase()) ||
          consultant.countryName.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesCountry && matchesSpecialty && matchesQuery;
    });
  }, [countryFilter, specialtyFilter, query]);

  const stats = useMemo(() => {
    const total = consultantsData.length;
    const countries = consultantCountryOptions.length;
    const categoryCounts = consultantTypes.reduce<Record<string, number>>((acc, type) => {
      acc[type.id] = consultantsData.filter(c => c.category === type.id).length;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    return {
      total,
      countries,
      topCategory: topCategory ? `${consultantCategoryLabel(topCategory[0])} (${topCategory[1]})` : 'Veri bekleniyor',
    };
  }, []);

  const clearFilters = () => {
    setCountryFilter('all');
    setSpecialtyFilter('all');
    setQuery('');
    router.replace('/consultants', { scroll: false });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "url('/images/consultants/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="text-center space-y-4 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f07f38]">Danışman Ağı</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            Global Uzmanlarla İletişime Geçin
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            İhtiyacınıza uygun hukuk, finans, mimari ve teknik danışmanları filtreleyin. Tüm profiller IremWorld tarafından
            doğrulanmıştır ve doğrudan iletişim bilgilerini içerir.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c26428]">Toplam Uzman</p>
            <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c26428]">Ülke</p>
            <p className="text-3xl font-semibold text-gray-900">{stats.countries}</p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c26428]">En Yoğun Alan</p>
            <p className="text-sm font-semibold text-gray-900 mt-2">{stats.topCategory}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-orange-100 bg-white/90 shadow-lg p-5 sm:p-6 mb-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-[0.2em]">Ülke</label>
              <select
                value={countryFilter}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#f07f38] focus:ring-2 focus:ring-[#f07f38]/20"
              >
                <option value="all">Tüm ülkeler</option>
                {consultantCountryOptions.map(option => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-[0.2em]">Uzmanlık</label>
              <select
                value={specialtyFilter}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#f07f38] focus:ring-2 focus:ring-[#f07f38]/20"
              >
                <option value="all">Tüm uzmanlıklar</option>
                {consultantTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
              <Suspense fallback={<div className="w-full" />}>
                <ClientConsultantsSearch onChange={({ country, specialty, q }) => {
                  setCountryFilter(country ?? 'all');
                  setSpecialtyFilter(specialty ?? 'all');
                  setQuery(q ?? '');
                }} />
              </Suspense>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>{filteredConsultants.length} danışman listeleniyor</span>
            {(countryFilter !== 'all' || specialtyFilter !== 'all' || query) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Filtreleri temizle
              </button>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredConsultants.length ? (
            filteredConsultants.map(consultant => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-orange-200 bg-white/70 p-10 text-center">
              <p className="text-lg font-semibold text-gray-900">Aradığınız kriterlerde danışman bulunamadı</p>
              <p className="text-sm text-gray-600 mt-2">
                Farklı bir ülke veya uzmanlık seçerek aramayı genişletebilirsiniz.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
