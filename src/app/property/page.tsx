"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Select, { components } from "react-select";
import { Property, PropertyFilters as Filters, PropertyCategory } from "@/types/property";
import { Store } from "@/types/store";
import PropertyMapView from "@/components/ui/PropertyMapView";
import { generatePropertyUrl } from "@/utils/slug";
import * as flags from 'country-flag-icons/react/3x2';
import countries from 'world-countries';
import { City, State } from 'country-state-city';
import { motion, AnimatePresence } from "framer-motion";

// Ülke kodu mapping (ISO 3166-1 alpha-2)
const countryCodeMap: Record<string, string> = {
  'TR': 'TR', 'US': 'US', 'GB': 'GB', 'DE': 'DE', 'FR': 'FR', 'ES': 'ES', 
  'IT': 'IT', 'NL': 'NL', 'BE': 'BE', 'CH': 'CH', 'AT': 'AT', 'SE': 'SE',
  'NO': 'NO', 'DK': 'DK', 'FI': 'FI', 'PL': 'PL', 'CZ': 'CZ', 'HU': 'HU',
  'RO': 'RO', 'BG': 'BG', 'GR': 'GR', 'PT': 'PT', 'IE': 'IE', 'RU': 'RU',
  'UA': 'UA', 'CN': 'CN', 'JP': 'JP', 'KR': 'KR', 'IN': 'IN', 'AU': 'AU',
  'NZ': 'NZ', 'CA': 'CA', 'MX': 'MX', 'BR': 'BR', 'AR': 'AR', 'CL': 'CL',
  'SA': 'SA', 'AE': 'AE', 'QA': 'QA', 'KW': 'KW', 'EG': 'EG', 'ZA': 'ZA',
  'NG': 'NG', 'KE': 'KE', 'MA': 'MA', 'TN': 'TN', 'DZ': 'DZ', 'IL': 'IL',
  'TH': 'TH', 'MY': 'MY', 'SG': 'SG', 'ID': 'ID', 'PH': 'PH', 'VN': 'VN',
  'PK': 'PK', 'BD': 'BD', 'LK': 'LK', 'NP': 'NP', 'MM': 'MM', 'KH': 'KH',
  'LA': 'LA', 'MN': 'MN', 'KZ': 'KZ', 'UZ': 'UZ', 'TM': 'TM', 'KG': 'KG',
  'TJ': 'TJ', 'AF': 'AF', 'IQ': 'IQ', 'SY': 'SY', 'JO': 'JO', 'LB': 'LB',
  'PS': 'PS', 'YE': 'YE', 'OM': 'OM', 'BH': 'BH', 'AZ': 'AZ', 'GE': 'GE',
  'AM': 'AM', 'CY': 'CY', 'MT': 'MT', 'IS': 'IS', 'LU': 'LU', 'MC': 'MC',
  'LI': 'LI', 'AD': 'AD', 'SM': 'SM', 'VA': 'VA', 'MD': 'MD', 'BY': 'BY',
  'LT': 'LT', 'LV': 'LV', 'EE': 'EE', 'HR': 'HR', 'SI': 'SI', 'SK': 'SK',
  'RS': 'RS', 'BA': 'BA', 'ME': 'ME', 'MK': 'MK', 'AL': 'AL', 'XK': 'XK',
};

const countryNameMap: Record<string, string> = countries.reduce((acc: Record<string, string>, country) => {
  const code = country.cca2?.toUpperCase();
  if (!code) {
    return acc;
  }
  acc[code] = country.translations?.tur?.common || country.name.common;
  return acc;
}, {});

const getCountryName = (code?: string | null) => {
  if (!code) {
    return '';
  }
  return countryNameMap[code.toUpperCase()] || code;
};

const compactPriceFormatter = new Intl.NumberFormat('tr-TR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const fullPriceFormatter = new Intl.NumberFormat('tr-TR', {
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }
  return `${fullPriceFormatter.format(value)} ₺`;
};

const formatBoolean = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return '-';
  }
  return value ? 'Evet' : 'Hayır';
};

type ComparisonMetric = {
  key: string;
  label: string;
  helper?: string;
  render: (property: Property) => string;
};

