import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PropertyFilters, Property, SortOption } from "@/types/property";

// Format location string for display
export function formatLocation(location: Property['location']): string {
  if (!location) return '';
  
  const parts: string[] = [];
  
  // Always include country (default to TR if missing)
  const country = location.country || 'TR';
  parts.push(country);
  
  // Add city if available
  if (location.city) {
    parts.push(location.city);
  }
  
  // Add district if available
  if (location.district) {
    parts.push(location.district);
  }
  
  return parts.join(' > ');
}

// Tailwind sınıflarını birleştirmek için yardımcı fonksiyon
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fiyat formatlama fonksiyonu
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR').format(price);
}

// Tarihi formatlama fonksiyonu
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// LocalStorage'dan favorileri alma fonksiyonu
export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// LocalStorage'a favorileri kaydetme fonksiyonu
export function saveFavorites(favorites: number[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Favori ekleme/çıkarma fonksiyonu
export function toggleFavorite(id: number): number[] {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  
  saveFavorites(favorites);
  return favorites;
}
