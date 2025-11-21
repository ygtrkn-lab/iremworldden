"use client";

import Link from "next/link";
import { Property } from "@/types/property";
import { formatLocation } from "@/lib/client-utils";

interface PropertyHeroProps {
  property: Property;
  type: "sale" | "rent";
}

const statusTextMap: Record<Property["status"], string> = {
  active: "Aktif İlan",
  passive: "Pasif",
  sold: "Satıldı",
  rented: "Kiralandı",
};

const statusClassMap: Record<Property["status"], string> = {
  active: "border-white/15 bg-white/10 text-white",
  passive: "border-white/10 bg-white/5 text-white/70",
  sold: "border-orange-300/30 bg-orange-500/20 text-orange-100",
  rented: "border-emerald-300/30 bg-emerald-500/20 text-emerald-100",
};

export default function PropertyHero({ property, type }: PropertyHeroProps) {
  const typeLabel = type === "sale" ? "Satılık" : "Kiralık";
  const statusLabel = statusTextMap[property.status] ?? "Güncel";
  const statusClassName = statusClassMap[property.status] ?? "border-white/15 bg-white/10 text-white";
  const priceLabel = property.price.toLocaleString("tr-TR");
  const heroDescription = property.description && property.description.length > 260
    ? `${property.description.slice(0, 260)}…`
    : property.description;

  const highlightStats: Array<{ label: string; value: string }> = [];

  if (property.specs?.rooms) {
    highlightStats.push({ label: "Oda Planı", value: property.specs.rooms });
  }

  if (typeof property.specs?.netSize === "number") {
    highlightStats.push({
      label: "Net Alan",
      value: `${property.specs.netSize.toLocaleString("tr-TR")} m²`,
    });
  }

  if (typeof property.specs?.bathrooms === "number") {
    highlightStats.push({
      label: "Banyo",
      value: property.specs.bathrooms.toString(),
    });
  }

  if (property.specs?.heating) {
    highlightStats.push({ label: "Isıtma", value: property.specs.heating });
  }

  if (highlightStats.length < 4 && typeof property.specs?.grossSize === "number") {
    highlightStats.push({
      label: "Brüt Alan",
      value: `${property.specs.grossSize.toLocaleString("tr-TR")} m²`,
    });
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white pt-24 pb-28 md:pt-28 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <nav className="mb-10 text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-white">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <Link
                href={`/${type === "sale" ? "satilik" : "kiralik"}`}
                className="transition hover:text-white"
              >
                {typeLabel}
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li className="text-white/80">{property.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em]">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-white/80">
                {typeLabel} • {property.category.main}
              </span>
              <span className={`rounded-full border px-4 py-1 text-xs ${statusClassName}`}>
                {statusLabel}
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              {property.title}
            </h1>

            {heroDescription && (
              <p className="text-base leading-relaxed text-white/70 md:text-lg">
                {heroDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {formatLocation(property.location)}
              </span>
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {property.category.main} • {property.category.sub}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${type === "sale" ? "satilik" : "kiralik"}`}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/20"
              >
                Benzer {typeLabel} İlanlar
              </Link>
              <a
                href="#property-content"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Detayları Keşfet
              </a>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
              Fiyat
            </p>
            <p className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {priceLabel} ₺
              {type === "rent" && <span className="ml-1 text-base text-white/60">/ay</span>}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${property.agent.phone}`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Hemen Ara
              </a>
              <a
                href={`mailto:${property.agent.email}`}
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
              >
                E-posta Gönder
              </a>
            </div>
            <div className="mt-6 text-xs uppercase tracking-[0.25em] text-white/50">
              {property.agent.company ?? "IW Management"}
            </div>
            <div className="mt-2 text-sm text-white/80">{property.agent.name}</div>
          </div>
        </div>

        {highlightStats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {highlightStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
