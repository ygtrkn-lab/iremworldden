
export type PropertyType = "sale" | "rent";

// Sahibinden.com tarzı detaylı kategori yapısı
export type PropertyMainCategory = 
  | "Konut"
  | "İş Yeri"
  | "Devlet"
  | "Arsa"
  | "Bina"
  | "Turistik Tesis"
  | "Devremülk";

export type PropertyCategory = {
  main: PropertyMainCategory;
  sub: string;  // Alt kategori (örn: "Daire", "Villa", "Ofis", vs)
};

// Sahibinden.com tarzı detaylı özellik tipleri
export type RoomType = 
  | "Stüdyo"
  | "1+0" | "1+1" 
  | "2+0" | "2+1" 
  | "3+1" | "3+2" 
  | "4+1" | "4+2" 
  | "5+1" | "5+2"
  | "6+ Oda";

export type HeatingType =
  | "Kombi Doğalgaz"
  | "Merkezi Doğalgaz"
  | "Yerden Isıtma"
  | "Merkezi (Pay Ölçer)"
  | "Klima"
  | "Şömine"
  | "Soba"
  | "Isıtma Yok";

export type UsageStatus =
  | "Boş"
  | "Kiracılı"
  | "Mülk Sahibi"
  | "Yeni Yapılmış";

export type DeedStatus =
  | "Kat Mülkiyeti"
  | "Kat İrtifakı"
  | "Arsa Tapulu"
  | "Hisseli Tapu"
  | "Müstakil Tapulu";

export type ZoningStatus =
  | "Ada"
  | "A-Lejantlı"
  | "Arazi"
  | "Bağ & Bahçe"
  | "Depo & Antrepo"
  | "Eğitim"
  | "Enerji Depolama"
  | "Konut"
  | "Kültürel Tesis"
  | "Muhtelif"
  | "Özel Kullanım"
  | "Sağlık"
  | "Sanayi"
  | "Sera"
  | "Sit Alanı"
  | "Spor Alanı"
  | "Tarla"
  | "Tarla + Bağ"
  | "Ticari"
  | "Ticari + Konut"
  | "Toplu Konut"
  | "Turizm"
  | "Turizm + Konut"
  | "Turizm + Ticari"
  | "Villa"
  | "Zeytinlik"
  | "İmarlı"
  | "Ticari İmarlı"
  | "Konut İmarlı"
  | "Sanayi İmarlı"
  | "Turizm İmarlı"
  | "Belirtilmemiş";

export type CreditEligibility =
  | "Uygun"
  | "Uygun Değil"
  | "Bilinmiyor";

export type FromWho =
  | "Sahibinden"
  | "Emlak Ofisinden"
  | "Bankadan"
  | "Müteahhitten"
  | "Belediyeden";
export type PropertyView = "grid" | "list" | "map";
export type FurnishingStatus = "Furnished" | "Unfurnished" | "Partially Furnished";
export type SortOption = "price_asc" | "price_desc" | "newest" | "size_desc";

export interface PropertyFilters {
  category?: PropertyCategory;
  propertyType?: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: string;
  minSize?: number;
  maxSize?: number;
  furnishing?: string;
  hasParking?: boolean;
  hasCarPark?: boolean;
  hasElevator?: boolean;
  isFurnished?: boolean;
  heating?: string;
  bathrooms?: number;
  buildingAge?: string;
  heatingType?: string;
  features?: string[];
  hasBalcony?: boolean;
  balconyCount?: number;
  search?: string;
  kitchenType?: string;
  usageStatus?: string;
  inSite?: boolean;
  creditEligible?: boolean;
  deedStatus?: string;
  fromWho?: string;
  exchangeAvailable?: boolean;
  minGrossArea?: number;
  maxGrossArea?: number;
  minNetArea?: number;
  maxNetArea?: number;
  maxMonthlyFee?: number;
}

export interface PanoramicImage {
  url: string;
  title: string;
  hotspots?: Array<{
    text: string;
    yaw: number;
    pitch: number;
  }>;
}

export interface Property {
  id: string;
  type: PropertyType;
  category: PropertyCategory;
  title: string;
  slug?: string;
  description: string;
  price: number;
  
  // Store/Mağaza bağlantısı
  storeId?: string;  // stores.json'daki mağaza ID'si
  
