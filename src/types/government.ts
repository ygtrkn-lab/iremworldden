// Devlet/Kamu Gayrimenkul Tipleri

export type GovernmentCategory = 
  | "gov_ministry"           // Bakanlık
  | "gov_municipality"       // Belediye
  | "gov_courthouse"         // Adliye
  | "gov_security"          // Güvenlik Birimleri
  | "gov_school"            // Okul
  | "gov_university"        // Üniversite
  | "gov_hospital"          // Şehir/Devlet Hastanesi
  | "gov_museum"            // Müze
  | "gov_sports"            // Spor Tesisi
  | "gov_culture"           // Kültür Merkezi
  | "gov_bridge"            // Köprü
  | "gov_road"              // Yol
  | "gov_tunnel"            // Tünel
  | "gov_railway"           // Demiryolu
  | "gov_airport"           // Havalimanı
  | "gov_dam"               // Baraj
  | "gov_energy"            // Enerji Santrali
  | "gov_treasury"          // Hazine Arazisi
  | "gov_forest"            // Orman Arazisi
  | "gov_pasture";          // Mera

export type GovernmentStatus = 
  | "Planlama Aşamasında"    // Planning stage
  | "İhale Aşamasında"       // Tender stage
  | "İnşaat Devam Ediyor"    // Construction ongoing
  | "Tamamlandı"             // Completed
  | "Aktif Kullanımda"       // In active use
  | "Tadilat/Yenileme";      // Renovation/Renewal

export type GovernmentBudgetSource = 
  | "Merkezi Bütçe"          // Central budget
  | "Belediye Bütçesi"       // Municipality budget
  | "Özel Bütçe"             // Special budget
  | "Kamu Özel İşbirliği"    // Public-private partnership
  | "Uluslararası Fon";      // International funding

export type GovernmentOwnership = 
  | "Hazine"                 // Treasury
  | "Belediye"               // Municipality
  | "Bakanlık"               // Ministry
  | "Devlet Kurumu"          // State institution
  | "Kamu İktisadi Teşebbüsü"; // State economic enterprise

export interface GovernmentProperty {
  id: string;
  category: GovernmentCategory;
  title: string;
  slug: string;
  description: string;
  
  // Proje/Gayrimenkul Durumu
  status: GovernmentStatus;
  
  // Yetkilendirilmiş Kurum
  authorizedInstitution: string; // "İçişleri Bakanlığı", "İBB", vb.
  
  // Mülkiyet
  ownership: GovernmentOwnership;
  
  // Bütçe Bilgileri
  budget?: {
    total: number;              // Toplam bütçe (TL)
    source: GovernmentBudgetSource;
    allocated?: number;         // Tahsis edilen (TL)
    spent?: number;            // Harcanan (TL)
  };
  
  // Konum bilgileri
  location: {
    country: string;
    city: string;
    district?: string;
    neighborhood?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Teknik Özellikler
  specs: {
    totalArea: number;          // Toplam alan (m²)
    builtArea?: number;         // İnşaat alanı (m²)
    capacity?: number;          // Kapasite (kişi/araç/vb)
    floors?: number;            // Kat sayısı
    startDate?: string;         // Başlangıç tarihi
    completionDate?: string;    // Tamamlanma tarihi
    estimatedCompletion?: string; // Tahmini tamamlanma
  };
  
  // Proje Detayları
  projectDetails?: {
    contractor?: string;        // Yüklenici firma
    architect?: string;         // Mimar/Mimarlık firması
    engineer?: string;          // Mühendislik firması
    consultant?: string;        // Danışman firma
    tenderDate?: string;        // İhale tarihi
    tenderAmount?: number;      // İhale bedeli
  };
  
  // Özellikler
  features: string[];           // ["Depreme Dayanıklı", "Akıllı Bina Sistemi", vb]
  
  // Çevresel/Sosyal Etki
  impact?: {
    environmental?: string[];   // Çevresel etkiler
    social?: string[];          // Sosyal etkiler
    economic?: string[];        // Ekonomik etkiler
  };
  
  // Görseller
  images: string[];
  coverImage: string;
  
  // Panoramik görseller (opsiyonel)
  panoramicImages?: Array<{
    url: string;
    title: string;
  }>;
  
  // Videolar (opsiyonel)
  videos?: string[];
  
  // Belgeler/Dökümanlar
  documents?: Array<{
    title: string;
    url: string;
    type: "PDF" | "DOC" | "Excel" | "Diğer";
  }>;
  
  // İletişim
  contact?: {
    department?: string;        // Sorumlu departman
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // İstatistikler
  stats?: {
    views: number;
    lastUpdated: string;
  };
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  createdAt: string;
  updatedAt: string;
}

// Kategori İsimleri (Türkçe)
export const GOVERNMENT_CATEGORY_NAMES: Record<GovernmentCategory, string> = {
  gov_ministry: "Bakanlık",
  gov_municipality: "Belediye",
  gov_courthouse: "Adliye",
  gov_security: "Güvenlik Birimi",
  gov_school: "Okul",
  gov_university: "Üniversite",
  gov_hospital: "Şehir/Devlet Hastanesi",
  gov_museum: "Müze",
  gov_sports: "Spor Tesisi",
  gov_culture: "Kültür Merkezi",
  gov_bridge: "Köprü",
  gov_road: "Yol",
  gov_tunnel: "Tünel",
  gov_railway: "Demiryolu",
  gov_airport: "Havalimanı",
  gov_dam: "Baraj",
  gov_energy: "Enerji Santrali",
  gov_treasury: "Hazine Arazisi",
  gov_forest: "Orman Arazisi",
  gov_pasture: "Mera",
};
