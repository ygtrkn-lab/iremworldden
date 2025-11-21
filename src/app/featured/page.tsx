"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Property } from "@/types/property";
import { generatePropertyUrl } from "@/utils/slug";
import projectsDataset from "@/data/projects.json";
import storesDataset from "@/data/stores.json";
import "pannellum/build/pannellum.css";

type ProjectCard = {
  id: string;
  title: string;
  location: string;
  country?: string;
  type?: string;
  status?: string;
  price?: string;
  images?: string[];
};

type StoreRecord = {
  id: string;
  slug: string;
  name: string;
  featured?: boolean;
  logo?: string;
  tagline?: string;
  stats?: {
    activeListings?: number;
    totalSales?: number;
  };
  contact?: {
    city?: string;
    country?: string;
  };
};

const fallbackImage = "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=1200&q=80&auto=format&fit=crop";
const allProjects = projectsDataset as ProjectCard[];
const allStores = storesDataset as StoreRecord[];
const heroPanoramaAsset = "/uploads/properties/TR1294812/FEATURED360.jpg";
const pannellumScriptUrl = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
const featuredPanoramaSpot = {
  id: "TR1294812",
  title: "360° Yalıkavak Panorama Villası",
  location: "Yalıkavak, Bodrum",
  metrics: [
    { label: "Metrekare", value: "520 m²" },
    { label: "Hedef", value: "Ultra Lüks" },
    { label: "Görünürlük", value: "%62" },
  ],
};
const heroVisibilityStat =
  featuredPanoramaSpot.metrics.find((metric) => metric.label.toLowerCase().includes("görünürlük"))?.value ??
  featuredPanoramaSpot.metrics[0]?.value ??
  "—";


