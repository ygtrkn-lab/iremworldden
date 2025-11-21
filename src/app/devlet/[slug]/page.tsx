"use client";

import { useParams, useRouter } from "next/navigation";
import { governmentProperties } from "@/data/government-properties";
import { GOVERNMENT_CATEGORY_NAMES } from "@/types/government";
import Image from "next/image";
import { motion } from "framer-motion";

export default function DevletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const property = governmentProperties.find(p => p.slug === slug);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proje Bulunamadı</h1>
          <button
            onClick={() => router.push("/devlet")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Projelere Dön
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(value);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Tamamlandı": return "bg-green-100 text-green-800";
      case "Aktif Kullanımda": return "bg-blue-100 text-blue-800";
      case "İnşaat Devam Ediyor": return "bg-yellow-100 text-yellow-800";
      case "İhale Aşamasında": return "bg-orange-100 text-orange-800";
      case "Planlama Aşamasında": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(property.status)}`}>
                {property.status}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur text-white">
                {GOVERNMENT_CATEGORY_NAMES[property.category]}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {property.title}
            </h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{property.location.city}, {property.location.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{property.authorizedInstitution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Proje Hakkında</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </motion.div>

            {/* Teknik Özellikler */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Teknik Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Toplam Alan</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(property.specs.totalArea)} m²
                  </p>
                </div>
                {property.specs.builtArea && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">İnşaat Alanı</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(property.specs.builtArea)} m²
                    </p>
                  </div>
                )}
                {property.specs.capacity && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kapasite</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(property.specs.capacity)} kişi
                    </p>
                  </div>
                )}
                {property.specs.floors && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kat Sayısı</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.specs.floors}
                    </p>
                  </div>
                )}
                {property.specs.startDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Başlangıç</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(property.specs.startDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}
                {property.specs.completionDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tamamlanma</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(property.specs.completionDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}
                {property.specs.estimatedCompletion && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tahmini Tamamlanma</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.specs.estimatedCompletion}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Proje Detayları */}
            {property.projectDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Proje Detayları</h2>
                <div className="space-y-4">
                  {property.projectDetails.contractor && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Yüklenici Firma</span>
                      <span className="font-semibold text-gray-900">{property.projectDetails.contractor}</span>
                    </div>
                  )}
                  {property.projectDetails.architect && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Mimari Firma</span>
                      <span className="font-semibold text-gray-900">{property.projectDetails.architect}</span>
                    </div>
                  )}
                  {property.projectDetails.engineer && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Mühendislik Firması</span>
                      <span className="font-semibold text-gray-900">{property.projectDetails.engineer}</span>
                    </div>
                  )}
                  {property.projectDetails.tenderDate && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">İhale Tarihi</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(property.projectDetails.tenderDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {property.projectDetails.tenderAmount && (
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600">İhale Bedeli</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(property.projectDetails.tenderAmount)} ₺
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Özellikler */}
            {property.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Özellikler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Etki Analizi */}
            {property.impact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Etki Analizi</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {property.impact.environmental && (
                    <div>
                      <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Çevresel
                      </h3>
                      <ul className="space-y-2">
                        {property.impact.environmental.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {property.impact.social && (
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Sosyal
                      </h3>
                      <ul className="space-y-2">
                        {property.impact.social.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {property.impact.economic && (
                    <div>
                      <h3 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ekonomik
                      </h3>
                      <ul className="space-y-2">
                        {property.impact.economic.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Bütçe Bilgisi */}
              {property.budget && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white"
                >
                  <h3 className="text-sm font-medium mb-2 opacity-90">Toplam Bütçe</h3>
                  <p className="text-3xl font-bold mb-4">{formatCurrency(property.budget.total)} ₺</p>
                  
                  <div className="space-y-3 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Kaynak</span>
                      <span className="font-semibold">{property.budget.source}</span>
                    </div>
                    {property.budget.allocated && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-90">Tahsis Edilen</span>
                        <span className="font-semibold">{formatCurrency(property.budget.allocated)} ₺</span>
                      </div>
                    )}
                    {property.budget.spent && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-90">Harcanan</span>
                        <span className="font-semibold">{formatCurrency(property.budget.spent)} ₺</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* İletişim */}
              {property.contact && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
                  <div className="space-y-3">
                    {property.contact.department && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Departman</p>
                        <p className="text-sm font-medium text-gray-900">{property.contact.department}</p>
                      </div>
                    )}
                    {property.contact.phone && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Telefon</p>
                        <a href={`tel:${property.contact.phone}`} className="text-sm font-medium text-orange-600 hover:text-orange-700">
                          {property.contact.phone}
                        </a>
                      </div>
                    )}
                    {property.contact.email && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">E-posta</p>
                        <a href={`mailto:${property.contact.email}`} className="text-sm font-medium text-orange-600 hover:text-orange-700">
                          {property.contact.email}
                        </a>
                      </div>
                    )}
                    {property.contact.website && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a href={property.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                          {property.contact.website}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Diğer Bilgiler */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Genel Bilgiler</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mülkiyet</span>
                    <span className="font-medium text-gray-900">{property.ownership}</span>
                  </div>
                  {property.stats && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Görüntülenme</span>
                        <span className="font-medium text-gray-900">{formatCurrency(property.stats.views)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Son Güncelleme</span>
                        <span className="font-medium text-gray-900">
                          {new Date(property.stats.lastUpdated).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Geri Dön Butonu */}
              <button
                onClick={() => router.push("/devlet")}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tüm Projelere Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
