/**
 * Store (Mağaza) system types
 * Virtual real estate agency/company profiles
 */

export interface StoreEmployee {
  id: string;
  name: string;
  position: string;            // "Bölge Müdürü", "Kıdemli Emlak Danışmanı", vb.
  photo: string;
  email?: string;
  phone?: string;
  languages: string[];         // ["Türkçe", "İngilizce", "Arapça"]
  linkedin?: string;
  specialties?: string[];      // ["Lüks Konut", "Yatırım Danışmanlığı"]
  yearsOfExperience?: number;
  bio?: string;
}

export interface Store {
  id: string;
  slug: string;
  
  // Şirket bilgileri
  name: string;
  legalName?: string;          // Ticari ünvan
  description: string;
  tagline?: string;            // Kısa tanıtım
  
  // İletişim
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    country: string;
  };
  
  // Marka
  logo: string;
  coverImage?: string;
  brandColor?: string;
  
  // İstatistikler
  stats: {
    activeListings: number;    // Aktif ilan sayısı
    totalSales?: number;       // Toplam satış
    yearsInBusiness: number;   // Faaliyet süresi
    employeeCount?: number;    // Çalışan sayısı
  };
  
  // Uzmanlık alanları
  specialties: string[];       // ["Lüks Konut", "Ticari Gayrimenkul", "Yatırım"]
  
  // Lokasyonlar
  serviceAreas: string[];      // ["İstanbul", "Ankara", "İzmir"]
  
  // Çalışanlar
  employees?: StoreEmployee[];
  
  // Meta
  featured: boolean;           // Öne çıkan mağaza
  verified: boolean;           // Doğrulanmış
  rating?: number;             // 0-5 arası puan
  reviewCount?: number;
  
  // Sosyal medya
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  
  // Ek bilgiler
  licenseNumber?: string;      // Ruhsat numarası
  taxNumber?: string;          // Vergi numarası
  foundedYear?: number;
  
  createdAt: string;
  updatedAt?: string;
}

export interface StoreFilters {
  search?: string;
  city?: string;
  country?: string;
  specialty?: string;
  featured?: boolean;
  verified?: boolean;
}

export type StoreSortOption = 
  | 'name_asc'
  | 'name_desc'
  | 'listings_desc'
  | 'rating_desc'
  | 'newest';