const formatPrice = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return "Fiyat için iletişime geçin";
  }

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function FeaturedPage() {
  const [premiumListings, setPremiumListings] = useState<Property[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroPanoramaRef = useRef<HTMLDivElement | null>(null);
  const [panoramaReady, setPanoramaReady] = useState(false);
  const storesById = useMemo(() => {
    const map = new Map<string, StoreRecord>();
    allStores.forEach((store) => map.set(store.id, store));
    return map;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchListings = async () => {
      try {
        setLoadingListings(true);
        setListingsError(null);

        const response = await fetch(`/api/properties-json?country=TR&type=sale&sort=recent&limit=12`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("İlanlar yüklenemedi");
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? (payload.data as Property[]) : [];

        if (!controller.signal.aborted) {
          const filtered = data.filter((property) => property.images?.length);
          setPremiumListings(filtered);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Featured listings fetch failed", error);
          setPremiumListings([]);
          setListingsError("İlanlar yüklenemedi");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingListings(false);
        }
      }
    };

    fetchListings();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (premiumListings.length && activeSpotlight >= premiumListings.length) {
      setActiveSpotlight(0);
    }
  }, [premiumListings.length, activeSpotlight]);

  useEffect(() => {
    let viewerInstance: any;
    let isMounted = true;

    const loadPannellumScript = () =>
      new Promise<typeof window.pannellum>((resolve, reject) => {
        if (typeof window === "undefined") {
          reject(new Error("Window yok"));
          return;
        }

        if (window.pannellum?.viewer) {
          resolve(window.pannellum);
          return;
        }

        const existing = document.querySelector<HTMLScriptElement>("script[data-pannellum]");
        if (existing) {
          existing.addEventListener("load", () => resolve(window.pannellum));
          existing.addEventListener("error", reject);
          return;
        }

        const script = document.createElement("script");
        script.src = pannellumScriptUrl;
        script.async = true;
        script.dataset.pannellum = "true";
        script.onload = () => resolve(window.pannellum);
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const initPanorama = async () => {
      if (!heroPanoramaRef.current) {
        return;
      }

      try {
        const pannellumGlobal = await loadPannellumScript();
        const viewerFactory = pannellumGlobal?.viewer ?? pannellumGlobal;

        if (typeof viewerFactory !== "function") {
          console.error("Pannellum viewer yüklenemedi", pannellumGlobal);
          return;
        }

        viewerInstance = viewerFactory(heroPanoramaRef.current, {
          type: "equirectangular",
          panorama: heroPanoramaAsset,
          autoLoad: true,
          autoRotate: -1.2,
          compass: false,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          backgroundColor: [255, 255, 255],
          hfov: 100,
          pitch: 0,
          yaw: 0,
        });

        if (isMounted) {
          setPanoramaReady(true);
        }
      } catch (error) {
        console.error("Pannellum script yüklenemedi", error);
      }
    };

    initPanorama();

    return () => {
      isMounted = false;
      if (viewerInstance?.destroy) {
        viewerInstance.destroy();
      } else if (heroPanoramaRef.current) {
        heroPanoramaRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(".hero-gradient-blur", {
        scale: 1.1,
        opacity: 0.95,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const heroTimeline = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "top 70%",
        },
      });

      heroTimeline
        .fromTo(
          "[data-hero-kicker]",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1 }
        )
        .fromTo(
          "[data-hero-heading]",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1 },
          "<0.05"
        )
        .fromTo(
          "[data-hero-copy]",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1 },
          "<"
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1 },
          "<"
        );

      gsap.from("[data-metric-card]", {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "top 60%",
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-fade-up]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, rotateX: -6 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax-image]").forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            scrub: true,
          },
        });
      });

      ScrollTrigger.batch("[data-section='spotlight'] [data-spotlight-panel]", {
        start: "top 80%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch as HTMLElement[],
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
          ),
      });
    }, pageRef);

    return () => ctx.revert();
  }, [premiumListings.length]);

  const premiumProjects = useMemo(() => {
    return allProjects
      .filter((project) => project.images?.length)
      .filter((project) => !project.country || project.country === "Türkiye")
      .slice(0, 3);
  }, []);

  const heroProperty = useMemo(() => premiumListings.find((property) => property.id === featuredPanoramaSpot.id), [premiumListings]);
  const heroStore = heroProperty?.storeId ? storesById.get(heroProperty.storeId) : undefined;
  const galleryProperty = useMemo(() => {
    if (!premiumListings.length) return undefined;
    const fallback = heroProperty ?? premiumListings[0];
    const alternative = premiumListings.find((property) => property.id !== heroProperty?.id);
    return alternative ?? fallback;
  }, [premiumListings, heroProperty]);
  const galleryStore = galleryProperty?.storeId ? storesById.get(galleryProperty.storeId) : undefined;
  const videoProperty = useMemo(() => {
    if (!premiumListings.length) return undefined;
    const distinct = premiumListings.find(
      (property) => property.id !== heroProperty?.id && property.id !== galleryProperty?.id
    );
    return distinct ?? galleryProperty ?? heroProperty ?? premiumListings[0];
  }, [premiumListings, heroProperty, galleryProperty]);
  const videoStore = videoProperty?.storeId ? storesById.get(videoProperty.storeId) : undefined;

  const spotlightProperty = premiumListings[activeSpotlight] ?? premiumListings[0];
  const spotlightLocationLabel = spotlightProperty
    ? [spotlightProperty.location?.district, spotlightProperty.location?.city, spotlightProperty.location?.country]
        .filter(Boolean)
        .join(", ") || "Türkiye"
    : "Türkiye genelindeki güncel ilanlar";
  const spotlightStore = spotlightProperty?.storeId ? storesById.get(spotlightProperty.storeId) : undefined;

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden pb-24 text-gray-900">
      <div className="pointer-events-none fixed inset-0 -z-10 isolate" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f6f8ff] via-[#fff7f1] to-[#f3f7ff]" />
        <div
          className="absolute inset-0 opacity-50 mix-blend-screen"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(178,208,255,0.45) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,220,194,0.6) 0, transparent 35%), radial-gradient(circle at 50% 90%, rgba(189,255,230,0.45) 0, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23c6d4ff' stroke-opacity='0.08' fill='none'%3E%3Cpath d='M0 300c60-40 120-60 180-60s120 20 180 60 120 60 180 60 120-20 180-60'/%3E%3C/g%3E%3C/svg%3E)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cpath fill='%23000' fill-opacity='.025' d='M0 159h160v1H0zM159 0h1v160h-1z'/%3E%3C/svg%3E)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP8/5+hHgAHhQJ/iYAkdAAAAABJRU5ErkJggg==)",
            backgroundSize: "200px",
            mixBlendMode: "soft-light",
          }}
        />
        <div className="hero-gradient-blur absolute left-[-8%] top-[-6%] h-[520px] w-[520px] rounded-full bg-[#cfe0ff]/45 blur-[180px]" />
        <div className="hero-gradient-blur absolute right-[-10%] top-1/4 h-[560px] w-[560px] rounded-full bg-[#ffe0d0]/40 blur-[210px]" />
        <div className="hero-gradient-blur absolute left-1/3 bottom-[-10%] h-[460px] w-[460px] rounded-full bg-[#c4ffe5]/35 blur-[180px]" />
        <div className="absolute inset-x-0 top-20 flex justify-center opacity-60">
          <div className="hero-gradient-blur h-64 w-64 rounded-full bg-white/35 blur-[180px]" />
        </div>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-40" />
        <div className="absolute inset-y-0 left-1/4 w-px -translate-x-1/4 bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-30" />
        <div className="absolute inset-0">
          <div
            className="absolute right-10 top-1/3 h-40 w-40 rounded-full bg-gradient-to-br from-white/80 via-white/20 to-transparent opacity-50 blur-[90px]"
          />
          <div
            className="absolute left-8 bottom-1/4 h-32 w-[320px] rounded-[999px] bg-gradient-to-r from-white/5 via-white/40 to-white/5 opacity-70"
            style={{ filter: "blur(12px)" }}
          />
        </div>
      </div>
      <section data-section="hero" className="relative overflow-hidden text-gray-900">
        <div className="absolute inset-0 rounded-b-[60px] border-b border-white/60 bg-gradient-to-br from-white/90 via-white/65 to-white/40 backdrop-blur-xl" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="absolute left-12 top-16 h-72 w-72 rounded-full bg-[#dce9ff]/70 blur-[150px]" />
        <div className="absolute right-0 bottom-[-60px] h-80 w-80 rounded-full bg-[#ffe7dc]/60 blur-[170px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-white/70 to-white" />
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.25) 0, transparent 45%)" }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath fill='none' stroke='%23e5edff' stroke-opacity='.4' d='M0 0h200v200H0z'/%3E%3C/svg%3E)",
              backgroundSize: "200px",
              maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0))",
            }}
          />
        </div>
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div className="order-2 space-y-6 lg:order-1">
            <span
              data-hero-kicker
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-gray-500"
            >
              360° ilan turu
            </span>
            <h1 data-hero-heading className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              {featuredPanoramaSpot.title}
            </h1>
            <p data-hero-copy className="text-lg text-gray-600">
              {featuredPanoramaSpot.location} adresindeki panoramik villayı sahnede dolaşın, planı inceleyin ve tüm fotoğraf
              setine tek noktadan erişin. 360° tur, sahil hattını ve iç mekânı aynı anda gösterir.
            </p>
            {heroStore && (
              <p className="text-sm font-semibold text-gray-500">Mağaza: {heroStore.name}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {featuredPanoramaSpot.metrics.map((metric) => (
                <div
                  key={metric.label}
                  data-metric-card
                  className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
            <div data-hero-cta className="flex flex-wrap gap-4">
              <Link
                href={heroProperty ? generatePropertyUrl(heroProperty) : "/for-sale"}
                className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/15"
              >
                {heroProperty ? "İlanı görüntüle" : "Tüm ilanları gör"}
              </Link>
              {heroStore?.slug ? (
                <Link
                  href={`/store/${heroStore.slug}`}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900"
                >
                  Mağaza profili
                </Link>
              ) : (
                <Link
                  href="/for-sale"
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900"
                >
                  Güncel portföy
                </Link>
              )}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div
              data-parallax-image
              className="relative h-[420px] rounded-[36px] border border-gray-100 bg-white p-3 shadow-[0_40px_120px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#f4f6fb]" ref={heroPanoramaRef}>
                {!panoramaReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
                    360° vitrin hazırlanıyor...
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 backdrop-blur">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{featuredPanoramaSpot.id}</p>
                  <p className="text-base font-semibold text-gray-900">{featuredPanoramaSpot.title}</p>
                  <p className="text-sm text-gray-500">{featuredPanoramaSpot.location}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{heroStore ? heroStore.name : "Vitrin ilanı"}</p>
                  <p>Görünürlük {heroVisibilityStat}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section data-section="ad-stage" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-white/60" />
        <div className="absolute left-8 top-4 h-64 w-64 rounded-full bg-[#d8f1ff]/60 blur-[140px]" />
        <div className="absolute right-0 bottom-[-60px] h-72 w-72 rounded-full bg-[#ffe3d5]/50 blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl space-y-10 px-6">
          <div data-fade-up className="max-w-xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Reklam alanı</p>
            <h2 className="text-3xl font-semibold text-gray-900">İkincil vitrin alanları</h2>
            <p className="text-gray-500">
              Featured sayfasının bu katmanı, pricing anlaşması aktif mağazalara ayrılmış iki reklam yüzü içerir. Her alan canlı
              ilanı, mağaza etiketini ve konum brief'ini birlikte gösterir.
            </p>
            <p className="text-sm text-gray-500">
              Güncel içerik doğrudan yayındaki sponsorlardan çekilir; manuel görsel yüklemek gerekmez.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article data-fade-up className="gsap-card rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Galeri alanı</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Premium grid örneği</h3>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">3 kart</span>
              </div>
              {galleryProperty ? (
                <div className="mt-6 space-y-4">
                  <div data-parallax-image className="relative h-48 overflow-hidden rounded-[26px]">
                    <Image
                      src={(galleryProperty.images && galleryProperty.images[0]) || fallbackImage}
                      alt={galleryProperty.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 40vw"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700">
                      {galleryProperty.category?.main ?? "Karma"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">#{galleryProperty.id}</p>
                    <h4 className="mt-2 text-xl font-semibold text-gray-900">{galleryProperty.title}</h4>
                    <p className="text-sm text-gray-500">
                      {galleryProperty.location?.district}, {galleryProperty.location?.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                      {galleryStore?.logo ? (
                        <Image
                          src={galleryStore.logo}
                          alt={galleryStore.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">
                          {galleryStore?.name?.slice(0, 2)?.toUpperCase() ?? "IW"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{galleryStore?.name ?? "Mağaza güncelleniyor"}</p>
                      <p className="text-xs text-gray-500">{galleryStore?.contact?.city ?? galleryProperty.location?.city ?? "Türkiye"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{galleryProperty.specs?.rooms ?? "—"} oda</span>
                    <span>{galleryProperty.specs?.netSize ?? "—"} m²</span>
                    <span>{formatPrice(galleryProperty.price)}</span>
                  </div>
                  <Link
                    href={generatePropertyUrl(galleryProperty)}
                    className="inline-flex items-center text-sm font-semibold text-gray-900"
                  >
                    İlanı aç →
                  </Link>
                </div>
              ) : (
                <div className="mt-6 rounded-[26px] border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center text-sm text-gray-500">
                  Galeri örneği yükleniyor.
                </div>
              )}
            </article>

            <article data-fade-up className="gsap-card rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Video alanı</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Hikâye anlatımı</h3>
                </div>
                <span className="rounded-full bg-gray-900/10 px-3 py-1 text-xs font-semibold text-gray-900">1 alan</span>
              </div>
              {videoProperty ? (
                <div className="mt-6 space-y-4">
                  <div data-parallax-image className="relative h-48 overflow-hidden rounded-[26px]">
                    <Image
                      src={(videoProperty.images && videoProperty.images[0]) || fallbackImage}
                      alt={videoProperty.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 40vw"
                    />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                      Video anlatım örneği
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">#{videoProperty.id}</p>
                    <h4 className="mt-2 text-xl font-semibold text-gray-900">{videoProperty.title}</h4>
                    <p className="text-sm text-gray-500">
                      {videoProperty.location?.district}, {videoProperty.location?.city}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 text-sm text-gray-600">
                    {videoStore?.name ?? "Mağaza güncelleniyor"} mağazası video alanında proje hikâyesini anlatır. Alan haftalık olarak
                    değişir ve ölçülen izleme süresi raporlanır.
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{videoProperty.specs?.rooms ?? "—"} oda</span>
                    <span>{videoProperty.specs?.netSize ?? "—"} m²</span>
                    <span>{formatPrice(videoProperty.price)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={generatePropertyUrl(videoProperty)}
                      className="inline-flex items-center rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white"
                    >
                      İlanı izle
                    </Link>
                    {videoStore?.slug && (
                      <Link
                        href={`/store/${videoStore.slug}`}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-900"
                      >
                        Mağaza profili
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[26px] border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center text-sm text-gray-500">
                  Video örneği yükleniyor.
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <section data-section="grid" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <div data-fade-up className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">İlan akışı</p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">Anlaşması aktif vitrin ilanları</h2>
            <p className="mt-3 max-w-2xl text-gray-500">
              Pricing sürecini tamamlamış mağazaların sponsorlu ilanları bu gridde yayınlanıyor. Şehir, kategori ve
              mağaza bilgileri her kartta yer alıyor.
            </p>
          </div>
          <Link href="/for-sale" className="text-sm font-semibold text-gray-900">
            Tüm ilanları görüntüle →
          </Link>
        </div>

        <div className="mt-10">
          {loadingListings ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 p-10 text-center text-gray-600">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-900/20 border-t-gray-900" />
              <p className="mt-4 text-sm font-semibold">İlanlar yükleniyor...</p>
            </div>
          ) : premiumListings.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 p-10 text-center text-gray-600">
              <p className="text-sm font-semibold">{listingsError ?? "Şu anda öne çıkan ilan bulunmuyor."}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {premiumListings.slice(0, 9).map((property) => {
                const store = property.storeId ? storesById.get(property.storeId) : undefined;

                return (
                  <Link key={property.id} href={generatePropertyUrl(property)}>
                    <article
                      data-card
                      className="gsap-card group relative h-full overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-white/95 via-white/70 to-[#f6f8ff] p-5 shadow-[0_25px_70px_rgba(15,23,42,0.06)] transition duration-500 hover:-translate-y-2 hover:border-white/90 hover:shadow-[0_35px_90px_rgba(15,23,42,0.14)]"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden="true">
                        <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-[#e4f1ff]/60 blur-[80px]" />
                        <div className="absolute -right-6 bottom-14 h-40 w-40 rounded-full bg-[#ffe2d3]/50 blur-[90px]" />
                      </div>

                      <div className="relative flex flex-col">
                        <div
                          data-parallax-image
                          className="relative h-56 overflow-hidden rounded-[28px] border border-white/60 bg-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                        >
                          <Image
                            src={(property.images && property.images[0]) || fallbackImage}
                            alt={property.title}
                            fill
                            className="object-cover transition duration-700 group-hover:scale-105"
                            sizes="(max-width:768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" aria-hidden="true" />
                          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                            Sponsorlu vitrin
                          </div>
                          <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                            {property.specs?.netSize ? `${property.specs.netSize} m²` : "Özel alan"}
                          </div>
                          <div className="absolute -bottom-6 left-6 right-6">
                            <div className="rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-xs font-semibold text-gray-600 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-800">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                                  {property.specs?.rooms ?? "—"} oda
                                </span>
                                <span className="text-gray-500">{property.specs?.bathrooms ?? 0} banyo</span>
                                <span className="text-gray-500">{property.location?.country ?? "Türkiye"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between gap-5 pt-10">
                          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                            <span>#{property.id}</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 tracking-[0.15em] text-gray-600">
                              {property.category?.main || "Karma"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900 transition group-hover:text-gray-700">
                              {property.title}
                            </h3>
                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" aria-hidden="true" />
                              {property.location?.district}, {property.location?.city}
                            </p>
                          </div>

                          <div className="rounded-[28px] border border-white/70 bg-white/85 p-3 shadow-sm shadow-gray-900/5 backdrop-blur">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                                {store?.logo ? (
                                  <Image
                                    src={store.logo}
                                    alt={store.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-semibold text-gray-600">
                                    {store?.name?.slice(0, 2)?.toUpperCase() ?? "IW"}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                  {store?.name ?? "Mağaza bilgisi güncelleniyor"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {store?.contact?.city ?? property.location?.city ?? "Türkiye"}
                                </p>
                              </div>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
                                Premium
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-semibold text-gray-900">{formatPrice(property.price)}</p>
                            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                              Detaylı bak
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {spotlightProperty && (
        <section data-section="spotlight" className="mx-auto mt-24 w-full max-w-6xl px-6">
          <div data-spotlight-panel className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Spotlight sahnesi</p>
                <h2 className="mt-4 text-3xl font-semibold text-gray-900">Şu an öne çıkarılan ilan</h2>
                <p className="mt-4 max-w-xl text-gray-500">
                  Pricing anlaşması aktif mağazalar spotlight alanını dönüşümlü kullanıyor. Şehir rozetleri arasından seçim yaparak
                  hangi vitrinin sahnede olduğunu görebilirsiniz.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {premiumListings.slice(0, 5).map((property, index) => (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => setActiveSpotlight(index)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        index === activeSpotlight
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {property.location?.city}
                    </button>
                  ))}
                </div>

                <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Lokasyon</dt>
                    <dd className="mt-2 text-base font-semibold text-gray-900">
                      {spotlightLocationLabel}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Metrekare</dt>
                    <dd className="mt-2 text-base font-semibold text-gray-900">
                      {spotlightProperty.specs?.netSize} m²
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Yatırım</dt>
                    <dd className="mt-2 text-base font-semibold text-gray-900">
                      {formatPrice(spotlightProperty.price)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-6 text-sm text-gray-500">
                  Mağaza: <span className="font-semibold text-gray-900">{spotlightStore?.name ?? "Güncel vitrin"}</span>
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={generatePropertyUrl(spotlightProperty)}
                    className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
                  >
                    İlanı görüntüle
                  </Link>
                  {spotlightStore?.slug && (
                    <Link
                      href={`/store/${spotlightStore.slug}`}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900"
                    >
                      Mağazayı aç
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="relative h-96 overflow-hidden rounded-[32px] border border-gray-100 bg-gray-100">
                  <Image
                    src={(spotlightProperty.images && spotlightProperty.images[0]) || fallbackImage}
                    alt={spotlightProperty.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                  <div className="absolute top-6 left-6 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-gray-600">
                    Spotlight ilanı
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <section data-section="projects" className="mx-auto mt-24 w-full max-w-6xl px-6">
        <div data-fade-up className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Seçili projeler</p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">Editoryal proje seçkisi</h2>
            <p className="mt-3 max-w-2xl text-gray-500">
              Sponsor mağazaların uzun soluklu projeleri ayrı bir galeride tutuluyor. Her kartta proje statüsü, ülke ve
              yatırım bilgisi listeleniyor.
            </p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-gray-900">
            Tüm projeleri incele →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {premiumProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <article data-card className="gsap-card h-full rounded-[32px] border border-gray-100 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div data-parallax-image className="relative h-56 overflow-hidden rounded-3xl">
                  <Image
                    src={(project.images && project.images[0]) || fallbackImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700">
                    {project.status}
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white">
                    {project.type}
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">#{project.id}</p>
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{project.country}</span>
                    <span className="text-base font-semibold text-gray-900">{project.price ?? "Fiyatı sor"}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section data-fade-up className="mx-auto mt-24 w-full max-w-5xl rounded-[40px] border border-gray-100 bg-white px-8 py-12 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Yayın notu</p>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">Vitrin yalnızca pricing anlaşmasıyla açılır</h2>
        <p className="mt-4 text-gray-500">
          Featured alanı, pricing sayfasından anlaşmasını tamamlayan mağazaların sponsorlu ilanlarını sergiler. Detaylı paket
          ve koşulları görmek için aşağıdaki bağlantıyı kullanabilirsiniz.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Pricing sayfasına git
          </Link>
        </div>
      </section>
    </div>
  );
}