  // Konum bilgileri - Sahibinden.com tarzı
  location: {
    country: string;
    state?: string | null;
    city: string;
    district?: string;
    neighborhood?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Temel özellikler - Sahibinden.com tarzı
  specs: {
    netSize: number;        // Net m² (Sahibinden'de ana alan)
    grossSize?: number;     // Brüt m² 
    rooms: RoomType;        // Oda sayısı (1+1, 2+1, vs)
    bathrooms: number;      // Banyo sayısı
    age: number;           // Bina yaşı
    floor?: number;        // Bulunduğu kat
    totalFloors?: number;  // Toplam kat sayısı
    heating: HeatingType;  // Isıtma tipi
    furnishing: FurnishingStatus;
    balconyCount?: number; // Balkon sayısı
  };
  
  // İç özellikler - Sahibinden.com tarzı
  interiorFeatures: {
    kitchenType: "Açık" | "Kapalı" | "Amerikan";
    hasBuiltInKitchen: boolean;    // Ankastre mutfak
    hasBuiltInWardrobe: boolean;   // Gömme dolap
    hasLaminate: boolean;          // Laminat
    hasParquet: boolean;           // Parke
    hasCeramic: boolean;           // Seramik
    hasMarble: boolean;            // Mermer
    hasWallpaper: boolean;         // Duvar kağıdı
    hasPaintedWalls: boolean;      // Boyalı
    hasSpotLighting: boolean;      // Spot aydınlatma
    hasHiltonBathroom: boolean;    // Hilton banyo
    hasJacuzzi: boolean;           // Jakuzi
    hasShowerCabin: boolean;       // Duşakabin
    hasAmericanDoor: boolean;      // Amerikan kapı
    hasSteelDoor: boolean;         // Çelik kapı
    hasIntercom: boolean;          // Görüntülü diafon
  };
  
  // Dış özellikler - Sahibinden.com tarzı
  exteriorFeatures: {
    hasBalcony: boolean;
    hasTerrace: boolean;           // Teras
    hasGarden: boolean;            // Bahçe
    hasGardenUse: boolean;         // Bahçe kullanımı
    hasSeaView: boolean;           // Deniz manzarası
    hasCityView: boolean;          // Şehir manzarası
    hasNatureView: boolean;        // Doğa manzarası
    hasPoolView: boolean;          // Havuz manzarası
    facade: "Kuzey" | "Güney" | "Doğu" | "Batı" | "Güneydoğu" | "Güneybatı" | "Kuzeydoğu" | "Kuzeybatı";
  };
  
  // Bina özellikleri - Sahibinden.com tarzı
  buildingFeatures: {
    hasElevator: boolean;
    hasCarPark: boolean;           // Otopark
    hasClosedCarPark: boolean;     // Kapalı otopark
    hasOpenCarPark: boolean;       // Açık otopark
    hasSecurity: boolean;          // Güvenlik
    has24HourSecurity: boolean;    // 24 saat güvenlik
    hasCameraSystem: boolean;      // Kamera sistemi
    hasConcierge: boolean;         // Kapıcı
    hasPool: boolean;
    hasGym: boolean;
    hasSauna: boolean;
    hasTurkishBath: boolean;       // Türk hamamı
    hasPlayground: boolean;        // Çocuk oyun alanı
    hasBasketballCourt: boolean;   // Basketbol sahası
    hasTennisCourt: boolean;       // Tenis kortu
    hasGenerator: boolean;         // Jeneratör
    hasFireEscape: boolean;        // Yangın merdiveni
    hasFireDetector: boolean;      // Yangın algılama
    hasWaterBooster: boolean;      // Su deposu
    hasSatelliteSystem: boolean;   // Uydu sistemi
    hasWifi: boolean;              // Kablosuz internet
  };
  
  // Emlak detayları - Sahibinden.com tarzı
  propertyDetails: {
    usageStatus: UsageStatus;
    deedStatus: DeedStatus;
    fromWho: FromWho;
    isSettlement: boolean;         // İskanlı
    creditEligible: boolean;       // Krediye uygun
    exchangeAvailable: boolean;    // Takas
    inSite: boolean;              // Site içerisinde
    monthlyFee?: number;          // Aidat (₺)
    hasDebt: boolean;             // Borç var mı?
    debtAmount?: number;          // Borç miktarı
    isRentGuaranteed: boolean;    // Kira garantili
    rentGuaranteeAmount?: number; // Kira garanti miktarı
    isNewBuilding: boolean;       // Yeni bina
    isSuitableForOffice: boolean; // Ofis kullanımına uygun
    hasBusinessLicense: boolean;  // İş yeri ruhsatlı
  };

  // Arsa özel alanları
  landDetails?: {
    zoningStatus: ZoningStatus;           // İmar Durumu
    pricePerSquareMeter?: number;         // m² Fiyatı
    blockNumber?: string;                 // Ada No
    parcelNumber?: string;                // Parsel No
    sheetNumber?: string;                 // Pafta No
    floorAreaRatio?: string;              // Kaks (Emsal)
    buildingHeight?: string;              // Gabari
    creditEligibility: CreditEligibility; // Krediye Uygunluk
  };
  
  // Medya
  images: string[];
  virtualTour?: string;
  panoramicImages?: PanoramicImage[];
  
  // Meta bilgiler
  createdAt: string;
  updatedAt?: string;
  viewCount?: number;
  isFeatured?: boolean;
  isSponsored?: boolean;
  status: "active" | "passive" | "sold" | "rented";
  
  // İletişim
  agent: {
    name: string;
    phone: string;
    email: string;
    photo?: string;
    company?: string;
    isOwner?: boolean;            // Mülk sahibi mi?
  };
  
  // Harici linkler
  sahibindenLink?: string;        // Sahibinden.com ilan linki
  hurriyetEmlakLink?: string;     // Hürriyet Emlak linki
  emlakJetLink?: string;          // EmlakJet linki
}
