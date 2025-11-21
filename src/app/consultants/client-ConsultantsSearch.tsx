"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import consultantsData from '@/data/consultants.json';
import { consultantTypes } from '@/data/consultant-types';

export default function ConsultantsSearch({ onChange }: { onChange?: (filters: any) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countryFilter, setCountryFilter] = useState<string>(searchParams.get('country') ?? 'all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>(searchParams.get('specialty') ?? 'all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setCountryFilter(searchParams.get('country') ?? 'all');
    setSpecialtyFilter(searchParams.get('specialty') ?? 'all');
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    onChange?.({ country: countryFilter, specialty: specialtyFilter, q: query });
  }, [countryFilter, specialtyFilter, query, onChange]);

  return (
    <div className="flex items-center gap-3 w-full">
      <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
        <option value="all">Tüm Ülkeler</option>
        {Array.from(new Set(consultantsData.map(c => c.country))).map(code => (
          <option value={code} key={code}>{code}</option>
        ))}
      </select>
      <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
        <option value="all">Tüm Uzmanlıklar</option>
        {consultantTypes.map(ct => (
          <option value={ct.slug} key={ct.slug}>{ct.label}</option>
        ))}
      </select>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Danışman ara..." className="flex-1 px-3 py-2 rounded-lg border bg-white" />
    </div>
  );
}