const comparisonMetricConfig: ComparisonMetric[] = [
  {
    key: 'price',
    label: 'Fiyat',
    render: (property) => formatCurrency(property.price),
  },
  {
    key: 'location',
    label: 'Konum',
    render: (property) => {
      const city = property.location?.city || '-';
      const countryLabel = getCountryName(property.location?.country);
      return countryLabel ? `${city}, ${countryLabel}` : city;
    },
  },
  {
    key: 'district',
    label: 'İlçe / Mahalle',
    render: (property) => {
      const parts = [];
      if (property.location?.district) parts.push(property.location.district);
      if (property.location?.neighborhood) parts.push(property.location.neighborhood);
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },
  {
    key: 'segment',
    label: 'Kategori',
    render: (property) => property.category?.sub || property.category?.main || '-',
  },
  {
    key: 'rooms',
    label: 'Oda / Salon',
    render: (property) => property.specs?.rooms || '-',
  },
  {
    key: 'netSize',
    label: 'Net Alan',
    render: (property) =>
      typeof property.specs?.netSize === 'number'
        ? `${property.specs.netSize} m²`
        : '-',
  },
  {
    key: 'grossSize',
    label: 'Brüt Alan',
    render: (property) =>
      typeof property.specs?.grossSize === 'number'
        ? `${property.specs.grossSize} m²`
        : '-',
  },
  {
    key: 'floor',
    label: 'Kat',
    render: (property) =>
      typeof property.specs?.floor === 'number'
        ? `${property.specs.floor}. Kat`
        : '-',
  },
  {
    key: 'totalFloors',
    label: 'Toplam Kat',
    render: (property) =>
      typeof property.specs?.totalFloors === 'number'
        ? `${property.specs.totalFloors} Kat`
        : '-',
  },
  {
    key: 'bathrooms',
    label: 'Banyo',
    render: (property) =>
      typeof property.specs?.bathrooms === 'number'
        ? `${property.specs.bathrooms}`
        : '-',
  },
  {
    key: 'balcony',
    label: 'Balkon',
    render: (property) =>
      typeof property.specs?.balcony === 'number'
        ? `${property.specs.balcony}`
        : property.specs?.balcony ? 'Var' : '-',
  },
  {
    key: 'furnishing',
    label: 'Eşya Durumu',
    render: (property) => property.specs?.furnishing || '-',
  },
  {
    key: 'age',
    label: 'Bina Yaşı',
    render: (property) =>
      typeof property.specs?.age === 'number'
        ? `${property.specs.age} Yıl`
        : '-',
  },
  {
    key: 'heating',
    label: 'Isıtma',
    render: (property) => property.specs?.heating || '-',
  },
  {
    key: 'view',
    label: 'Manzara',
    render: (property) => property.specs?.view || '-',
  },
  {
    key: 'monthlyFee',
    label: 'Aidat',
    render: (property) => formatCurrency(property.propertyDetails?.monthlyFee),
  },
  {
    key: 'creditEligible',
    label: 'Krediye Uygun',
    render: (property) => formatBoolean(property.propertyDetails?.creditEligible),
  },
  {
    key: 'carPark',
    label: 'Otopark',
    render: (property) => formatBoolean(property.buildingFeatures?.hasCarPark),
  },
];

interface CountryOption {
  value: string;
  label: string;
  count: number;
  code: string;
}

function PropertyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"sale" | "rent" | "">("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [hasAutoCollapsedFilters, setHasAutoCollapsedFilters] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [hoverImageIndex, setHoverImageIndex] = useState<Record<string, number>>({});
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [compareHint, setCompareHint] = useState<string | null>(null);
  const [storesById, setStoresById] = useState<Record<string, Store>>({});
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [showListSkeleton, setShowListSkeleton] = useState(true);
  const [mapFocusOffset, setMapFocusOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const maxCompareSelectable = 3;
  const previousCountryRef = useRef<string>('');
  const filterSignature = useMemo(
    () => JSON.stringify({ selectedCountry, selectedCity, transactionType, filters }),
    [selectedCountry, selectedCity, transactionType, filters]
  );
  const compareIdSet = useMemo(() => new Set(compareList.map(item => item.id)), [compareList]);
  const compareTrayVisible = compareList.length > 0;
  const comparisonReady = compareList.length >= 2;
  const compareHelper = compareHint ?? (comparisonReady ? 'Karşılaştırmayı başlatabilirsiniz.' : 'En az 2 ilan seçin.');
  const stores = useMemo(() => Object.values(storesById), [storesById]);

  // URL'den ülke ve filtreleri al
  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const type = searchParams.get("type"); // sale veya rent
    
    if (country) {
      setSelectedCountry(country);
    }

    if (city) {
      setSelectedCity(city);
    }

    if (type) {
      setTransactionType(type as "sale" | "rent");
    }

    // Filtreleri ayarla
    const urlFilters: Filters = {};
    if (category) {
      try {
        const decoded = decodeURIComponent(category);
        urlFilters.category = JSON.parse(decoded);
      } catch (e) {
        // Invalid category filter
      }
    }
    
    setFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    if (hasAutoCollapsedFilters) return;
    const timer = setTimeout(() => {
      setFiltersOpen(false);
      setHasAutoCollapsedFilters(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasAutoCollapsedFilters]);

  // Tüm ülkeleri yükle (bayrak ve sayı bilgisi ile) - optimize edilmiş
  const [allCountries, setAllCountries] = useState<CountryOption[]>([]);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        const result = await response.json();
        
        if (result.success) {
          const countryOptions: CountryOption[] = result.data.map((c: any) => ({
            value: c.code,
            label: getCountryName(c.code),
            count: c.total,
            code: countryCodeMap[c.code] || c.code
          }));
          
          setAllCountries(countryOptions);
        }
      } catch (error) {
        // Failed to load countries
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    setShowListSkeleton(true);
    const timeout = setTimeout(() => {
      if (!loading) {
        setShowListSkeleton(false);
      }
    }, loading ? 800 : 350);

    return () => clearTimeout(timeout);
  }, [filterSignature, loading, filteredProperties.length]);

  useEffect(() => {
    const updateMapOffset = () => {
      if (typeof window === "undefined") {
        return;
      }

      const width = window.innerWidth;
      let yOffset = -80;

      if (width >= 1536) {
        yOffset = -190;
      } else if (width >= 1280) {
        yOffset = -160;
      } else if (width >= 1024) {
        yOffset = -130;
      } else if (width >= 768) {
        yOffset = -100;
      }

      setMapFocusOffset({ x: 0, y: yOffset });
    };

    updateMapOffset();
    window.addEventListener("resize", updateMapOffset);
    return () => window.removeEventListener("resize", updateMapOffset);
  }, []);

  useEffect(() => {
    if (!quickViewProperty) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [quickViewProperty]);

  useEffect(() => {
    if (quickViewProperty) {
      setQuickViewImageIndex(0);
    }
  }, [quickViewProperty]);

  useEffect(() => {
    if (!compareHint) return;
    const timer = setTimeout(() => setCompareHint(null), 2600);
    return () => clearTimeout(timer);
  }, [compareHint]);

  useEffect(() => {
    if (
      previousCountryRef.current &&
      previousCountryRef.current !== selectedCountry &&
      compareList.length
    ) {
      setCompareList([]);
      setCompareHint('Ülke değiştirildiği için karşılaştırma sıfırlandı.');
    }
    previousCountryRef.current = selectedCountry;
  }, [selectedCountry, compareList.length]);

  useEffect(() => {
    if (!compareList.length && isCompareModalOpen) {
      setIsCompareModalOpen(false);
    }
  }, [compareList.length, isCompareModalOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        const result = await response.json();
        if (!result?.success || !Array.isArray(result.data) || !isMounted) {
          return;
        }

        const nextMap: Record<string, Store> = {};
        (result.data as Store[]).forEach((store) => {
          if (store?.id) {
            nextMap[store.id] = store;
          }
        });
        setStoresById(nextMap);
      } catch (error) {
        // Stores bilgisi yüklenemezse UI yine çalışsın
      }
    };

    fetchStores();

    return () => {
      isMounted = false;
    };
  }, []);


  // Custom Option Component - Bayrak ve sayı ile
  const CustomOption = (props: any) => {
    const FlagComponent = (flags as any)[props.data.code];
    
    return (
      <components.Option {...props}>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            {FlagComponent && (
              <FlagComponent className="w-6 h-4 rounded shadow-sm" />
            )}
            <span className="font-medium text-gray-900">{props.data.label}</span>
          </div>
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
            {props.data.count}
          </span>
        </div>
      </components.Option>
    );
  };

  // Custom SingleValue Component - Seçili ülke gösterimi
  const CustomSingleValue = (props: any) => {
    const FlagComponent = (flags as any)[props.data.code];
    
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          {FlagComponent && (
            <FlagComponent className="w-5 h-3.5 rounded shadow-sm" />
          )}
          <span className="font-medium">{props.data.label}</span>
          <span className="text-xs text-gray-500">({props.data.count})</span>
        </div>
      </components.SingleValue>
    );
  };

  // Dinamik olarak şehir listelerini oluştur
  const cityOptions = useMemo(() => {
    if (!selectedCountry) return [];
    
    // Use country-state-city library for a clean list
    // Türkiye için İl (State) listesi, diğer ülkeler için Şehir (City) listesi
    // Çünkü kütüphanede TR için City = İlçe, State = İl
    const libraryLocations = selectedCountry === 'TR' 
      ? State.getStatesOfCountry(selectedCountry)
      : City.getCitiesOfCountry(selectedCountry);

    if (libraryLocations && libraryLocations.length > 0) {
      return libraryLocations.map(c => ({ value: c.name, label: c.name }));
    }

    // Fallback to existing data if library returns nothing
    const cities = new Set<string>();
    filteredProperties
      .filter(p => p.location?.country === selectedCountry)
      .forEach(p => {
        if (p.location?.city) cities.add(p.location.city);
      });
    return Array.from(cities).sort().map(c => ({ value: c, label: c }));
  }, [filteredProperties, selectedCountry]);

  // Ülke verilerini yükle (sadece ülke değiştiğinde)
  const [countryProperties, setCountryProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchCountryProperties = async () => {
      if (!selectedCountry) {
        setCountryProperties([]);
        setFilteredProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        const response = await fetch(`/api/properties-json?country=${selectedCountry}`);
        const result = await response.json();

        if (result.success) {
          setCountryProperties(result.data);
        } else {
          setCountryProperties([]);
        }
      } catch (error) {
        setCountryProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryProperties();
  }, [selectedCountry]);

  const derivedFilterOptions = useMemo(() => {
    if (!countryProperties.length) {
      return {
        categories: [] as string[],
        rooms: [] as string[],
        kitchenTypes: [] as string[],
        heatingTypes: [] as string[],
        priceRange: { min: 0, max: 0 },
        sizeRange: { min: 0, max: 0 },
        features: {
          hasCarPark: 0,
          hasElevator: 0,
          isFurnished: 0,
          hasBalcony: 0,
        },
      };
    }

    const categories = new Set<string>();
    const rooms = new Set<string>();
    const kitchenTypes = new Set<string>();
    const heatingTypes = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;
    let minSize = Infinity;
    let maxSize = 0;
    const featureAvailability = {
      hasCarPark: 0,
      hasElevator: 0,
      isFurnished: 0,
      hasBalcony: 0,
    };

    countryProperties.forEach(property => {
      if (property.category?.main) {
        categories.add(property.category.main);
      }
      if (property.specs?.rooms) {
        rooms.add(property.specs.rooms);
      }
      if (property.interiorFeatures?.kitchenType) {
        kitchenTypes.add(property.interiorFeatures.kitchenType);
      }
      if (property.specs?.heating) {
        heatingTypes.add(property.specs.heating);
      }
      if (typeof property.price === "number") {
        minPrice = Math.min(minPrice, property.price);
        maxPrice = Math.max(maxPrice, property.price);
      }
      if (typeof property.specs?.netSize === "number") {
        minSize = Math.min(minSize, property.specs.netSize);
        maxSize = Math.max(maxSize, property.specs.netSize);
      }
      if (property.buildingFeatures?.hasCarPark) {
        featureAvailability.hasCarPark += 1;
      }
      if (property.buildingFeatures?.hasElevator) {
        featureAvailability.hasElevator += 1;
      }
      if (property.exteriorFeatures?.hasBalcony) {
        featureAvailability.hasBalcony += 1;
      }
      if (property.specs?.furnishing && property.specs.furnishing !== "Unfurnished") {
        featureAvailability.isFurnished += 1;
      }
    });

    return {
      categories: Array.from(categories).sort(),
      rooms: Array.from(rooms).sort(),
      kitchenTypes: Array.from(kitchenTypes).sort(),
      heatingTypes: Array.from(heatingTypes).sort(),
      priceRange: {
        min: Number.isFinite(minPrice) ? minPrice : 0,
        max: Number.isFinite(maxPrice) ? maxPrice : 0,
      },
      sizeRange: {
        min: Number.isFinite(minSize) ? minSize : 0,
        max: Number.isFinite(maxSize) ? maxSize : 0,
      },
      features: featureAvailability,
    };
  }, [countryProperties]);

  const updateFilters = (updates: Partial<Filters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const resetAllFilters = useCallback(() => {
    setSelectedCountry('');
    setSelectedCity('');
    setTransactionType('');
    setFilters({});
    router.push('/property');
  }, [router]);

  const handleQuickViewOpen = (property: Property, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsQuickViewOpen(true);
    setQuickViewProperty(property);
    setQuickViewImageIndex(0);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
    setQuickViewProperty(null);
    setQuickViewImageIndex(0);
  };

  const quickViewImages = quickViewProperty
    ? (quickViewProperty.images && quickViewProperty.images.length > 0
        ? quickViewProperty.images
        : [`https://source.unsplash.com/800x600/?apartment,house&sig=${quickViewProperty.id}`])
    : [];

  const totalQuickViewImages = quickViewImages.length;
  const quickViewImageSrc = totalQuickViewImages
    ? quickViewImages[Math.min(quickViewImageIndex, totalQuickViewImages - 1)]
    : '';

  const quickViewDetailTags = quickViewProperty
    ? [
        quickViewProperty.specs?.rooms ? `${quickViewProperty.specs.rooms} Oda` : null,
        quickViewProperty.specs?.netSize ? `${quickViewProperty.specs.netSize} m²` : null,
        quickViewProperty.specs?.bathrooms ? `${quickViewProperty.specs.bathrooms} Banyo` : null,
      ].filter(Boolean) as string[]
    : [];

  const quickViewPriceLabel = quickViewProperty
    ? new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(quickViewProperty.price)
    : '';

  const quickViewLocationLabel = quickViewProperty
    ? `${quickViewProperty.location?.city || ''}${quickViewProperty.location?.country ? `, ${getCountryName(quickViewProperty.location.country)}` : ''}`
    : '';

  const handleQuickViewNextImage = () => {
    if (!totalQuickViewImages) return;
    setQuickViewImageIndex((prev) => (prev + 1) % totalQuickViewImages);
  };

  const handleQuickViewPrevImage = () => {
    if (!totalQuickViewImages) return;
    setQuickViewImageIndex((prev) => (prev - 1 + totalQuickViewImages) % totalQuickViewImages);
  };

  const handleCompareToggle = (property: Property, event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === property.id);
      if (exists) {
        setCompareHint('İlan karşılaştırmadan çıkarıldı.');
        return prev.filter((item) => item.id !== property.id);
      }
      if (prev.length >= maxCompareSelectable) {
        setCompareHint(`En fazla ${maxCompareSelectable} ilan seçebilirsiniz.`);
        return prev;
      }
      setCompareHint('Karşılaştırmaya eklendi.');
      return [...prev, property];
    });
  };

  const handleCompareRemove = (propertyId: string) => {
    setCompareList((prev) => {
      if (!prev.some((item) => item.id === propertyId)) {
        return prev;
      }
      setCompareHint('İlan karşılaştırmadan çıkarıldı.');
      return prev.filter((item) => item.id !== propertyId);
    });
  };

  const handleCompareClear = () => {
    if (!compareList.length) return;
    setCompareList([]);
    setCompareHint('Karşılaştırma listesi temizlendi.');
  };

  const handleCompareModalOpen = () => {
    if (!comparisonReady) return;
    setIsCompareModalOpen(true);
  };

  const handleCompareModalClose = () => setIsCompareModalOpen(false);

  const handlePrint = useCallback((event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Lütfen popup engelleyiciyi kapatın ve tekrar deneyin.');
      return;
    }

    // Build HTML content similar to PDF
    let propertyCardsHTML = '';
    
    compareList.forEach((property) => {
      const propertyStore = stores.find((s) => s.id === property.storeId);
      const imgSrc = getPropertyCover(property);
      
      propertyCardsHTML += `
        <div class="property-card">
          <div class="property-image">
            <img src="${imgSrc}" alt="${property.title}" onerror="this.style.display='none'">
          </div>
          <h3 class="property-title">${property.title}</h3>
          <p class="property-location">${property.location.city}, ${getCountryName(property.location.country)}</p>
          ${propertyStore ? `<p class="property-store">${propertyStore.name}</p>` : ''}
        </div>
      `;
    });

    // Build comparison rows
    const activeMetrics = comparisonMetricConfig.filter((metric) => {
      return compareList.some((property) => {
        const value = metric.render(property);
        return value !== '-' && value !== '' && value.trim() !== '-';
      });
    });

    let comparisonRowsHTML = '';
    activeMetrics.forEach((metric) => {
      let valuesHTML = '';
      compareList.forEach((property) => {
        const value = metric.render(property);
        valuesHTML += `<div class="comparison-value">${value}</div>`;
      });
      
      comparisonRowsHTML += `
        <div class="comparison-row">
          <div class="comparison-label">${metric.label}</div>
          <div class="comparison-values">${valuesHTML}</div>
        </div>
      `;
    });
    
    // Build complete HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>İlan Karşılaştırma - IREMWORLD</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 15px;
            background: white;
            color: #111827;
            font-size: 11px;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
          }
          .logo {
            width: 160px;
            height: auto;
            margin-bottom: 8px;
          }
          h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #111827;
          }
          .date {
            font-size: 10px;
            color: #6b7280;
          }
          .properties-grid {
            display: grid;
            grid-template-columns: repeat(${compareList.length}, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .property-card {
            text-align: center;
          }
          .property-image {
            width: 100%;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 8px;
            background: #f3f4f6;
          }
          .property-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .property-title {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
            color: #111827;
          }
          .property-location {
            font-size: 9px;
            color: #6b7280;
            margin-bottom: 3px;
          }
          .property-store {
            font-size: 9px;
            color: #4b5563;
          }
          .comparison-table {
            width: 100%;
          }
          .comparison-row {
            display: grid;
            grid-template-columns: 180px 1fr;
            padding: 6px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .comparison-row:nth-child(even) {
            background: #f9fafb;
          }
          .comparison-label {
            font-weight: 600;
            font-size: 10px;
            color: #4b5563;
            padding: 4px 8px;
          }
          .comparison-values {
            display: grid;
            grid-template-columns: repeat(${compareList.length}, 1fr);
            gap: 8px;
          }
          .comparison-value {
            font-size: 10px;
            color: #111827;
            text-align: center;
            padding: 4px;
          }
          .catalog-page {
            page-break-before: always;
            margin-top: 20px;
            padding-top: 20px;
          }
          .catalog-page:first-of-type {
            margin-top: 30px;
          }
          .catalog-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #111827;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .catalog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .catalog-image-container {
            border-radius: 8px;
            overflow: hidden;
            background: #f3f4f6;
            height: 180px;
          }
          .catalog-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @media print {
            body {
              padding: 8mm;
            }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            .catalog-page {
              page-break-before: always;
            }
            /* Hide URL/about:blank from footer */
            @page {
              margin-bottom: 0;
            }
            body::after {
              content: "";
              display: block;
              height: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/pdflogo/logo.png" alt="IREMWORLD" class="logo" onerror="this.style.display='none'">
          <h1>İlan Karşılaştırma Raporu</h1>
          <p class="date">Tarih: ${new Date().toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p class="date">${compareList.length} İlan Karşılaştırılıyor</p>
        </div>

        <div class="properties-grid">
          ${propertyCardsHTML}
        </div>

        <div class="comparison-table">
          ${comparisonRowsHTML}
        </div>

        ${(() => {
          // Build catalog pages with all property images
          let catalogHTML = '';
          
          compareList.forEach((property, propIndex) => {
            const propertyImages = property.images || [];
            if (propertyImages.length === 0) return;

            catalogHTML += `
              <div class="catalog-page">
                <h2 class="catalog-title">${property.title} - Tüm Görseller</h2>
                <div class="catalog-grid">
            `;

            propertyImages.forEach((imageUrl, imgIndex) => {
              catalogHTML += `
                <div class="catalog-image-container">
                  <img src="${imageUrl}" alt="${property.title} - Görsel ${imgIndex + 1}" class="catalog-image" onerror="this.style.display='none'">
                </div>
              `;
            });

            catalogHTML += `
                </div>
              </div>
            `;
          });

          return catalogHTML;
        })()}

        <script>
          window.onload = function() {
            // Set document title to avoid "about:blank" in footer
            document.title = 'İlan Karşılaştırma - IREMWORLD';
            
            setTimeout(function() {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  }, [compareList, stores, comparisonMetricConfig]);

  const normalizeTurkish = (text: string): string => {
    return text
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .replace(/Ğ/g, 'G')
      .replace(/ğ/g, 'g')
      .replace(/Ü/g, 'U')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 'S')
      .replace(/ş/g, 's')
      .replace(/Ö/g, 'O')
      .replace(/ö/g, 'o')
      .replace(/Ç/g, 'C')
      .replace(/ç/g, 'c');
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Add Logo - Centered at top
      const logoImg = new Image();
      logoImg.src = '/pdflogo/logo.png';
      try {
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          setTimeout(reject, 2000);
        });
        const logoWidth = 66;
        const logoHeight = 15;
        pdf.addImage(logoImg, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
        yPosition += logoHeight + 5;
      } catch (e) {
        console.log('Logo could not be loaded');
      }

      // Header - Use helvetica for better Turkish support
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(17, 24, 39);
      pdf.text(normalizeTurkish('İlan Karşılaştırma Raporu'), pageWidth / 2, yPosition + 5, { align: 'center' });
      
      yPosition += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      const dateStr = normalizeTurkish(`Tarih: ${new Date().toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`);
      pdf.text(dateStr, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 5;
      pdf.text(normalizeTurkish(`${compareList.length} İlan Karşılaştırılıyor`), pageWidth / 2, yPosition, { align: 'center' });
      
      // Line separator
      yPosition += 5;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Calculate column widths for side-by-side layout
      const numProperties = compareList.length;
      const availableWidth = pageWidth - 2 * margin;
      const colWidth = availableWidth / numProperties;
      
      // Property Images Row
      let xPosition = margin;
      const imageRowY = yPosition;
      
      for (const property of compareList) {
        const imgSrc = getPropertyCover(property);
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imgSrc;
          
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000);
          });

          if (img.complete && img.naturalHeight !== 0) {
            const imgWidth = colWidth - 4;
            const imgHeight = 40;
            pdf.addImage(img, 'JPEG', xPosition + 2, imageRowY, imgWidth, imgHeight, undefined, 'FAST');
          }
        } catch (e) {
          // Görsel yüklenemezse placeholder
          pdf.setFillColor(243, 244, 246);
          pdf.rect(xPosition + 2, imageRowY, colWidth - 4, 40, 'F');
        }

        xPosition += colWidth;
      }

      yPosition = imageRowY + 45;

      // Property Titles Row - Multi-line support
      xPosition = margin;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(17, 24, 39);
      
      let maxTitleHeight = 0;
      for (const property of compareList) {
        const lines = pdf.splitTextToSize(normalizeTurkish(property.title), colWidth - 6);
        const titleHeight = lines.length * 4;
        maxTitleHeight = Math.max(maxTitleHeight, titleHeight);
        pdf.text(lines, xPosition + colWidth / 2, yPosition, { align: 'center' });
        xPosition += colWidth;
      }

      yPosition += maxTitleHeight + 5;

      // Property Location Row
      xPosition = margin;
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      
      for (const property of compareList) {
        pdf.text(normalizeTurkish(property.location.city), xPosition + colWidth / 2, yPosition, { align: 'center' });
        xPosition += colWidth;
      }

      yPosition += 6;

      // Store Names Row
      xPosition = margin;
      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      
      for (const property of compareList) {
        const propertyStore = stores.find((s) => s.id === property.storeId);
        if (propertyStore) {
          const storeName = propertyStore.name.length > 25 ? propertyStore.name.substring(0, 22) + '...' : propertyStore.name;
          pdf.text(normalizeTurkish(storeName), xPosition + colWidth / 2, yPosition, { align: 'center' });
        }
        xPosition += colWidth;
      }

      yPosition += 10;

      // Separator line
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      // Filter out metrics where all properties have empty values
      const activeMetrics = comparisonMetricConfig.filter((metric) => {
        return compareList.some((property) => {
          const value = metric.render(property);
          return value !== '-' && value !== '' && value.trim() !== '-';
        });
      });

      // Comparison Metrics Grid
      pdf.setFontSize(8);
      
      for (const metric of activeMetrics) {
        // Check if we need a new page
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          yPosition = margin;

          // Add property thumbnails header on new pages
          xPosition = margin + 45;
          const valueColWidth = (availableWidth - 45) / numProperties;
          const thumbY = yPosition;
          
          for (const property of compareList) {
            const imgSrc = getPropertyCover(property);
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = imgSrc;
              
              await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 2000);
              });

              if (img.complete && img.naturalHeight !== 0) {
                const thumbWidth = valueColWidth - 6;
                const thumbHeight = 25;
                // Add rounded corner effect with border
                pdf.setDrawColor(229, 231, 235);
                pdf.setLineWidth(0.5);
                pdf.roundedRect(xPosition + 3, thumbY, thumbWidth, thumbHeight, 2, 2, 'S');
                pdf.addImage(img, 'JPEG', xPosition + 3, thumbY, thumbWidth, thumbHeight, undefined, 'FAST');
              }
            } catch (e) {
              // Thumbnail placeholder
              pdf.setFillColor(243, 244, 246);
              pdf.roundedRect(xPosition + 3, thumbY, valueColWidth - 6, 25, 2, 2, 'F');
            }
            xPosition += valueColWidth;
          }
          
          yPosition += 30;
          
          // Property titles under thumbnails
          xPosition = margin + 45;
          pdf.setFontSize(6.5);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(17, 24, 39);
          
          for (const property of compareList) {
            const shortTitle = property.title.length > 30 ? property.title.substring(0, 27) + '...' : property.title;
            pdf.text(normalizeTurkish(shortTitle), xPosition + valueColWidth / 2, yPosition, { 
              align: 'center',
              maxWidth: valueColWidth - 6
            });
            xPosition += valueColWidth;
          }
          
          yPosition += 8;
          
          // Separator line
          pdf.setDrawColor(229, 231, 235);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(8);
        }

        // Draw background for alternating rows
        const rowIndex = activeMetrics.indexOf(metric);
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPosition - 4, availableWidth, 7, 'F');
        }

        // Metric Label (Left side)
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(75, 85, 99);
        pdf.text(normalizeTurkish(metric.label), margin + 2, yPosition);
        
        // Metric Values (Columns)
        xPosition = margin + 45;
        const valueColWidth = (availableWidth - 45) / numProperties;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(17, 24, 39);
        
        for (const property of compareList) {
          const value = metric.render(property);
          pdf.text(normalizeTurkish(value), xPosition + valueColWidth / 2, yPosition, { 
            align: 'center',
            maxWidth: valueColWidth - 4
          });
          xPosition += valueColWidth;
        }

        yPosition += 7;
      }

      // Add catalog pages at the end - all property images
      for (const property of compareList) {
        pdf.addPage();
        yPosition = margin + 10;

        // Property header
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(17, 24, 39);
        const titleLines = pdf.splitTextToSize(normalizeTurkish(property.title), pageWidth - 2 * margin);
        pdf.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += titleLines.length * 6 + 5;

        // Property location
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128);
        pdf.text(normalizeTurkish(`${property.location.city}, ${getCountryName(property.location.country)}`), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        // Separator
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Get all images for this property
        const propertyImages = property.images || [];
        const imagesPerRow = 2;
        const imageWidth = (availableWidth - 10) / imagesPerRow;
        const imageHeight = 60;
        const imageSpacing = 5;

        let imageIndex = 0;
        let rowStartY = yPosition;

        for (const imgSrc of propertyImages) {
          const col = imageIndex % imagesPerRow;
          const row = Math.floor(imageIndex / imagesPerRow);

          // Check if we need a new page
          if (rowStartY + (row * (imageHeight + imageSpacing)) > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
            rowStartY = yPosition;
            imageIndex = 0;
            
            // Add property title on new page
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(17, 24, 39);
            pdf.text(normalizeTurkish(property.title.substring(0, 50) + '...'), pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;
            rowStartY = yPosition;
          }

          const xPos = margin + col * (imageWidth + imageSpacing);
          const yPos = rowStartY + row * (imageHeight + imageSpacing);

          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imgSrc;

            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 3000);
            });

            if (img.complete && img.naturalHeight !== 0) {
              // Add white background
              pdf.setFillColor(255, 255, 255);
              pdf.roundedRect(xPos, yPos, imageWidth, imageHeight, 2, 2, 'F');
              
              // Add image
              pdf.addImage(img, 'JPEG', xPos + 2, yPos + 2, imageWidth - 4, imageHeight - 4, undefined, 'FAST');
              
              // Add border
              pdf.setDrawColor(229, 231, 235);
              pdf.setLineWidth(0.5);
              pdf.roundedRect(xPos, yPos, imageWidth, imageHeight, 2, 2, 'S');
            }
          } catch (e) {
            // Placeholder
            pdf.setFillColor(243, 244, 246);
            pdf.roundedRect(xPos, yPos, imageWidth, imageHeight, 2, 2, 'F');
          }

          imageIndex++;
        }

        // Store name at bottom
        const propertyStore = stores.find((s) => s.id === property.storeId);
        if (propertyStore) {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(107, 114, 128);
          pdf.text(normalizeTurkish(`Satici: ${propertyStore.name}`), pageWidth / 2, pageHeight - 20, { align: 'center' });
        }

        // Footer
        pdf.setFontSize(7);
        pdf.setTextColor(156, 163, 175);
        pdf.text(
          normalizeTurkish(`Bu rapor ${new Date().toLocaleDateString('tr-TR')} tarihinde iremworld.com uzerinden olusturulmustur.`),
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save
      pdf.save(`ilan-karsilastirma-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const getPropertyCover = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return `https://source.unsplash.com/400x300/?real-estate&sig=${property.id}`;
  };

  const handleCategoryMainSelect = (main?: PropertyCategory['main']) => {
    if (!main) {
      updateFilters({ category: undefined });
      return;
    }

    updateFilters({
      category: {
        main,
        sub: filters.category?.sub ?? '',
      } as PropertyCategory,
    });
  };

  const activeFilterCount = useMemo(() => {
    const flags = [
      Boolean(filters.category?.main),
      Boolean(filters.category?.sub),
      typeof filters.minPrice === 'number',
      typeof filters.maxPrice === 'number',
      Boolean(filters.rooms),
      typeof filters.minSize === 'number',
      typeof filters.maxSize === 'number',
      Boolean(filters.kitchenType),
      Boolean(filters.heatingType),
      Boolean(filters.hasCarPark),
      Boolean(filters.hasElevator),
      Boolean(filters.isFurnished),
      Boolean(filters.hasBalcony),
      Boolean(selectedCountry),
      Boolean(selectedCity),
      Boolean(transactionType),
    ];

    return flags.filter(Boolean).length;
  }, [filters, selectedCountry, selectedCity, transactionType]);
  const hasActiveFilters = activeFilterCount > 0;

  // Client-side filtreleme (her değişiklikte yeniden hesapla)
  useEffect(() => {
    let filtered = [...countryProperties];

    // Şehir filtresi
    if (selectedCity) {
      const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const searchCity = normalize(selectedCity);
      
      filtered = filtered.filter(p => 
        p.location?.city && normalize(p.location.city) === searchCity
      );
    }

    // Satılık/Kiralık filtresi
    if (transactionType) {
      filtered = filtered.filter(p => p.type === transactionType);
    }

    // Kategori filtresi
    if (filters.category?.main) {
      filtered = filtered.filter(p => p.category?.main === filters.category?.main);
    }

    if (filters.category?.sub) {
      filtered = filtered.filter(p => p.category?.sub === filters.category?.sub);
    }

    if (typeof filters.minPrice === 'number') {
      filtered = filtered.filter(p => p.price >= (filters.minPrice as number));
    }

    if (typeof filters.maxPrice === 'number') {
      filtered = filtered.filter(p => p.price <= (filters.maxPrice as number));
    }

    if (filters.rooms) {
      filtered = filtered.filter(p => p.specs?.rooms === filters.rooms);
    }

    if (typeof filters.minSize === 'number') {
      filtered = filtered.filter(p => (p.specs?.netSize || 0) >= (filters.minSize as number));
    }

    if (typeof filters.maxSize === 'number') {
      filtered = filtered.filter(p => (p.specs?.netSize || 0) <= (filters.maxSize as number));
    }

    if (filters.kitchenType) {
      filtered = filtered.filter(p => p.interiorFeatures?.kitchenType === filters.kitchenType);
    }

    if (filters.heatingType) {
      filtered = filtered.filter(p => p.specs?.heating === filters.heatingType);
    }

    if (filters.hasCarPark) {
      filtered = filtered.filter(p => p.buildingFeatures?.hasCarPark);
    }

    if (filters.hasElevator) {
      filtered = filtered.filter(p => p.buildingFeatures?.hasElevator);
    }

    if (filters.hasBalcony) {
      filtered = filtered.filter(p => p.exteriorFeatures?.hasBalcony);
    }

    if (filters.isFurnished) {
      filtered = filtered.filter(p => p.specs?.furnishing && p.specs.furnishing !== 'Unfurnished');
    }

    setFilteredProperties(filtered);
  }, [countryProperties, selectedCity, transactionType, filters]);

  useEffect(() => {
    if (filteredProperties.length === 0) {
      setSelectedPropertyId(null);
      return;
    }

    setSelectedPropertyId((prev) => {
      if (prev && filteredProperties.some((property) => property.id === prev)) {
        return prev;
      }
      return filteredProperties[0].id;
    });
  }, [filteredProperties]);


  const handleMapPropertySelect = useCallback((property: Property) => {
    setSelectedPropertyId(property.id);
  }, [setSelectedPropertyId]);

  const handleCardMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>, propertyId: string, totalImages: number) => {
    if (totalImages <= 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const relativeX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const ratio = relativeX / rect.width;
    const nextIndex = Math.min(totalImages - 1, Math.floor(ratio * totalImages));
    setHoverImageIndex(prev => {
      if (prev[propertyId] === nextIndex) return prev;
      return {
        ...prev,
        [propertyId]: nextIndex,
      };
    });
  }, []);

  const handleCardMouseEnter = useCallback((propertyId: string) => {
    setHoveredPropertyId(propertyId);
    setHoverImageIndex(prev => ({
      ...prev,
      [propertyId]: 0,
    }));
  }, []);

  const handleCardMouseLeave = useCallback((propertyId: string) => {
    setHoveredPropertyId(prev => (prev === propertyId ? null : prev));
    setHoverImageIndex(prev => {
      if (!(propertyId in prev)) return prev;
      const { [propertyId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const selectedProperty = useMemo(() => {
    if (!filteredProperties.length) {
      return null;
    }

    if (selectedPropertyId) {
      return filteredProperties.find((property) => property.id === selectedPropertyId) ?? filteredProperties[0];
    }

    return filteredProperties[0];
  }, [filteredProperties, selectedPropertyId]);

  const selectedPropertyInCompare = selectedProperty ? compareIdSet.has(selectedProperty.id) : false;
  const selectedCompareDisabled = selectedProperty
    ? !selectedPropertyInCompare && compareList.length >= maxCompareSelectable
    : false;
  const floatingStackVisible = Boolean(selectedProperty) || compareTrayVisible;

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      {/* Header Bilgi Çubuğu */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gayrimenkul Haritası
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedCountry ? (
                  <>
                    <span className="font-medium">
                      {getCountryName(selectedCountry)}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-primary-600">
                      {filteredProperties.length} ilan
                    </span>
                    {countryProperties.length > filteredProperties.length && (
                      <span className="text-gray-500">
                        {' '}/ {countryProperties.length} toplam
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">Harita üzerinde gezinin veya ülke seçin</span>
                )}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
          </div>
        </div>
      </div>

      {/* Harita + Yan Liste */}
      <div className="h-[calc(100vh-120px)] flex">
        {/* Sol: Harita */}
        <div className="flex-1 relative">
          {hasActiveFilters && (
            <div className="pointer-events-none absolute left-4 top-4 z-20 hidden lg:flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg backdrop-blur">
              <span>{activeFilterCount} aktif filtre</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  resetAllFilters();
                }}
                className="pointer-events-auto rounded-full bg-gray-900/90 px-3 py-1 text-xs font-semibold text-white transition hover:bg-gray-900"
              >
                Sıfırla
              </button>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600">İlanlar yükleniyor...</p>
              </div>
            </div>
          )}
          <PropertyMapView
            key={`map-${selectedCountry || "all"}-${selectedCity || "all"}-${transactionType || "all"}-${filters.category?.main || "all"}-${filteredProperties.length}`}
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={handleMapPropertySelect}
            onQuickViewRequest={(property) => handleQuickViewOpen(property)}
            showSelectedCard={false}
            focusOffset={mapFocusOffset}
            className="rounded-none"
          />
        </div>

  {/* Sağ: Modern İlan Listesi + Filtreler - Sadece desktop'ta görünsün */}
  <div className="hidden lg:block w-[600px] xl:w-[680px] bg-gradient-to-b from-gray-50 to-white backdrop-blur-xl border-l border-gray-200/50 overflow-y-auto">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-xl border-b border-gray-200/50 p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">İlanlar</h2>
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <span>{filteredProperties.length} sonuç bulundu</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {activeFilterCount} aktif filtre
                    </span>
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {filteredProperties.length}
                </span>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  key="filter-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-4">
                    {/* Transaction Type Toggle */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('type', 'sale');
                          router.push(`/property?${params.toString()}`);
                        }}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                          transactionType === 'sale'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        Satılık
                      </button>
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('type', 'rent');
                          router.push(`/property?${params.toString()}`);
                        }}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                          transactionType === 'rent'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        Kiralık
                      </button>
                    </div>

                    {/* Country & City Filters */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Ülke
                        </label>
                        <Select<CountryOption>
                          instanceId="country-select"
                          value={allCountries.find(c => c.value === selectedCountry) || null}
                          onChange={(option) => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (option) {
                              params.set('country', option.value);
                            } else {
                              params.delete('country');
                            }
                            params.delete('city'); // Ülke değişince şehri temizle
                            router.push(`/property?${params.toString()}`);
                          }}
                          options={allCountries}
                          components={{
                            Option: CustomOption,
                            SingleValue: CustomSingleValue
                          }}
                          isClearable
                          placeholder="Ülke seçin..."
                          className="text-sm"
                          classNamePrefix="select"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor: state.isFocused ? '#38bdf8' : '#e2e8f0',
                              boxShadow: state.isFocused ? '0 0 0 2px rgba(56,189,248,0.35)' : 'none',
                              backgroundColor: 'rgba(15,23,42,0.04)',
                              '&:hover': { borderColor: '#38bdf8' },
                              minHeight: '42px',
                              transition: 'all 150ms ease'
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontWeight: 600,
                              color: '#0f172a'
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#64748b'
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                ? 'rgba(56,189,248,0.85)'
                                : state.isFocused
                                ? 'rgba(56,189,248,0.12)'
                                : 'white',
                              color: state.isSelected ? 'white' : '#0f172a',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              margin: '4px'
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 60,
                              borderRadius: 16,
                              padding: 6,
                              boxShadow: '0 18px 40px rgba(15,23,42,0.12)'
                            }),
                            menuList: (base) => ({
                              ...base,
                              borderRadius: 16
                            })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Şehir
                        </label>
                        <Select
                          instanceId="city-select"
                          value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
                          onChange={(option) => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (option) {
                              params.set('city', option.value);
                            } else {
                              params.delete('city');
                            }
                            router.push(`/property?${params.toString()}`);
                          }}
                          options={cityOptions}
                          isClearable
                          isDisabled={!selectedCountry || cityOptions.length === 0}
                          placeholder={selectedCountry ? (cityOptions.length ? 'Şehir seçin...' : 'Şehir verisi yok') : 'Önce ülke seçin'}
                          className="text-sm"
                          classNamePrefix="select"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor: state.isFocused ? '#38bdf8' : '#e2e8f0',
                              boxShadow: state.isFocused ? '0 0 0 2px rgba(56,189,248,0.35)' : 'none',
                              backgroundColor: 'rgba(15,23,42,0.04)',
                              '&:hover': { borderColor: '#38bdf8' }
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontWeight: 600,
                              color: '#0f172a'
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#64748b'
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                ? 'rgba(56,189,248,0.85)'
                                : state.isFocused
                                ? 'rgba(56,189,248,0.12)'
                                : 'white',
                              color: state.isSelected ? 'white' : '#0f172a',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              margin: '4px'
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 60,
                              borderRadius: 16,
                              padding: 6,
                              boxShadow: '0 18px 40px rgba(15,23,42,0.12)'
                            }),
                            menuList: (base) => ({
                              ...base,
                              borderRadius: 16
                            })
                          }}
                        />
                        {!selectedCountry && (
                          <p className="text-[11px] text-gray-400">Önce ülke seçerek şehirleri filtreleyin.</p>
                        )}
                      </div>
                    </div>

                    {/* Category Filters */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Kategori
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['government', 'residential', 'commercial'].map((cat) => {
                          const isActive = filters.category?.main === cat;
                          const labels = {
                            government: 'Devlet',
                            residential: 'Konut',
                            commercial: 'Ticari'
                          };
                          
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('category', JSON.stringify({ main: cat }));
                                router.push(`/property?${params.toString()}`);
                              }}
                              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                                isActive
                                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200'
                              }`}
                            >
                              {labels[cat as keyof typeof labels]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary-500">Detaylı Filtreler</p>
                          <p className="text-xs text-gray-500">Veri setine göre otomatik güncellenir</p>
                        </div>
                        <span className="text-[11px] text-gray-400">{countryProperties.length} ilan inceleniyor</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Emlak Kategorisi</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleCategoryMainSelect(undefined)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                filters.category?.main
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-primary-600 text-white shadow'
                              }`}
                            >
                              Tüm Kategoriler
                            </button>
                            {derivedFilterOptions.categories.map(categoryName => {
                              const isActive = filters.category?.main === categoryName;
                              return (
                                <button
                                  key={categoryName}
                                  type="button"
                                  onClick={() => handleCategoryMainSelect(categoryName as PropertyCategory['main'])}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                                    isActive
                                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {categoryName}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fiyat Aralığı (₺)</p>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={filters.minPrice ?? ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  updateFilters({ minPrice: value ? Number(value) : undefined });
                                }}
                                placeholder={derivedFilterOptions.priceRange.min ? `Min ${new Intl.NumberFormat('tr-TR').format(derivedFilterOptions.priceRange.min)}` : 'Min fiyat'}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                              />
                              <input
                                type="number"
                                inputMode="numeric"
                                value={filters.maxPrice ?? ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  updateFilters({ maxPrice: value ? Number(value) : undefined });
                                }}
                                placeholder={derivedFilterOptions.priceRange.max ? `Max ${new Intl.NumberFormat('tr-TR').format(derivedFilterOptions.priceRange.max)}` : 'Max fiyat'}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                              />
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Oda Sayısı</p>
                            <select
                              value={filters.rooms ?? ''}
                              onChange={(event) => updateFilters({ rooms: event.target.value || undefined })}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            >
                              <option value="">Seçiniz</option>
                              {derivedFilterOptions.rooms.map(room => (
                                <option key={room} value={room}>{room}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Metrekare</p>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={filters.minSize ?? ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  updateFilters({ minSize: value ? Number(value) : undefined });
                                }}
                                placeholder={derivedFilterOptions.sizeRange.min ? `Min ${derivedFilterOptions.sizeRange.min} m²` : 'Min m²'}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                              />
                              <input
                                type="number"
                                inputMode="numeric"
                                value={filters.maxSize ?? ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  updateFilters({ maxSize: value ? Number(value) : undefined });
                                }}
                                placeholder={derivedFilterOptions.sizeRange.max ? `Max ${derivedFilterOptions.sizeRange.max} m²` : 'Max m²'}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                              />
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mutfak Tipi</p>
                            <select
                              value={filters.kitchenType ?? ''}
                              onChange={(event) => updateFilters({ kitchenType: event.target.value || undefined })}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            >
                              <option value="">Seçiniz</option>
                              {derivedFilterOptions.kitchenTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Isıtma Tipi</p>
                            <select
                              value={filters.heatingType ?? ''}
                              onChange={(event) => updateFilters({ heatingType: event.target.value || undefined })}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            >
                              <option value="">Seçiniz</option>
                              {derivedFilterOptions.heatingTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Özellikler</p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { key: 'hasCarPark', label: 'Otopark' },
                              { key: 'hasElevator', label: 'Asansör' },
                              { key: 'isFurnished', label: 'Eşyalı' },
                              { key: 'hasBalcony', label: 'Balkon' },
                            ].map(feature => {
                              const availability = (derivedFilterOptions.features as Record<string, number>)[feature.key];
                              if (!availability) {
                                return null;
                              }
                              const isActive = Boolean((filters as any)[feature.key]);
                              return (
                                <button
                                  key={feature.key}
                                  type="button"
                                  onClick={() => updateFilters({ [feature.key]: isActive ? undefined : true } as any)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                                    isActive
                                      ? 'bg-primary-600 text-white border-primary-600 shadow'
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200'
                                  }`}
                                >
                                  {feature.label}
                                  <span className="ml-1 text-[10px] font-normal opacity-70">({availability})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {(transactionType || filters.category || selectedCountry || selectedCity || activeFilterCount > 0) && (
                      <button
                        onClick={resetAllFilters}
                        className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Filtreleri Temizle
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setFiltersOpen(prev => !prev)}
              className={`w-full flex items-center justify-between rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                filtersOpen
                  ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                  : 'border-primary-200 text-primary-700 bg-primary-50 shadow'
              }`}
            >
              <span>{filtersOpen ? 'Filtreleri Gizle' : 'Detaylı Filtreleri Göster'}</span>
              <motion.span
                animate={filtersOpen ? { rotate: 0, y: 0 } : { rotate: 180, y: [0, -4, 0] }}
                transition={filtersOpen ? { duration: 0.25 } : { duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
              >
                ↓
              </motion.span>
            </motion.button>
          </div>
          
          {/* Liste */}
          <div className="p-4">
            {showListSkeleton ? (
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`property-skeleton-${index}`}
                    className="rounded-3xl border border-gray-200 bg-white/80 p-3.5 shadow-sm"
                  >
                    <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200/80 animate-pulse" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-3/4 rounded-full bg-gray-200/80 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-gray-200/70 animate-pulse" />
                      <div className="h-10 w-full rounded-2xl bg-gray-200/70 animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-5 flex-1 rounded-full bg-gray-200/70 animate-pulse" />
                        <div className="h-5 flex-1 rounded-full bg-gray-200/70 animate-pulse" />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="h-6 flex-1 rounded-full bg-gray-200/70 animate-pulse" />
                        <div className="h-6 flex-1 rounded-full bg-gray-200/70 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-16 px-6 bg-white/70">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">İlan bulunamadı</p>
                <p className="text-sm text-gray-500 text-center">
                  Farklı filtreler deneyerek arama yapabilirsiniz
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {filteredProperties.map((property) => {
                  const fallbackImage = `https://source.unsplash.com/400x300/?real-estate&sig=${property.id}`;
                  const propertyImages = property.images?.length ? property.images : [fallbackImage];
                  const totalImages = propertyImages.length;
                  const currentImageIndex = hoverImageIndex[property.id] ?? 0;
                  const activeImageSrc = propertyImages[Math.min(currentImageIndex, totalImages - 1)] || propertyImages[0];
                  const hasMultipleImages = totalImages > 1;
                  const isHovered = hoveredPropertyId === property.id;
                  const slideProgress = hasMultipleImages
                    ? Math.min(100, ((currentImageIndex + 1) / totalImages) * 100)
                    : 100;
                  const detailTags: string[] = [];
                  const propertyStore = property.storeId ? storesById[property.storeId] : undefined;

                  if (property.specs.rooms) detailTags.push(`${property.specs.rooms} Oda`);
                  if (property.specs.netSize) detailTags.push(`${property.specs.netSize} m²`);
                  if (property.specs.bathrooms) detailTags.push(`${property.specs.bathrooms} Banyo`);

                  const isActive = property.id === selectedPropertyId;
                  const formattedPrice = compactPriceFormatter.format(property.price);
                  const isInCompare = compareIdSet.has(property.id);
                  const compareButtonDisabled = !isInCompare && compareList.length >= maxCompareSelectable;

                  return (
                    <div
                      key={property.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleMapPropertySelect(property)}
                      onMouseEnter={() => {
                        handleMapPropertySelect(property);
                        handleCardMouseEnter(property.id);
                      }}
                      onMouseMove={(event) => handleCardMouseMove(event, property.id, totalImages)}
                      onMouseLeave={() => handleCardMouseLeave(property.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleMapPropertySelect(property);
                        }
                      }}
                      className={`group h-full rounded-3xl border p-3.5 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white ${
                        isActive
                          ? 'border-primary-400 bg-primary-50/80 shadow-lg shadow-primary-200/60'
                          : 'border-gray-200 bg-white/80 hover:border-primary-300/80 hover:shadow-lg'
                      }`}
                    >
                      <article className="flex h-full flex-col gap-3">
                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
                          <img
                            src={activeImageSrc}
                            alt={property.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            aria-pressed={isInCompare}
                            title="İlanı karşılaştır"
                            disabled={compareButtonDisabled}
                            onClick={(event) => handleCompareToggle(property, event)}
                            className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm transition ${
                              isInCompare
                                ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                                : compareButtonDisabled
                                ? 'cursor-not-allowed bg-white/30 text-gray-400'
                                : 'bg-white/85 text-gray-900 hover:bg-white'
                            }`}
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h-4v16h4m10-8h-8m8-6h-8m8 12h-8" />
                            </svg>
                            <span>{isInCompare ? 'Seçildi' : 'Karşılaştır'}</span>
                          </button>
                          {hasMultipleImages && isHovered && (
                            <>
                              <div className="pointer-events-none absolute inset-x-3 bottom-3 space-y-1">
                                <div className="flex items-center justify-between rounded-full bg-gray-900/65 px-3 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur">
                                  <span className="uppercase tracking-[0.3em] text-[9px] text-white/70">Görsel</span>
                                  <span>
                                    {String(currentImageIndex + 1).padStart(2, '0')}
                                    <span className="mx-1 text-white/40">/</span>
                                    {String(totalImages).padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary-300 via-primary-200 to-white transition-all duration-300"
                                    style={{ width: `${slideProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          )}
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary-400/70 pointer-events-none"></div>
                          )}
                          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-600 shadow-sm">
                            {property.type === "sale" ? "Satılık" : "Kiralık"}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <h3
                            className={`text-sm font-semibold leading-tight ${
                              isActive ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-600'
                            }`}
                          >
                            {property.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {property.location.city}, {getCountryName(property.location.country)}
                          </p>
                          <div
                            className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm ${
                              isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-900/5 text-gray-900'
                            }`}
                          >
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                              Fiyat
                            </span>
                            <span className="font-semibold">
                              {formattedPrice} ₺
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {detailTags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={`${property.id}-${idx}`}
                                className="rounded-full bg-gray-100/80 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {propertyStore && (
                            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white/80 px-2.5 py-1.5 text-[11px] text-gray-600">
                              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                                {propertyStore.logo ? (
                                  <img
                                    src={propertyStore.logo}
                                    alt={propertyStore.name}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-gray-400">
                                    {propertyStore.name?.slice(0, 2)?.toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/store/${propertyStore.slug}`}
                                  onClick={(event) => event.stopPropagation()}
                                  className="block font-semibold text-gray-800 hover:text-primary-600"
                                >
                                  {propertyStore.name}
                                </Link>
                                <p className="text-[10px] text-gray-400">
                                  {propertyStore.contact?.city || propertyStore.contact?.country}
                                  {propertyStore.specialties?.length ? ` • ${propertyStore.specialties[0]}` : ''}
                                </p>
                              </div>
                              {propertyStore.verified && (
                                <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          )}
                          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={(event) => handleQuickViewOpen(property, event)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-100"
                            >
                              Hızlı Görüntüle
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 12h16M4 16h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini İlan Kartı - Harita üzerinde seçili property için */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            key="selected-property-card"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4 pb-6 sm:bottom-8 sm:pb-7 lg:bottom-10 lg:pb-9"
            style={{ 
              marginBottom: compareTrayVisible ? '160px' : '0px',
              transition: 'margin-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgb(0,0,0,0.15)] hover:-translate-y-1">
              <div className="flex gap-0">
                <div className="relative w-1/2 overflow-hidden bg-gray-100/80 group">
                  <img
                    src={selectedProperty.images?.[0] || `https://source.unsplash.com/400x300/?real-estate&sig=${selectedProperty.id}`}
                    alt={selectedProperty.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex w-1/2 flex-col gap-2.5 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-600">
                      {selectedProperty.type === "sale" ? "Satılık" : "Kiralık"}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold leading-tight text-gray-900">
                    {selectedProperty.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{selectedProperty.location.city}, {getCountryName(selectedProperty.location.country)}</span>
                  </div>
                  <div className="mt-auto pt-2">
                    <div className="mb-3 flex items-baseline gap-1">
                      <span className="text-xl font-bold tracking-tight text-gray-900">
                        {fullPriceFormatter.format(selectedProperty.price)}
                      </span>
                      <span className="text-sm font-medium text-gray-500">₺</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleQuickViewOpen(selectedProperty, event);
                        }}
                        className="flex-1 rounded-full bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Görüntüle
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleCompareToggle(selectedProperty, event)}
                        disabled={selectedCompareDisabled}
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all active:scale-[0.95] ${
                          selectedPropertyInCompare
                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                            : selectedCompareDisabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedPropertyInCompare ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Karşılaştırma Kartları - Alt Sticky Bar */}
      <AnimatePresence>
        {compareTrayVisible && (
          <motion.div
            key="compare-tray"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-[70] border-t border-gray-200/80 bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Karşılaştırma Listesi ({compareList.length}/{maxCompareSelectable})
                    </h3>
                    {compareHint && (
                      <motion.span
                        key={compareHint}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-xs text-gray-500"
                      >
                        {compareHint}
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{compareHelper}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCompareModalOpen}
                    disabled={!comparisonReady}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      comparisonReady
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                    }`}
                  >
                    Karşılaştır
                  </button>
                  <button
                    type="button"
                    onClick={handleCompareClear}
                    className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    Temizle
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {compareList.map((property) => (
                  <div
                    key={property.id}
                    className="relative flex min-w-[200px] items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 p-2 shadow-sm"
                  >
                    <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={getPropertyCover(property)}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{property.title}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {property.location.city}, {getCountryName(property.location.country)}
                      </p>
                      <p className="text-xs font-semibold text-primary-600">
                        {compactPriceFormatter.format(property.price)} ₺
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCompareRemove(property.id)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && quickViewProperty && (
          <motion.div
            key="quickview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
            onClick={handleQuickViewClose}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleQuickViewClose}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 backdrop-blur-xl text-white transition-all hover:bg-black/20 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Gallery - Fixed */}
              <div className="relative aspect-[16/10] bg-gray-900 flex-shrink-0">
                <img
                  src={quickViewImageSrc}
                  alt={quickViewProperty.title}
                  className="h-full w-full object-cover"
                />
                {totalQuickViewImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handleQuickViewPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95"
                    >
                      <svg className="h-4 w-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickViewNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95"
                    >
                      <svg className="h-4 w-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white">
                      {quickViewImageIndex + 1} / {totalQuickViewImages}
                    </div>
                  </>
                )}
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-600">
                      {quickViewProperty.type === "sale" ? "Satılık" : "Kiralık"}
                    </span>
                    <h2 className="mt-3 text-xl font-bold text-gray-900 leading-tight">{quickViewProperty.title}</h2>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{quickViewLocationLabel}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fiyat</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{quickViewPriceLabel}</span>
                      <span className="text-sm font-semibold text-gray-500">₺</span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {quickViewProperty.specs.rooms && (
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <div className="text-2xl font-bold text-gray-900">{quickViewProperty.specs.rooms}</div>
                      <div className="mt-1 text-xs text-gray-600 font-medium">Oda</div>
                    </div>
                  )}
                  {quickViewProperty.specs.bathrooms && (
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <div className="text-2xl font-bold text-gray-900">{quickViewProperty.specs.bathrooms}</div>
                      <div className="mt-1 text-xs text-gray-600 font-medium">Banyo</div>
                    </div>
                  )}
                  {quickViewProperty.specs.netSize && (
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <div className="text-2xl font-bold text-gray-900">{quickViewProperty.specs.netSize}</div>
                      <div className="mt-1 text-xs text-gray-600 font-medium">m²</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {quickViewProperty.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900">Açıklama</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">{quickViewProperty.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (quickViewProperty) {
                          const tempProperty = quickViewProperty;
                          handleQuickViewClose();
                          setTimeout(() => {
                            setCompareList([tempProperty]);
                            handleExportPDF();
                          }, 100);
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-red-600 to-red-700 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF İndir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (quickViewProperty) {
                          const tempProperty = quickViewProperty;
                          handleQuickViewClose();
                          setTimeout(() => {
                            setCompareList([tempProperty]);
                            handlePrint();
                          }, 100);
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all hover:border-slate-900/30 hover:bg-slate-50 active:scale-[0.98]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Yazdır
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={generatePropertyUrl(quickViewProperty)}
                      className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
                    >
                      Detaylı İncele
                    </Link>
                    <button
                      type="button"
                      onClick={(event) => handleCompareToggle(quickViewProperty, event)}
                      className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        compareIdSet.has(quickViewProperty.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {compareIdSet.has(quickViewProperty.id) ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Karşılaştırma Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div
            key="compare-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={handleCompareModalClose}
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-5xl rounded-2xl bg-white shadow-xl overflow-hidden"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">İlan Karşılaştırma</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{compareList.length} ilan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-b from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow active:scale-95"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF İndir
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Yazdır
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          // Save comparison and get shareable link
                          const response = await fetch('/api/comparisons', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              propertyIds: compareList.map(p => p.id)
                            })
                          });

                          if (!response.ok) throw new Error('Failed to save comparison');

                          const { id, url } = await response.json();
                          const shareUrl = `${window.location.origin}${url}`;
                          const shareTitle = 'İlan Karşılaştırma - IREMWORLD';
                          const shareText = `${compareList.length} ilanı karşılaştır: ${compareList.map(p => p.title).slice(0, 2).join(', ')}...`;

                          // Native share API - supports WhatsApp, Instagram, SMS, etc.
                          if (navigator.share) {
                            try {
                              await navigator.share({
                                title: shareTitle,
                                text: shareText,
                                url: shareUrl
                              });
                            } catch (err) {
                              // User cancelled
                              if ((err as Error).name !== 'AbortError') {
                                throw err;
                              }
                            }
                          } else {
                            // Fallback: Copy to clipboard
                            await navigator.clipboard.writeText(shareUrl);
                            alert('Karşılaştırma linki kopyalandı!\n\n' + shareUrl + '\n\nBu linki WhatsApp, Instagram, SMS veya istediğiniz platformda paylaşabilirsiniz.');
                          }
                        } catch (error) {
                          console.error('Share error:', error);
                          alert('Paylaşım sırasında bir hata oluştu.');
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Paylaş
                    </button>
                    <button
                      type="button"
                      onClick={handleCompareModalClose}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div id="comparison-content" className="max-h-[70vh] overflow-auto p-6 bg-white">
                  {/* PDF Header - Only visible in PDF */}
                  <div className="hidden print:block mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">İlan Karşılaştırma Raporu</h1>
                    <p className="text-sm text-gray-600 mt-2">
                      Tarih: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Karşılaştırılan İlan Sayısı: {compareList.length}
                    </p>
                  </div>

                  <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
                    {/* Header Row */}
                    <div></div>
                    {compareList.map((property) => {
                      const propertyStore = stores.find((s) => s.id === property.storeId);
                      return (
                        <div key={property.id} className="space-y-3">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={getPropertyCover(property)}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900">{property.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{property.location.city}</p>
                            {propertyStore && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1.5">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium truncate">{propertyStore.name}</span>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCompareRemove(property.id)}
                            className="w-full text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Çıkar
                          </button>
                        </div>
                      );
                    })}

                    {/* Comparison Rows */}
                    {comparisonMetricConfig.map((metric) => (
                      <React.Fragment key={metric.key}>
                        <div className="py-3 border-t border-gray-100">
                          <div className="font-medium text-sm text-gray-900">{metric.label}</div>
                          {metric.helper && <div className="text-xs text-gray-500 mt-0.5">{metric.helper}</div>}
                        </div>
                        {compareList.map((property) => (
                          <div key={property.id} className="py-3 border-t border-gray-100 text-sm text-gray-700">
                            {metric.render(property)}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCompareClear}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Listeyi Temizle
                  </button>
                  <button
                    type="button"
                    onClick={handleCompareModalClose}
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function PropertyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <PropertyContent />
    </Suspense>
  );
}
