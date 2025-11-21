export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Türkçe karakterleri ve özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-'); // Ardışık tireleri tek tireye dönüştür
}

export function turkishToEnglish(text: string): string {
  const charMap: { [key: string]: string } = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
  };
  
  return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, char => charMap[char] || char);
}

export function generatePropertyUrl(property: { id: string; title: string; type: string; slug?: string }): string {
  // Eğer slug varsa onu kullan
  if (property.slug) {
    return `/property/${property.slug}`;
  }
  
  // Fallback: eski yöntem
  const typePrefix = property.type === 'sale' ? 'satilik' : 'kiralik';
  const titleSlug = createSlug(turkishToEnglish(property.title));

  return `/property/${typePrefix}-${titleSlug}-${property.id}`;
}

export function generateSlug(title: string, type: string): string {
  const typePrefix = type === 'sale' ? 'satilik-emlak' : 'kiralik-emlak';
  const titleSlug = createSlug(turkishToEnglish(title));
  
  return `${typePrefix}-${titleSlug}`;
}
