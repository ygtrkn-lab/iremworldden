"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Property, PropertyType } from "@/types/property";
import { Store } from '@/types/store';
import { generatePropertyBreadcrumbs, generateBreadcrumbSchema } from "@/lib/seo-utils";
import jsPDF from "jspdf";

type InteriorBooleanKey = Exclude<keyof Property["interiorFeatures"], "kitchenType">;
type ExteriorBooleanKey = Exclude<keyof Property["exteriorFeatures"], "facade">;
type BuildingBooleanKey = keyof Property["buildingFeatures"];
type PropertyDetailFlagKey =
  | "isSettlement"
  | "creditEligible"
  | "exchangeAvailable"
  | "inSite"
  | "hasDebt"
  | "isRentGuaranteed"
  | "isNewBuilding"
  | "isSuitableForOffice"
  | "hasBusinessLicense";

const INTERIOR_FEATURE_LABELS: Array<{ key: InteriorBooleanKey; label: string }> = [
  { key: "hasBuiltInKitchen", label: "Ankastre mutfak" },
  { key: "hasBuiltInWardrobe", label: "Gömme dolap" },
  { key: "hasLaminate", label: "Laminat zemin" },
  { key: "hasParquet", label: "Parke zemin" },
  { key: "hasCeramic", label: "Seramik kaplama" },
  { key: "hasMarble", label: "Mermer detaylar" },
  { key: "hasWallpaper", label: "Duvar kağıdı" },
  { key: "hasPaintedWalls", label: "Boyalı duvarlar" },
  { key: "hasSpotLighting", label: "Spot aydınlatma" },
  { key: "hasHiltonBathroom", label: "Hilton banyo" },
  { key: "hasJacuzzi", label: "Jakuzi" },
  { key: "hasShowerCabin", label: "Duşakabin" },
  { key: "hasAmericanDoor", label: "Amerikan kapı" },
  { key: "hasSteelDoor", label: "Çelik kapı" },
  { key: "hasIntercom", label: "Görüntülü diafon" }
];

const EXTERIOR_FEATURE_LABELS: Array<{ key: ExteriorBooleanKey; label: string }> = [
  { key: "hasBalcony", label: "Geniş balkon" },
  { key: "hasTerrace", label: "Teras" },
  { key: "hasGarden", label: "Bahçe" },
  { key: "hasGardenUse", label: "Bahçe kullanım hakkı" },
  { key: "hasSeaView", label: "Deniz manzarası" },
  { key: "hasCityView", label: "Şehir manzarası" },
  { key: "hasNatureView", label: "Doğa manzarası" },
  { key: "hasPoolView", label: "Havuz manzarası" }
];

const BUILDING_AMENITY_LABELS: Array<{ key: BuildingBooleanKey; label: string }> = [
  { key: "hasPool", label: "Yüzme havuzu" },
  { key: "hasGym", label: "Fitness alanı" },
  { key: "hasSauna", label: "Sauna" },
  { key: "hasTurkishBath", label: "Türk hamamı" },
  { key: "hasPlayground", label: "Çocuk oyun alanı" },
  { key: "hasBasketballCourt", label: "Basketbol sahası" },
  { key: "hasTennisCourt", label: "Tenis kortu" },
  { key: "hasSecurity", label: "Güvenlik" },
  { key: "has24HourSecurity", label: "7/24 güvenlik" },
  { key: "hasConcierge", label: "Resepsiyon" }
];

const BUILDING_TECH_LABELS: Array<{ key: BuildingBooleanKey; label: string }> = [
  { key: "hasElevator", label: "Asansör" },
  { key: "hasCarPark", label: "Otopark" },
  { key: "hasClosedCarPark", label: "Kapalı otopark" },
  { key: "hasOpenCarPark", label: "Açık otopark" },
  { key: "hasCameraSystem", label: "Kamera sistemi" },
  { key: "hasGenerator", label: "Jeneratör" },
  { key: "hasFireEscape", label: "Yangın merdiveni" },
  { key: "hasFireDetector", label: "Yangın algılama" },
  { key: "hasWaterBooster", label: "Su deposu" },
  { key: "hasSatelliteSystem", label: "Uydu sistemi" },
  { key: "hasWifi", label: "Kablosuz internet" }
];

const PROPERTY_DETAIL_FLAGS: Array<{ key: PropertyDetailFlagKey; label: string; affirmLabel?: string }> = [
  { key: "isSettlement", label: "İskan" },
  { key: "creditEligible", label: "Krediye uygun" },
  { key: "exchangeAvailable", label: "Takas" },
  { key: "inSite", label: "Site içi" },
  { key: "hasDebt", label: "Borç", affirmLabel: "Borç bulunmuyor" },
  { key: "isRentGuaranteed", label: "Kira garantisi" },
  { key: "isNewBuilding", label: "Yeni bina" },
  { key: "isSuitableForOffice", label: "Ofise uygun" },
  { key: "hasBusinessLicense", label: "İşyeri ruhsatı" }
];

interface PropertyDetailIremProps {
  property: Property;
  type: PropertyType;
  backHref?: string;
  backLabel?: string;
}

const SHARE_ICONS = {
  whatsapp: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  sms: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.22 0-2.39-.213-3.45-.6L3 21l1.043-3.129C3.377 16.815 3 14.961 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
};

