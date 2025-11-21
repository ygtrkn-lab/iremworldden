"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FiMapPin, FiTrendingUp, FiLayers, FiCheckCircle } from "react-icons/fi";

interface PropertyInsight {
  id: string;
  title: string;
  segment: string;
  location: string;
  size: string;
  valuation: string;
  rent: string;
  yield: string;
  readiness: string;
  sustainability: string;
  highlight: string;
  image: string;
}

const sampleProperties: PropertyInsight[] = [
  {
    id: "iw-appr-01",
    title: "Panorama Residences",
    segment: "Premium Konut + Ticari",
    location: "İstanbul / Ataşehir",
    size: "4.850 m²",
    valuation: "₺42.6M",
    rent: "₺320K / ay",
    yield: "%5.8",
    readiness: "Teslim Aşamasında",
    sustainability: "LEED Gold Adayı",
    highlight: "Kurumsal kiracı sözleşmeleri hazır.",
    image: "/images/partners/appraisal-hero.jpg",
  },
  {
    id: "iw-appr-02",
    title: "Göztepe Sky Loft",
    segment: "Şehir İçi Loft",
    location: "İstanbul / Kadıköy",
    size: "3.120 m²",
    valuation: "₺31.4M",
    rent: "₺240K / ay",
    yield: "%5.2",
    readiness: "Operasyonda",
    sustainability: "Enerji Sınıfı A",
    highlight: "%92 doluluk ve kısa teslim süresi.",
    image: "/images/partners/interior-design-hero.jpg",
  },
  {
    id: "iw-appr-03",
    title: "Bodrum Coastal Suites",
    segment: "Lüks Rezidans",
    location: "Muğla / Bodrum",
    size: "5.430 m²",
    valuation: "₺58.0M",
    rent: "₺410K / ay",
    yield: "%6.3",
    readiness: "İnşaat %80",
    sustainability: "Yeşil Sertifika",
    highlight: "Turizm sezonu gelir projeksiyonu %18 artış.",
    image: "/images/consultants/background.jpg",
  },
  {
    id: "iw-appr-04",
    title: "Ankara Plaza Offices",
    segment: "Kurumsal Ofis",
    location: "Ankara / Çankaya",
    size: "6.200 m²",
    valuation: "₺47.9M",
    rent: "₺360K / ay",
    yield: "%6.0",
    readiness: "Tamamlandı",
    sustainability: "BREEAM Very Good",
    highlight: "Kamu kurumlarıyla çapa kiralama.",
    image: "/images/admin/admin-hero.png",
  },
];

type ComparisonKey = "valuation" | "rent" | "yield" | "size" | "readiness" | "sustainability";

const comparisonMetrics: { key: ComparisonKey; label: string; helper?: string }[] = [
  { key: "valuation", label: "Tahmini Değerleme" },
  { key: "rent", label: "Aylık Kira Potansiyeli" },
  { key: "yield", label: "Yıllık Getiri" },
  { key: "size", label: "Kapalı Alan" },
  { key: "readiness", label: "Teslim Durumu" },
  { key: "sustainability", label: "Sürdürülebilirlik" },
];

export default function AppraisalComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["iw-appr-01", "iw-appr-02"]);
  const maxSelectable = 3;
  const selectedProperties = useMemo(
    () => sampleProperties.filter((property) => selectedIds.includes(property.id)),
    [selectedIds]
  );

  const maxReached = selectedIds.length >= maxSelectable;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= maxSelectable) {
        return prev;
      }

      return [...prev, id];
    });
  };

  return (
    <section className="py-16 md:py-20 bg-slate-950 text-white">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">İLAN KARŞILAŞTIRMA</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold">Portföy performansını yan yana görün</h2>
          <p className="mt-4 text-base md:text-lg text-white/70">
            En fazla üç portföyü seçerek değerleme, kira potansiyeli ve sürdürülebilirlik metriklerini modern tabloda karşılaştırın.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {sampleProperties.map((property) => {
              const isActive = selectedIds.includes(property.id);

              return (
                <article
                  key={property.id}
                  className={`relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
                    isActive
                      ? "border-primary-300/80 bg-white/10 shadow-[0_35px_120px_-60px_rgba(15,118,110,0.9)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={property.image}
                      alt={property.title}
                      width={480}
                      height={360}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-200">
                      <FiLayers className="h-4 w-4" />
                      {property.segment}
                    </div>
                    <h3 className="text-xl font-semibold">{property.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <FiMapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                    <p className="text-sm text-white/70">{property.highlight}</p>
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-sm">
                      <div>
                        <p className="text-white/60">Değerleme</p>
                        <p className="text-base font-semibold text-white">{property.valuation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60">Getiri</p>
                        <p className="text-base font-semibold text-emerald-300">{property.yield}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSelection(property.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "border-emerald-300 bg-emerald-500/10 text-white"
                          : maxReached
                          ? "border-white/20 text-white/60"
                          : "border-white/30 text-white hover:border-white/60"
                      }`}
                    >
                      {isActive ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"}
                    </button>
                  </div>

                  {isActive && (
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-200">
                      <FiCheckCircle className="h-4 w-4" />
                      Seçildi
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white/60">Seçilen Portföyler</p>
                <p className="mt-1 text-3xl font-bold">{selectedIds.length}/{maxSelectable}</p>
              </div>
              <div className="space-y-4">
                {selectedProperties.length === 0 ? (
                  <p className="text-sm text-white/60">Karşılaştırma için portföy seçin.</p>
                ) : (
                  selectedProperties.map((property) => (
                    <div key={property.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/60">{property.segment}</p>
                      <p className="text-base font-semibold">{property.title}</p>
                      <p className="text-sm text-white/60">{property.location}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-white/60">Değerleme</span>
                        <span className="font-semibold">{property.valuation}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <span className="text-white/60">Getiri</span>
                        <span className="font-semibold text-emerald-300">{property.yield}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <FiTrendingUp className="mt-1 h-5 w-5 text-emerald-300" />
                  <p>
                    En fazla {maxSelectable} portföy seçilebilir. Bu veriler demo niteliğindedir ve gerçek ekspertiz raporlarıyla doğrulanmalıdır.
                  </p>
                </div>
              </div>
              {maxReached && (
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Maksimum seçim sayısına ulaşıldı
                </p>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-14 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">KARŞILAŞTIRMA TABLOSU</p>
              <h3 className="text-2xl font-semibold">Metrekare bazlı içgörüleri inceleyin</h3>
            </div>
            <p className="text-white/70 text-sm">
              Karşılaştırma en az iki portföy ile daha anlamlı sonuçlar üretir.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            {selectedProperties.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center text-sm text-white/60">
                Lütfen tabloda görüntülemek için en az bir portföy seçin.
              </div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-48 pb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Ölçüt</th>
                    {selectedProperties.map((property) => (
                      <th key={property.id} className="pb-4 text-base font-semibold text-white">
                        {property.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric) => (
                    <tr key={metric.key} className="border-t border-white/10 last:border-b">
                      <td className="py-4 pr-4 text-white/70">{metric.label}</td>
                      {selectedProperties.map((property) => (
                        <td key={`${property.id}-${metric.key}`} className="py-4 pr-4 font-semibold text-white">
                          {property[metric.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