export default function PropertyDetailIrem({ property, type, backHref, backLabel }: PropertyDetailIremProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [store, setStore] = useState<Store | null>(null);

  const images = property.images ?? [];
  const totalImages = images.length;
  const hasImages = totalImages > 0;

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("tr-TR", {
        maximumFractionDigits: 0
      }),
    []
  );

  const locationParts = useMemo(
    () =>
      [
        property.location?.neighborhood,
        property.location?.district,
        property.location?.city,
        property.location?.country
      ].filter(Boolean),
    [property.location]
  );

  const locationText = useMemo(() => locationParts.join(", "), [locationParts]);

  const typeLabel = type === "sale" ? "Satılık" : "Kiralık";
  const backLink = backHref ?? (type === "sale" ? "/satilik" : "/kiralik");
  const backLinkLabel = backLabel ?? `${typeLabel} ilanları`;

  const statusLabel = useMemo(() => {
    switch (property.status) {
      case "active":
        return "Yayında";
      case "passive":
        return "Pasif";
      case "sold":
        return "Satıldı";
      case "rented":
        return "Kiralandı";
      default:
        return "Güncel";
    }
  }, [property.status]);

  const formattedPrice = useMemo(() => {
    if (property.price == null) {
      return "Fiyat bilgisi";
    }

    return `₺${priceFormatter.format(property.price)}`;
  }, [priceFormatter, property.price]);

  const heroSummary = useMemo(() => {
    const sanitized = (property.description ?? "").replace(/\s+/g, " ").trim();
    if (!sanitized) {
      return "İlan portföyümüzde öne çıkan niteliklere sahip.";
    }

    const sentences = sanitized.split(/\.\s+/);
    if (sentences.length === 0) {
      return sanitized;
    }

    const summary = sentences.slice(0, 2).join(". ");
    return sentences.length > 2 ? `${summary}.` : summary;
  }, [property.description]);

  const heroStats = useMemo(
    () => [
      {
        label: "Fiyat",
        value: formattedPrice,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 6v1m0 10v1m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        label: "Oda",
        value: property.specs?.rooms ?? "Belirtilmemiş",
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l9-4 9 4-9 4-9-4zm0 6l9-4 9 4-9 4-9-4zm0 6l9-4 9 4" />
          </svg>
        )
      },
      {
        label: "Net Alan",
        value: property.specs?.netSize ? `${property.specs.netSize} m²` : "Belirtilmemiş",
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2h-2.5M6 5H3a2 2 0 00-2 2v12a2 2 0 002 2h3" />
          </svg>
        )
      },
      {
        label: "Görsel",
        value: hasImages ? `${totalImages}+` : "Yakında",
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12l6 7-6 7H3V5zm4 6.5l2.25 3 1.75-2 2.25 3H7v-4z" />
          </svg>
        )
      }
    ],
    [formattedPrice, hasImages, property.specs?.netSize, property.specs?.rooms, totalImages]
  );

  const essentials = useMemo(
    () => [
      {
        label: "Lokasyon",
        value: locationText || property.location?.city || "Bilgi bekleniyor",
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c-4 0-7 2-7 4v3h14v-3c0-2-3-4-7-4z" />
          </svg>
        )
      },
      {
        label: "Kategori",
        value: [property.category?.main, property.category?.sub].filter(Boolean).join(" / ") || typeLabel,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7l8-4 8 4-8 4-8-4zm0 5l8-4 8 4-8 4-8-4zm0 5l8-4 8 4" />
          </svg>
        )
      },
      {
        label: "Durum",
        value: property.propertyDetails?.usageStatus ?? statusLabel,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      {
        label: "Güncelleme",
        value: property.updatedAt ?? property.createdAt ?? "Güncel",
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    ],
    [locationText, property.category?.main, property.category?.sub, property.createdAt, property.propertyDetails?.usageStatus, property.updatedAt, statusLabel, typeLabel]
  );

  const interiorFeatures = useMemo(() => {
    if (!property.interiorFeatures) {
      return [] as string[];
    }

    const items = new Set<string>();

    if (property.interiorFeatures.kitchenType) {
      items.add(`${property.interiorFeatures.kitchenType} mutfak`);
    }

    INTERIOR_FEATURE_LABELS.forEach(({ key, label }) => {
      if (property.interiorFeatures?.[key]) {
        items.add(label);
      }
    });

    return Array.from(items);
  }, [property.interiorFeatures]);

  const exteriorFeatures = useMemo(() => {
    if (!property.exteriorFeatures) {
      return [] as string[];
    }

    const items = new Set<string>();

    EXTERIOR_FEATURE_LABELS.forEach(({ key, label }) => {
      if (property.exteriorFeatures?.[key]) {
        items.add(label);
      }
    });

    if (property.exteriorFeatures?.facade) {
      items.add(`${property.exteriorFeatures.facade} cephe`);
    }

    return Array.from(items);
  }, [property.exteriorFeatures]);

  const buildingAmenities = useMemo(() => {
    if (!property.buildingFeatures) {
      return [] as string[];
    }

    const items = new Set<string>();

    BUILDING_AMENITY_LABELS.forEach(({ key, label }) => {
      if (property.buildingFeatures?.[key]) {
        items.add(label);
      }
    });

    return Array.from(items);
  }, [property.buildingFeatures]);

  const technicalFeatures = useMemo(() => {
    if (!property.buildingFeatures) {
      return [...interiorFeatures, ...exteriorFeatures];
    }

    const items = new Set<string>([...interiorFeatures, ...exteriorFeatures]);

    BUILDING_TECH_LABELS.forEach(({ key, label }) => {
      if (property.buildingFeatures?.[key]) {
        items.add(label);
      }
    });

    return Array.from(items);
  }, [exteriorFeatures, interiorFeatures, property.buildingFeatures]);

  const detailHighlights = useMemo(() => {
    const highlights = new Set<string>();

    if (property.propertyDetails?.usageStatus) {
      highlights.add(`Kullanım durumu: ${property.propertyDetails.usageStatus}`);
    }

    if (property.propertyDetails?.deedStatus) {
      highlights.add(`Tapu durumu: ${property.propertyDetails.deedStatus}`);
    }

    if (property.propertyDetails?.fromWho) {
      highlights.add(`İlan sahibi: ${property.propertyDetails.fromWho}`);
    }

    PROPERTY_DETAIL_FLAGS.forEach(({ key, label, affirmLabel }) => {
      const value = property.propertyDetails?.[key];
      if (value === undefined || value === null) {
        return;
      }

      if (key === "hasDebt") {
        if (value === false) {
          highlights.add(affirmLabel ?? label);
        }
        if (value === true && property.propertyDetails?.debtAmount) {
          highlights.add(`${label}: ${property.propertyDetails.debtAmount} ₺`);
        }
        return;
      }

      if (value) {
        highlights.add(label);
      }
    });

    if (property.propertyDetails?.monthlyFee) {
      highlights.add(`Aidat: ${priceFormatter.format(property.propertyDetails.monthlyFee)} ₺`);
    }

    if (property.propertyDetails?.rentGuaranteeAmount) {
      highlights.add(`Kira garantisi: ${priceFormatter.format(property.propertyDetails.rentGuaranteeAmount)} ₺`);
    }

    if (property.specs?.grossSize) {
      highlights.add(`Brüt alan: ${property.specs.grossSize} m²`);
    }

    if (property.specs?.bathrooms != null) {
      highlights.add(`Banyo: ${property.specs.bathrooms}`);
    }

    if (property.specs?.age != null) {
      highlights.add(`Bina yaşı: ${property.specs.age}`);
    }

    if (property.specs?.floor != null && property.specs?.totalFloors != null) {
      highlights.add(`Kat bilgisi: ${property.specs.floor}. kat / ${property.specs.totalFloors}`);
    } else if (property.specs?.floor != null) {
      highlights.add(`Bulunduğu kat: ${property.specs.floor}`);
    }

    if (property.specs?.heating) {
      highlights.add(`Isıtma: ${property.specs.heating}`);
    }

    if (property.specs?.furnishing) {
      highlights.add(`Eşya durumu: ${property.specs.furnishing}`);
    }

    if (property.propertyDetails?.creditEligible === false) {
      highlights.add("Krediye uygun değil");
    }

    return Array.from(highlights);
  }, [priceFormatter, property.propertyDetails, property.specs]);

  const mapEmbedUrl = useMemo(() => {
    const coords = property.location?.coordinates;
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
    
    if (coords?.lat && coords?.lng) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coords.lat},${coords.lng}&zoom=15`;
    }

    if (locationText) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(locationText)}`;
    }

    return "";
  }, [locationText, property.location?.coordinates]);

  const mapExternalUrl = useMemo(() => {
    const coords = property.location?.coordinates;
    if (coords?.lat && coords?.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    }

    if (locationText) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;
    }

    return "https://www.google.com/maps";
  }, [locationText, property.location?.coordinates]);

  const handleNext = useCallback(() => {
    if (totalImages < 2) {
      return;
    }

    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    if (totalImages < 2) {
      return;
    }

    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  useEffect(() => {
        if (!property?.storeId) return;
        const fetchStore = async () => {
          try {
            const res = await fetch('/api/stores');
            const json = await res.json();
            if (json.success) {
              const found = (json.data as Store[]).find(s => s.id === property.storeId);
              if (found) setStore(found);
            }
          } catch (err) {
            // ignore
          }
        };
        fetchStore();
    setCurrentImageIndex(0);
  }, [property.id]);

  useEffect(() => {
    if (totalImages <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [totalImages]);

  useEffect(() => {
    if (!isImageModalOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageModalOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev, isImageModalOpen]);

  const shareProperty = useCallback(
    (platform: "whatsapp" | "instagram" | "sms") => {
      if (typeof window === "undefined") {
        return;
      }

      const url = window.location.href;
      const text = `${property.title} - ${locationText || property.location?.city || "İlan"}`;

      switch (platform) {
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        case "instagram":
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(url).then(() => {
              alert("Link panoya kopyalandı. Instagram'da paylaşabilirsiniz.");
            });
          }
          break;
        case "sms":
          window.open(`sms:?body=${encodeURIComponent(`${text} ${url}`)}`);
          break;
      }
    },
    [locationText, property.location?.city, property.title]
  );

  const normalizeTurkish = useCallback((text: string): string => {
    return text
      .replace(/İ/g, "I")
      .replace(/ı/g, "i")
      .replace(/Ğ/g, "G")
      .replace(/ğ/g, "g")
      .replace(/Ü/g, "U")
      .replace(/ü/g, "u")
      .replace(/Ş/g, "S")
      .replace(/ş/g, "s")
      .replace(/Ö/g, "O")
      .replace(/ö/g, "o")
      .replace(/Ç/g, "C")
      .replace(/ç/g, "c");
  }, []);

  const handleExportPDF = useCallback(async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // ============ SAYFA 1: MODERN HERO + MİNİMAL TASARIM ============
    let yPos = 0;

    // Full-bleed Hero Image
    if (hasImages) {
      try {
        const heroImg = document.createElement('img');
        heroImg.crossOrigin = "anonymous";
        heroImg.src = images[0];
        
        await new Promise((resolve, reject) => {
          heroImg.onload = resolve;
          heroImg.onerror = reject;
          setTimeout(reject, 3000);
        });

        if (heroImg.complete && heroImg.naturalHeight !== 0) {
          const heroHeight = 140;
          doc.addImage(heroImg, "JPEG", 0, 0, pageWidth, heroHeight, undefined, 'FAST');
          
          // Subtle gradient overlay - modern & minimal
          doc.setFillColor(0, 0, 0);
          doc.setGState(doc.GState({ opacity: 0.15 }));
          doc.rect(0, 0, pageWidth, heroHeight, 'F');
          doc.setGState(doc.GState({ opacity: 1.0 }));
          
          yPos = heroHeight;
        }
      } catch (error) {
        yPos = margin;
      }
    } else {
      yPos = margin;
    }

    // Floating white card overlay - Apple style
    const cardMargin = 15;
    const overlayCardY = yPos - 60;
    const cardHeight = 85;
    
    // Card shadow effect
    doc.setFillColor(0, 0, 0);
    doc.setGState(doc.GState({ opacity: 0.08 }));
    doc.roundedRect(cardMargin + 1, overlayCardY + 1, pageWidth - 2 * cardMargin, cardHeight, 8, 8, 'F');
    doc.setGState(doc.GState({ opacity: 1.0 }));
    
    // White card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardMargin, overlayCardY, pageWidth - 2 * cardMargin, cardHeight, 8, 8, 'F');

    // Logo - minimal, top left in card
    try {
      const logoImg = document.createElement('img');
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/pdflogo/logo.png";
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        setTimeout(reject, 2000);
      });
      doc.addImage(logoImg, "PNG", cardMargin + 8, overlayCardY + 3, 66, 15);
    } catch {}

    // Property ID - minimal badge top right
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(pageWidth - cardMargin - 35, overlayCardY + 8, 27, 9, 4, 4, 'F');
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(normalizeTurkish(`#${property.id}`), pageWidth - cardMargin - 21.5, overlayCardY + 13.5, { align: "center" });

    // Title - large, bold, minimal
    const titleY = overlayCardY + 28;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 15, 15);
    const titleLines = doc.splitTextToSize(normalizeTurkish(property.title), contentWidth - 16);
    doc.text(titleLines.slice(0, 2), cardMargin + 8, titleY);

    // Location - subtle, under title
    const locY = titleY + (titleLines.length * 7) + 3;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text(normalizeTurkish(locationText || property.location?.city || ""), cardMargin + 8, locY);

    // Price - accent color, prominent
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(247, 127, 56);
    doc.text(normalizeTurkish(formattedPrice), cardMargin + 8, locY + 10);

    // Type badge - minimal pill
    doc.setFillColor(247, 127, 56);
    doc.setGState(doc.GState({ opacity: 0.1 }));
    doc.roundedRect(cardMargin + 8, locY + 14, 30, 7, 3.5, 3.5, 'F');
    doc.setGState(doc.GState({ opacity: 1.0 }));
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(247, 127, 56);
    doc.text(normalizeTurkish(typeLabel.toUpperCase()), cardMargin + 23, locY + 18.5, { align: "center" });

    yPos = yPos + 35;

    // Specs Grid - Clean cards with icons
    if (property.specs) {
      const specs = [
        { icon: "■", label: "Oda Sayisi", value: property.specs.rooms || "-" },
        { icon: "●", label: "Banyo", value: property.specs.bathrooms || "-" },
        { icon: "▢", label: "Metrekare", value: (property.specs.netSize || property.specs.grossSize) ? `${property.specs.netSize || property.specs.grossSize} m²` : "-" },
        { icon: "↕", label: "Kat", value: property.specs.floor || "-" }
      ];

      const specCardWidth = (contentWidth - 12) / 4;
      const specCardHeight = 26;
      
      specs.forEach((spec, idx) => {
        const xPos = margin + (idx * (specCardWidth + 4));
        
        // Card background
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(xPos, yPos, specCardWidth, specCardHeight, 4, 4, 'F');
        
        // Icon
        doc.setFontSize(14);
        doc.setTextColor(247, 127, 56);
        doc.text(spec.icon, xPos + specCardWidth / 2, yPos + 10, { align: "center" });
        
        // Value
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(String(spec.value), xPos + specCardWidth / 2, yPos + 17, { align: "center" });
        
        // Label
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 140, 140);
        doc.text(normalizeTurkish(spec.label.toUpperCase()), xPos + specCardWidth / 2, yPos + 22, { align: "center" });
      });
      
      yPos += specCardHeight + 15;
    }

    // Description - Modern card
    if (property.description) {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin + 10;
      }

      // Section title
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(normalizeTurkish("Aciklama"), margin, yPos);
      yPos += 10;

      // Calculate description card height
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setLineHeightFactor(1.7);
      const descLines = doc.splitTextToSize(normalizeTurkish(property.description), contentWidth - 16);
      const cardHeight = Math.min(descLines.length * 5 + 12, 80); // Max 80mm height

      // Card shadow
      doc.setFillColor(0, 0, 0);
      doc.setGState(doc.GState({ opacity: 0.05 }));
      doc.roundedRect(margin + 1, yPos + 1, contentWidth, cardHeight, 6, 6, 'F');
      doc.setGState(doc.GState({ opacity: 1.0 }));

      // Card background
      doc.setFillColor(252, 252, 252);
      doc.roundedRect(margin, yPos, contentWidth, cardHeight, 6, 6, 'F');

      // Description text inside card
      doc.setTextColor(70, 70, 70);
      let textY = yPos + 8;
      descLines.forEach((line: string, idx: number) => {
        if (idx < 14) { // Limit lines to fit in card
          doc.text(line, margin + 8, textY);
          textY += 5;
        }
      });

      yPos += cardHeight + 8;
    }

    // Minimal footer
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text(
      normalizeTurkish("IREM WORLD"),
      margin,
      pageHeight - 12
    );
    doc.text(
      normalizeTurkish(new Date().toLocaleDateString("tr-TR")),
      pageWidth - margin,
      pageHeight - 12,
      { align: "right" }
    );

    // ============ SAYFA 2: MODERN DETAYLAR ============
    doc.addPage();
    yPos = margin;

    // Minimal header
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text(normalizeTurkish("ILAN DETAYLARI"), margin, yPos + 3);
    
    // Logo - small, subtle
    try {
      const logoImg = document.createElement('img');
      logoImg.src = "/images/logos/irem-logo.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });
      doc.addImage(logoImg, "PNG", pageWidth - margin - 35, yPos - 2, 35, 10.5);
    } catch {}

    yPos += 15;

    // Title - clean
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    const detailTitle = doc.splitTextToSize(normalizeTurkish(property.title), contentWidth);
    doc.text(detailTitle.slice(0, 2), margin, yPos);
    yPos += (detailTitle.slice(0, 2).length * 6) + 8;

    // Thin divider
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 12;

    // Info cards - modern grid
    const infoCards = [
      { label: "Fiyat", value: formattedPrice, color: [247, 127, 56] },
      { label: "Konum", value: locationText || property.location?.city || "-", color: [100, 116, 139] },
      { label: "Kategori", value: [property.category?.main, property.category?.sub].filter(Boolean).join(" / ") || "-", color: [100, 116, 139] },
      { label: "Oda", value: property.specs?.rooms || "-", color: [100, 116, 139] },
      { label: "Banyo", value: property.specs?.bathrooms || "-", color: [100, 116, 139] },
      { label: "Alan", value: property.specs?.netSize ? `${property.specs.netSize} m²` : property.specs?.grossSize ? `${property.specs.grossSize} m²` : "-", color: [100, 116, 139] },
      { label: "Kat", value: property.specs?.floor ? `${property.specs.floor}${property.specs?.totalFloors ? `/${property.specs.totalFloors}` : ''}` : "-", color: [100, 116, 139] },
      { label: "Bina Yasi", value: property.specs?.age || "-", color: [100, 116, 139] },
    ];

    const cardWidth = (contentWidth - 8) / 2;
    let cardX = margin;
    let cardY = yPos;
    
    infoCards.forEach((card, idx) => {
      if (card.value === "-") return;
      
      // Card background - subtle
      doc.setFillColor(252, 252, 252);
      doc.roundedRect(cardX, cardY, cardWidth, 16, 3, 3, 'F');
      
      // Label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(normalizeTurkish(card.label.toUpperCase()), cardX + 5, cardY + 5);
      
      // Value
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      const valueText = doc.splitTextToSize(normalizeTurkish(String(card.value)), cardWidth - 10);
      doc.text(valueText[0].substring(0, 35), cardX + 5, cardY + 11);
      
      // Toggle column
      if ((idx + 1) % 2 === 0) {
        cardX = margin;
        cardY += 20;
      } else {
        cardX += cardWidth + 8;
      }
    });

    yPos = cardY + 15;

    // Features section - modern cards grid
    if (detailHighlights.length > 0 && yPos < pageHeight - 80) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(normalizeTurkish("Ozellikler"), margin, yPos);
      yPos += 12;

      // Feature cards - 2 column grid
      const featureCardWidth = (contentWidth - 8) / 2;
      const featureCardHeight = 14;
      let featX = margin;
      let featY = yPos;
      
      detailHighlights.slice(0, 12).forEach((highlight, idx) => {
        if (featY > pageHeight - 30) return;
        
        // Card background - subtle grey
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(featX, featY, featureCardWidth, featureCardHeight, 3, 3, 'F');
        
        // Icon - orange filled circle
        doc.setFillColor(247, 127, 56);
        doc.circle(featX + 5, featY + 7, 2, 'F');
        
        // Feature text
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const featureText = doc.splitTextToSize(normalizeTurkish(highlight), featureCardWidth - 18);
        const displayText = featureText[0].length > 40 ? featureText[0].substring(0, 40) + '...' : featureText[0];
        doc.text(displayText, featX + 11, featY + 8.5);
        
        // Toggle column
        if ((idx + 1) % 2 === 0) {
          featX = margin;
          featY += featureCardHeight + 4;
        } else {
          featX += featureCardWidth + 8;
        }
      });
      
      yPos = featY + (featX > margin ? featureCardHeight + 4 : 0) + 10;
    }

    // Description - Full width elegant typography
    if (property.description && yPos < pageHeight - 50) {
      if (yPos > pageHeight - 70) {
        doc.addPage();
        yPos = margin + 10;
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(normalizeTurkish("Aciklama"), margin, yPos);
      yPos += 10;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      doc.setLineHeightFactor(1.8);
      const descLines = doc.splitTextToSize(normalizeTurkish(property.description), contentWidth);
      
      descLines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin + 10;
        }
        doc.text(line, margin, yPos);
        yPos += 5.5;
      });
    }

    // Minimal footer
    doc.setFontSize(6);
    doc.setTextColor(200, 200, 200);
    doc.text(normalizeTurkish(`Sayfa 2`), pageWidth / 2, pageHeight - 12, { align: "center" });

    // ============ SAYFA 3+: MODERN GÖRSEL KATALOİDI ============
    if (hasImages && images.length > 1) {
      const catalogImages = images.slice(1);
      const imagesPerRow = 2;
      const imageWidth = (contentWidth - 12) / imagesPerRow;
      const imageHeight = 95;
      const imageSpacing = 12;

      let imageIndex = 0;

      while (imageIndex < catalogImages.length) {
        doc.addPage();
        yPos = margin;

        // Minimal header
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text(normalizeTurkish("GORSEL KATALOG"), margin, yPos + 3);
        
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.text(normalizeTurkish(`${imageIndex + 2}-${Math.min(imageIndex + 5, images.length)} / ${images.length}`), pageWidth - margin, yPos + 3, { align: "right" });

        yPos += 15;

        const rowStartY = yPos;

        for (let i = 0; i < 4 && imageIndex < catalogImages.length; i++) {
          const col = i % imagesPerRow;
          const row = Math.floor(i / imagesPerRow);

          if (rowStartY + (row * (imageHeight + imageSpacing)) > pageHeight - 30) {
            break;
          }

          const xPos = margin + col * (imageWidth + imageSpacing);
          const yPosImg = rowStartY + row * (imageHeight + imageSpacing);

          try {
            const img = document.createElement('img');
            img.crossOrigin = "anonymous";
            img.src = catalogImages[imageIndex];

            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              setTimeout(reject, 3000);
            });

            if (img.complete && img.naturalHeight !== 0) {
              // Subtle shadow
              doc.setFillColor(0, 0, 0);
              doc.setGState(doc.GState({ opacity: 0.05 }));
              doc.roundedRect(xPos + 1, yPosImg + 1, imageWidth, imageHeight, 6, 6, 'F');
              doc.setGState(doc.GState({ opacity: 1.0 }));

              // White card background
              doc.setFillColor(255, 255, 255);
              doc.roundedRect(xPos, yPosImg, imageWidth, imageHeight, 6, 6, 'F');

              // Image with padding
              doc.addImage(img, "JPEG", xPos + 3, yPosImg + 3, imageWidth - 6, imageHeight - 6, undefined, 'FAST');

              // Minimal number badge
              doc.setFillColor(255, 255, 255);
              doc.setGState(doc.GState({ opacity: 0.95 }));
              doc.circle(xPos + imageWidth - 12, yPosImg + 12, 6, 'F');
              doc.setGState(doc.GState({ opacity: 1.0 }));
              
              doc.setFontSize(8);
              doc.setFont("helvetica", "bold");
              doc.setTextColor(247, 127, 56);
              doc.text(String(imageIndex + 2), xPos + imageWidth - 12, yPosImg + 14, { align: "center" });
            }
          } catch (error) {
            // Minimal placeholder
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(xPos, yPosImg, imageWidth, imageHeight, 6, 6, 'F');
            doc.setFontSize(7);
            doc.setTextColor(200, 200, 200);
            doc.text("—", xPos + imageWidth / 2, yPosImg + imageHeight / 2, { align: "center" });
          }

          imageIndex++;
        }

        // Minimal footer
        doc.setFontSize(6);
        doc.setTextColor(200, 200, 200);
        doc.text(normalizeTurkish(`Sayfa ${doc.getNumberOfPages()}`), pageWidth / 2, pageHeight - 12, { align: "center" });
      }
    }

    // ============ SON SAYFA: MODERN İLETİŞİM ============
    doc.addPage();
    
    // Gradient background - subtle
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Center content vertically
    const centerY = pageHeight / 2;
    
    // Logo - large
    try {
      const logoImg = document.createElement('img');
      logoImg.src = "/images/logos/irem-logo.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });
      doc.addImage(logoImg, "PNG", pageWidth / 2 - 40, centerY - 50, 80, 24);
    } catch {}
    
    // Minimal divider
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 30, centerY - 15, pageWidth / 2 + 30, centerY - 15);
    
    // Contact info - clean typography
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(normalizeTurkish("www.iremworld.com"), pageWidth / 2, centerY, { align: "center" });
    
    if (property.agent?.phone) {
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(normalizeTurkish(property.agent.phone), pageWidth / 2, centerY + 10, { align: "center" });
    }
    
    // Tagline - light
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text(normalizeTurkish("Premium Gayrimenkul Danismanligi"), pageWidth / 2, centerY + 25, { align: "center" });
    
    // Accent element - minimal
    doc.setFillColor(247, 127, 56);
    doc.setGState(doc.GState({ opacity: 0.3 }));
    doc.circle(pageWidth / 2, centerY + 50, 2, 'F');
    doc.setGState(doc.GState({ opacity: 1.0 }));

    // Save with clean filename
    doc.save(`IREM-${property.id}-Katalog.pdf`);
  }, [property, images, hasImages, locationText, formattedPrice, normalizeTurkish]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const catalogHtml = hasImages && images.length > 1
      ? `
        <div style="page-break-before: always; padding: 30px;">
          <h2 style="margin-bottom: 20px; font-size: 20px; color: #1e293b;">Görsel Katalog</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            ${images.slice(1).map(img => `
              <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <img src="${img}" alt="Katalog" style="width: 100%; height: 120mm; object-fit: cover; display: block;" />
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${property.title} - İlan Detayı</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background: white; }
            .header { margin-bottom: 20px; }
            .logo { width: 160px; height: auto; margin-bottom: 15px; }
            .title { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
            .info { font-size: 12px; color: #475569; margin-bottom: 5px; }
            .main-image { width: 100%; height: auto; max-height: 180mm; object-fit: contain; margin: 15px 0; border-radius: 8px; border: 1px solid #e2e8f0; }
            .description { font-size: 10px; color: #334155; margin: 15px 0; line-height: 1.5; }
            .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 8px; color: #94a3b8; padding: 10px; border-top: 1px solid #e2e8f0; background: white; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/images/logos/irem-logo.png" alt="IREM Logo" class="logo" />
            <div class="title">${property.title}</div>
            ${locationText ? `<div class="info">Konum: ${locationText}</div>` : ""}
            <div class="info">Fiyat: ${formattedPrice}</div>
          </div>
          ${hasImages ? `<img src="${images[0]}" alt="${property.title}" class="main-image" />` : ""}
          ${property.description ? `<div class="description">${property.description}</div>` : ""}
          ${catalogHtml}
          <div class="footer">
            ${new Date().toLocaleDateString("tr-TR")} | IREM World
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  }, [property, images, hasImages, locationText, formattedPrice]);

  // JSON-LD Structured Data for SEO
  const jsonLd = useMemo(() => {
    const baseUrl = 'https://www.iremworld.com';
    const propertyUrl = `${baseUrl}/property/${property.slug || property.id}`;
    
    const offerData = property.type === 'sale' ? {
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        url: propertyUrl,
      },
    } : {
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: property.price,
          priceCurrency: 'TRY',
          unitText: 'MONTH',
        },
      },
    };
    
    return {
      '@context': 'https://schema.org',
      '@type': property.type === 'sale' ? 'RealEstateListing' : 'Apartment',
      name: property.title,
      description: property.description,
      url: propertyUrl,
      image: images.length > 0 ? images : [`${baseUrl}/images/headers/default-property.jpg`],
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location?.address || '',
        addressLocality: property.location?.district || '',
        addressRegion: property.location?.city || '',
        addressCountry: 'TR',
      },
      geo: property.location?.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: property.location.coordinates.lat,
        longitude: property.location.coordinates.lng,
      } : undefined,
      ...offerData,
      floorSize: property.specs?.netSize ? {
        '@type': 'QuantitativeValue',
        value: property.specs.netSize,
        unitCode: 'MTK',
      } : undefined,
      numberOfRooms: property.specs?.rooms || undefined,
      numberOfBathroomsTotal: property.specs?.bathrooms || undefined,
      agent: property.agent ? {
        '@type': 'RealEstateAgent',
        name: property.agent.name,
        email: property.agent.email,
        telephone: property.agent.phone,
        url: baseUrl,
      } : undefined,
      datePosted: property.createdAt,
      dateModified: property.updatedAt,
    };
  }, [property, images]);

  // Breadcrumb JSON-LD for better search result display
  const breadcrumbJsonLd = useMemo(() => {
    const breadcrumbs = generatePropertyBreadcrumbs(property);
    return generateBreadcrumbSchema(breadcrumbs);
  }, [property]);

  return (
    <div className="relative min-h-screen bg-neutral-50 text-slate-900">
      {/* JSON-LD Structured Data for Property */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* JSON-LD Breadcrumb for Better Search Display */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <section className="relative isolate h-[70vh] min-h-[520px] overflow-hidden">
        {hasImages ? (
          <div className="absolute inset-0">
            {images.map((image, index) => (
              <motion.div
                key={image}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              >
                <Image src={image} alt={`${property.title} görsel ${index + 1}`} fill priority={index === 0} className="object-cover" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/90 to-transparent" />
        <div className="absolute -right-36 top-14 h-72 w-72 rounded-full bg-[#f07f38]/25 blur-3xl" />
        <div className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-[#f07f38]/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Link href={backLink} className="inline-flex items-center gap-2 transition hover:text-slate-900">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {backLinkLabel}
            </Link>
            <span>•</span>
            <span className="uppercase tracking-[0.25em] text-slate-400">Detay</span>
          </div>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
                <span className="rounded-full bg-[#f07f38] px-4 py-2 text-sm font-semibold text-white">ID: {property.id}</span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {typeLabel}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {property.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locationText || property.location?.city || "Konum paylaşılmadı"}
                </div>
                <div className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                  {property.updatedAt ?? property.createdAt ?? "2024"}
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{heroSummary}</p>
            </div>

            <div className="flex w-full flex-col gap-3 text-sm font-semibold text-slate-900 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
              {formattedPrice !== "Fiyat bilgisi" && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f07f38]/40 bg-white px-6 py-3 text-sm font-semibold text-[#f07f38] shadow-lg shadow-[#f07f38]/20">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 6v1m0 10v1m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formattedPrice}
                </div>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f07f38] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f07f38]/40 transition hover:bg-[#de6d2e]"
              >
                Danışmanla görüş
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {hasImages && (
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Galeriyi aç
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#f07f38]/10 p-3 text-[#f07f38]">{stat.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isImageModalOpen && hasImages && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsImageModalOpen(false)}
              />

              <motion.div
                className="relative z-10 w-full max-w-5xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                  aria-label="Kapat"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6 flex flex-wrap items-start justify-between gap-4 text-slate-900">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">İlan galerisi</p>
                    <h3 className="text-lg font-semibold leading-tight text-slate-900">{property.title}</h3>
                    <p className="text-sm text-slate-500">{locationText || property.location?.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2.5 w-6 rounded-full transition-all ${
                          currentImageIndex === index ? "bg-[#f07f38]" : "bg-slate-200"
                        }`}
                        aria-label={`Görsel ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  {totalImages > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                        aria-label="Önceki görsel"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                        aria-label="Sonraki görsel"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="relative h-[65vh] min-h-[320px] w-full">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={images[currentImageIndex]}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[currentImageIndex]}
                          alt={`${property.title} görsel ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 60vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/0 to-transparent" />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-slate-600">
                  <span className="text-sm">
                    {property.title}
                    {locationText ? ` • ${locationText}` : ""}
                  </span>
                  <a
                    href={images[currentImageIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Orijinal görseli aç
                  </a>
                </div>

                <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-2xl border transition-all ${
                        currentImageIndex === index
                          ? "border-[#f07f38] ring-2 ring-[#f07f38]/40"
                          : "border-slate-200 opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`${property.title} küçük önizleme ${index + 1}`}
                    >
                      <Image src={image} alt="Galeri küçük görsel" fill className="object-cover" sizes="120px" />
                      {currentImageIndex === index && <div className="absolute inset-0 border-2 border-white" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="relative z-20 -mt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="relative flex-1 overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 shadow-inner">
                {hasImages ? (
                  <>
                    {totalImages > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                          aria-label="Önceki görsel"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                          aria-label="Sonraki görsel"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    <div className="relative h-[420px] w-full sm:h-[520px]">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={images[currentImageIndex]}
                          initial={{ opacity: 0.6, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={images[currentImageIndex]}
                            alt={`${property.title} görsel ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
                            priority
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/5 to-transparent" />

                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-slate-600 shadow">
                      <span>{currentImageIndex + 1}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{totalImages}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center px-6 py-12 text-center text-sm text-slate-500">
                    Bu ilan için görseller yakında eklenecek.
                  </div>
                )}
              </div>

              <div className="w-full max-w-xl space-y-6 lg:w-80">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">İlan galerisi</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{property.title} görselleri</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    İç ve dış mekan görsellerini inceleyin. Tam ekran izlemek için aşağıdaki butonu kullanabilirsiniz.
                  </p>
                </div>

                {hasImages && (
                  <>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {images.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square overflow-hidden rounded-2xl border text-left transition-all ${
                            currentImageIndex === index
                              ? "border-[#f07f38] shadow-lg shadow-[#f07f38]/30"
                              : "border-slate-200 hover:border-[#f07f38]"
                          }`}
                          aria-label={`${property.title} küçük görsel ${index + 1}`}
                        >
                          <Image src={image} alt={`${property.title} küçük görsel ${index + 1}`} fill className="object-cover" sizes="120px" />
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExportPDF}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-red-600 hover:to-red-700"
                      >
                        PDF İndir
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Yazdır
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {essentials.map((item) => (
                <div key={item.label} className="flex items-start gap-3 text-slate-800">
                  <div className="rounded-full bg-[#f07f38]/10 p-3 text-[#f07f38]">{item.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-10">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-3xl font-semibold text-slate-900">İlan hakkında</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{property.description || heroSummary}</p>
              </motion.section>

              {detailHighlights.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-900">Öne çıkan avantajlar</h3>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Özet</span>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {detailHighlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#f07f38]" />
                        <p className="text-sm font-medium leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {buildingAmenities.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-900">Sosyal ve yaşam alanları</h3>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Konfor</span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {buildingAmenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm font-medium text-slate-700"
                      >
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f07f38]/15 text-[#f07f38]">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {technicalFeatures.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-900">Teknik özellikler</h3>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Detay</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {technicalFeatures.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f07f38]/15 text-[#f07f38]">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {property.landDetails && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-900">Arsa detayları</h3>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">İmar</span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {property.landDetails.zoningStatus && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">İmar durumu</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.zoningStatus}</p>
                      </div>
                    )}
                    {property.landDetails.pricePerSquareMeter && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">m² fiyatı</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">₺{priceFormatter.format(property.landDetails.pricePerSquareMeter)}</p>
                      </div>
                    )}
                    {property.landDetails.blockNumber && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ada</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.blockNumber}</p>
                      </div>
                    )}
                    {property.landDetails.parcelNumber && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Parsel</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.parcelNumber}</p>
                      </div>
                    )}
                    {property.landDetails.sheetNumber && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pafta</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.sheetNumber}</p>
                      </div>
                    )}
                    {property.landDetails.floorAreaRatio && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kaks</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.floorAreaRatio}</p>
                      </div>
                    )}
                    {property.landDetails.buildingHeight && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gabari</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.buildingHeight}</p>
                      </div>
                    )}
                    {property.landDetails.creditEligibility && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kredi uygunluğu</p>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{property.landDetails.creditEligibility}</p>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">Uzman danışmanımızla görüşün</h4>
                <p className="mt-2 text-sm text-slate-600">
                  İhtiyaçlarınıza uygun çözümler ve ödeme planı için en geç 24 saat içinde sizi arayalım.
                </p>
                <div className="mt-6 space-y-3">
                  <a
                    href={property.agent?.phone ? `tel:${property.agent.phone}` : "/contact"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f07f38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#de6d2e]"
                  >
                    Hemen arayın
                  </a>
                  <a
                    href={property.agent?.email ? `mailto:${property.agent.email}` : "/contact"}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    E-posta gönderin
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12H8m4-4v8m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>

                {property.agent && (
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Temsilciniz</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{property.agent.name}</p>
                    {property.agent.company && <p className="text-sm text-slate-600">{property.agent.company}</p>}
                    {property.agent.phone && (
                      <p className="mt-2 text-sm text-slate-500">Telefon: {property.agent.phone}</p>
                    )}
                    {property.agent.email && (
                      <p className="text-sm text-slate-500">E-posta: {property.agent.email}</p>
                    )}
                  </div>
                )}

                {store && (
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mağaza</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border">
                        <img src={store.logo} alt={store.name} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/store/${store.slug}`} className="text-base font-semibold text-slate-900 block truncate">{store.name}</Link>
                        <div className="text-xs text-slate-600">{store.contact.city} • {store.specialties[0]}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-sm text-slate-500">İletişim: {store.contact.phone}</p>
                      <p className="text-sm text-slate-500">E-posta: {store.contact.email}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">Konum</h4>
                {mapEmbedUrl ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <iframe
                      title={`${property.title} harita`}
                      src={mapEmbedUrl}
                      className="h-56 w-full"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Harita bilgisi yakında eklenecek.
                  </div>
                )}
                <a
                  href={mapExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Haritada aç
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">İlanı paylaş</h4>
                <p className="mt-2 text-sm text-slate-600">Takımınızla veya yatırımcılarla saniyeler içinde paylaşın.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => shareProperty("whatsapp")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100"
                  >
                    {SHARE_ICONS.whatsapp}
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => shareProperty("instagram")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:from-purple-100 hover:to-pink-100"
                  >
                    {SHARE_ICONS.instagram}
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => shareProperty("sms")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                  >
                    {SHARE_ICONS.sms}
                    SMS
                  </button>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 block md:hidden">
        <div className="pointer-events-auto mx-auto max-w-7xl px-4 pb-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex-1 rounded-full bg-[#f07f38] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#de6d2e]"
              >
                Danışmanla görüş
              </Link>
              {hasImages && (
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Galeri
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
