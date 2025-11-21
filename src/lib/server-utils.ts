import fs from 'fs';
import path from 'path';
import { Property } from '@/types/property';
import { User } from '@/types/user';
import { UserActivity, ActivityAction } from '@/types/activity';
import { Store } from '@/types/store';

// Veri dosyası yolları
const DATA_DIR = path.join(process.cwd(), 'src/data');
const PROPERTIES_DATA_PATH = path.join(DATA_DIR, 'enhanced-sale.json');
const USERS_DATA_PATH = path.join(DATA_DIR, 'users.json');
const ACTIVITIES_DATA_PATH = path.join(DATA_DIR, 'activities.json');
const STORES_DATA_PATH = path.join(DATA_DIR, 'stores.json');
const COUNTRIES_DATA_DIR = path.join(DATA_DIR, 'countries');
const COUNTRY_INDEX_PATH = path.join(COUNTRIES_DATA_DIR, 'index.json');

type CountryIndexEntry = {
  code: string;
};

let cachedCountryIndex: CountryIndexEntry[] | null = null;
let cachedCountryProperties: Map<string, any[]> | null = null;
let cachedCountrySlugMap: Map<string, Property | null> | null = null;

const DEFAULT_INTERIOR_FEATURES = {
  kitchenType: 'Kapalı',
  hasBuiltInKitchen: false,
  hasBuiltInWardrobe: false,
  hasLaminate: false,
  hasParquet: false,
  hasCeramic: false,
  hasMarble: false,
  hasWallpaper: false,
  hasPaintedWalls: false,
  hasSpotLighting: false,
  hasHiltonBathroom: false,
  hasJacuzzi: false,
  hasShowerCabin: false,
  hasAmericanDoor: false,
  hasSteelDoor: false,
  hasIntercom: false
} as const;

const DEFAULT_EXTERIOR_FEATURES = {
  hasBalcony: false,
  hasTerrace: false,
  hasGarden: false,
  hasGardenUse: false,
  hasSeaView: false,
  hasCityView: false,
  hasNatureView: false,
  hasPoolView: false,
  facade: 'Güney'
} as const;

const DEFAULT_BUILDING_FEATURES = {
  hasElevator: false,
  hasCarPark: false,
  hasClosedCarPark: false,
  hasOpenCarPark: false,
  hasSecurity: false,
  has24HourSecurity: false,
  hasCameraSystem: false,
  hasConcierge: false,
  hasPool: false,
  hasGym: false,
  hasSauna: false,
  hasTurkishBath: false,
  hasPlayground: false,
  hasBasketballCourt: false,
  hasTennisCourt: false,
  hasGenerator: false,
  hasFireEscape: false,
  hasFireDetector: false,
  hasWaterBooster: false,
  hasSatelliteSystem: false,
  hasWifi: false
} as const;

const DEFAULT_PROPERTY_DETAILS = {
  usageStatus: 'Boş',
  deedStatus: 'Kat Mülkiyeti',
  fromWho: 'Emlak Ofisinden',
  isSettlement: false,
  creditEligible: false,
  exchangeAvailable: false,
  inSite: false,
  monthlyFee: undefined,
  hasDebt: false,
  debtAmount: undefined,
  isRentGuaranteed: false,
  rentGuaranteeAmount: undefined,
  isNewBuilding: false,
  isSuitableForOffice: false,
  hasBusinessLicense: false
} as const;

const PROPERTY_FURNISHING_FALLBACK = 'Unfurnished';
const PROPERTY_HEATING_FALLBACK = 'Isıtma Yok';

function normalizeSlug(value: string | undefined | null): string | null {
  if (!value) {
    return null;
  }

  let result = value;

  try {
    result = decodeURIComponent(result);
  } catch (_error) {
    // Ignore decode issues and continue with the raw value
  }

  return result.toLowerCase();
}

function normalizeCategoryMain(value: any): Property['category']['main'] {
  if (typeof value === 'string') {
    const key = value.toLowerCase();

    switch (key) {
      case 'residential':
      case 'housing':
        return 'Konut';
      case 'government':
      case 'commercial':
      case 'office':
      case 'retail':
      case 'industrial':
        return 'İş Yeri';
      case 'land':
      case 'plot':
      case 'arsa':
        return 'Arsa';
      case 'building':
        return 'Bina';
      case 'tourism':
      case 'hotel':
        return 'Turistik Tesis';
      case 'timeshare':
        return 'Devremülk';
      default:
        break;
    }
  }

  return 'Konut';
}

function normalizeRooms(value: any): Property['specs']['rooms'] {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === 'stüdyo') {
      return 'Stüdyo';
    }

    if (/^[1-6]\+[01]$/.test(trimmed)) {
      return trimmed as Property['specs']['rooms'];
    }

    if (trimmed === '6+ Oda') {
      return '6+ Oda';
    }
  }

  return '1+1';
}

function normalizeHeating(value: any): Property['specs']['heating'] {
  if (typeof value === 'string') {
    const key = value.toLowerCase();

    if (key.includes('kombi')) {
      return 'Kombi Doğalgaz';
    }

    if (key.includes('merkezi') && key.includes('pay')) {
      return 'Merkezi (Pay Ölçer)';
    }

    if (key.includes('merkezi')) {
      return 'Merkezi Doğalgaz';
    }

    if (key.includes('yerden')) {
      return 'Yerden Isıtma';
    }

    if (key.includes('klima')) {
      return 'Klima';
    }

    if (key.includes('şömine')) {
      return 'Şömine';
    }

    if (key.includes('soba')) {
      return 'Soba';
    }
  }

  return PROPERTY_HEATING_FALLBACK as Property['specs']['heating'];
}

function normalizeFurnishing(value: any): Property['specs']['furnishing'] {
  if (typeof value === 'string') {
    const key = value.toLowerCase();

    if (key.includes('semi') || key.includes('partial')) {
      return 'Partially Furnished';
    }

    if (key.includes('furnished')) {
      return key.includes('un') ? 'Unfurnished' : 'Furnished';
    }
  }

  return PROPERTY_FURNISHING_FALLBACK as Property['specs']['furnishing'];
}

export function normalizeCountryProperty(
  rawProperty: any,
  originalSlug: string,
  normalizedSlug: string | null,
  normalizedId?: string
): Property {
  const id = String(rawProperty?.id ?? normalizedId ?? originalSlug);
  const rawType = typeof rawProperty?.type === 'string' ? rawProperty.type.toLowerCase() : 'sale';
  const type: Property['type'] = rawType === 'rent' ? 'rent' : 'sale';

  const category = {
    main: normalizeCategoryMain(rawProperty?.category?.main),
    sub:
      typeof rawProperty?.category?.sub === 'string' && rawProperty.category.sub.trim()
        ? rawProperty.category.sub
        : type === 'sale'
          ? 'Satılık'
          : 'Kiralık'
  } as Property['category'];

  const location = {
    country: rawProperty?.location?.country ?? 'TR',
    state: rawProperty?.location?.state ?? null,
    city: rawProperty?.location?.city ?? 'Belirtilmemiş',
    district: rawProperty?.location?.district,
    neighborhood: rawProperty?.location?.neighborhood,
    address: rawProperty?.location?.address,
    coordinates: rawProperty?.location?.coordinates
  } satisfies Property['location'];

  const specs = {
    netSize: Number(rawProperty?.specs?.netSize ?? 0),
    grossSize: rawProperty?.specs?.grossSize != null ? Number(rawProperty.specs.grossSize) : undefined,
    rooms: normalizeRooms(rawProperty?.specs?.rooms),
    bathrooms: Number(rawProperty?.specs?.bathrooms ?? 0),
    age: Number(rawProperty?.specs?.age ?? 0),
    floor: rawProperty?.specs?.floor != null ? Number(rawProperty.specs.floor) : undefined,
    totalFloors: rawProperty?.specs?.totalFloors != null ? Number(rawProperty.specs.totalFloors) : undefined,
    heating: normalizeHeating(rawProperty?.specs?.heating),
    furnishing: normalizeFurnishing(rawProperty?.specs?.furnishing),
    balconyCount:
      rawProperty?.specs?.balconyCount != null ? Number(rawProperty.specs.balconyCount) : undefined
  } satisfies Property['specs'];

  const interiorFeatures = {
    ...DEFAULT_INTERIOR_FEATURES,
    ...(rawProperty?.interiorFeatures ?? {})
  } satisfies Property['interiorFeatures'];

  const exteriorFeatures = {
    ...DEFAULT_EXTERIOR_FEATURES,
    ...(rawProperty?.exteriorFeatures ?? {})
  } satisfies Property['exteriorFeatures'];

  const buildingFeatures = {
    ...DEFAULT_BUILDING_FEATURES,
    ...(rawProperty?.buildingFeatures ?? {})
  } satisfies Property['buildingFeatures'];

  const propertyDetails = {
    ...DEFAULT_PROPERTY_DETAILS,
    ...(rawProperty?.propertyDetails ?? {})
  } satisfies Property['propertyDetails'];

  const agent = {
    name: rawProperty?.agent?.name ?? 'Portföy Sorumlusu',
    phone: rawProperty?.agent?.phone ?? '',
    email: rawProperty?.agent?.email ?? 'info@iremworld.com',
    photo: rawProperty?.agent?.photo,
    company: rawProperty?.agent?.company,
    isOwner: rawProperty?.agent?.isOwner ?? false
  } satisfies Property['agent'];

  // Eğer agent bilgisi varsa, mağaza bağlantısını ara
  let storeId: string | undefined;
  try {
    const matchedStore = findStoreByAgent(agent);
    if (matchedStore) storeId = matchedStore.id;
  } catch (error) {
    // ignore
  }

  const normalizedProperty: Property = {
    id,
    type,
    category,
    title: rawProperty?.title ?? 'İlan Başlığı',
    slug: rawProperty?.slug ?? originalSlug,
    description: rawProperty?.description ?? 'Detaylı bilgi için iletişime geçiniz.',
    price: Number(rawProperty?.price ?? 0),
    location,
    specs,
    interiorFeatures,
    exteriorFeatures,
    buildingFeatures,
    propertyDetails,
    landDetails: rawProperty?.landDetails,
    images: Array.isArray(rawProperty?.images) ? rawProperty.images : [],
    virtualTour: rawProperty?.virtualTour,
    panoramicImages: rawProperty?.panoramicImages,
    createdAt: rawProperty?.createdAt ?? new Date().toISOString(),
    updatedAt: rawProperty?.updatedAt,
    viewCount: Number(rawProperty?.viewCount ?? 0),
    isFeatured: Boolean(rawProperty?.isFeatured),
    isSponsored: Boolean(rawProperty?.isSponsored),
    status: rawProperty?.status ?? 'active',
    agent,
    storeId,
    sahibindenLink: rawProperty?.sahibindenLink,
    hurriyetEmlakLink: rawProperty?.hurriyetEmlakLink,
    emlakJetLink: rawProperty?.emlakJetLink
  };

  if (rawProperty?.features) {
    if (rawProperty.features.hasBalcony !== undefined) {
      normalizedProperty.exteriorFeatures.hasBalcony = Boolean(rawProperty.features.hasBalcony);
    }

    if (rawProperty.features.hasGarden !== undefined) {
      normalizedProperty.exteriorFeatures.hasGarden = Boolean(rawProperty.features.hasGarden);
    }

    if (rawProperty.features.hasSeaView !== undefined) {
      normalizedProperty.exteriorFeatures.hasSeaView = Boolean(rawProperty.features.hasSeaView);
    }

    if (rawProperty.features.hasCityView !== undefined) {
      normalizedProperty.exteriorFeatures.hasCityView = Boolean(rawProperty.features.hasCityView);
    }

    if (rawProperty.features.hasNatureView !== undefined) {
      normalizedProperty.exteriorFeatures.hasNatureView = Boolean(rawProperty.features.hasNatureView);
    }

    if (rawProperty.features.hasPoolView !== undefined) {
      normalizedProperty.exteriorFeatures.hasPoolView = Boolean(rawProperty.features.hasPoolView);
    }

    if (rawProperty.features.hasParking !== undefined) {
      normalizedProperty.buildingFeatures.hasCarPark = Boolean(rawProperty.features.hasParking);
      normalizedProperty.buildingFeatures.hasOpenCarPark = Boolean(rawProperty.features.hasParking);
    }

    if (rawProperty.features.hasPool !== undefined) {
      normalizedProperty.buildingFeatures.hasPool = Boolean(rawProperty.features.hasPool);
    }

    if (rawProperty.features.hasElevator !== undefined) {
      normalizedProperty.buildingFeatures.hasElevator = Boolean(rawProperty.features.hasElevator);
    }

    if (rawProperty.features.hasSecurity !== undefined) {
      normalizedProperty.buildingFeatures.hasSecurity = Boolean(rawProperty.features.hasSecurity);
      normalizedProperty.buildingFeatures.has24HourSecurity = Boolean(rawProperty.features.hasSecurity);
    }
  }

  if (!normalizedProperty.slug && normalizedSlug) {
    normalizedProperty.slug = normalizedSlug;
  }

  return normalizedProperty;
}

function loadCountryIndex(): CountryIndexEntry[] {
  if (cachedCountryIndex) {
    return cachedCountryIndex;
  }

  try {
    const data = fs.readFileSync(COUNTRY_INDEX_PATH, 'utf8');
    cachedCountryIndex = JSON.parse(data);
  } catch (error) {
    console.error('Country index read failed:', error);
    cachedCountryIndex = [];
  }

  return cachedCountryIndex;
}

function loadCountryProperties(countryCode: string): any[] {
  if (!countryCode) {
    return [];
  }

  if (!cachedCountryProperties) {
    cachedCountryProperties = new Map();
  }

  const normalizedCode = countryCode.toUpperCase();

  if (cachedCountryProperties.has(normalizedCode)) {
    return cachedCountryProperties.get(normalizedCode) ?? [];
  }

  try {
    const filePath = path.join(COUNTRIES_DATA_DIR, `${normalizedCode}.json`);
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    cachedCountryProperties.set(normalizedCode, parsed);
    return parsed;
  } catch (error) {
    console.error(`Country properties read failed (${normalizedCode}):`, error);
    cachedCountryProperties.set(normalizedCode, []);
    return [];
  }
}

export function readCountryProperties(countryCode: string): any[] {
  return loadCountryProperties(countryCode);
}

export function readAllCountries(): Array<{ code: string; properties: any[] }> {
  const countryIndex = loadCountryIndex();
  
  return countryIndex.map(entry => ({
    code: entry.code,
    properties: loadCountryProperties(entry.code),
  }));
}

export function findCountryPropertyBySlug(slug: string, potentialId?: string): any | null {
  const normalizedSlug = normalizeSlug(slug);
  const normalizedId = potentialId ? String(potentialId) : undefined;
  const idCacheKey = normalizedId ? `id:${normalizedId}` : null;

  if (!normalizedSlug && !normalizedId) {
    return null;
  }

  if (!cachedCountrySlugMap) {
    cachedCountrySlugMap = new Map();
  }

  if (normalizedSlug && cachedCountrySlugMap.has(normalizedSlug)) {
    return cachedCountrySlugMap.get(normalizedSlug) ?? null;
  }

  if (idCacheKey && cachedCountrySlugMap.has(idCacheKey)) {
    return cachedCountrySlugMap.get(idCacheKey) ?? null;
  }

  const countryIndex = loadCountryIndex();

  for (const entry of countryIndex) {
    const properties = loadCountryProperties(entry.code);

    for (const property of properties) {
      if (!property) {
        continue;
      }

      const propertySlug = normalizeSlug(typeof property.slug === 'string' ? property.slug : undefined);
      const propertyId = property.id ? String(property.id) : undefined;

      const matchedBySlug = normalizedSlug && propertySlug === normalizedSlug;
      const matchedById = normalizedId && propertyId === normalizedId;

      if (!matchedBySlug && !matchedById) {
        continue;
      }

      const normalizedProperty = normalizeCountryProperty(
        property,
        slug,
        normalizedSlug,
        normalizedId
      );

      if (normalizedSlug) {
        cachedCountrySlugMap.set(normalizedSlug, normalizedProperty);
      }

      if (propertySlug && propertySlug !== normalizedSlug) {
        cachedCountrySlugMap.set(propertySlug, normalizedProperty);
      }

      if (idCacheKey) {
        cachedCountrySlugMap.set(idCacheKey, normalizedProperty);
      }

      return normalizedProperty;
    }
  }

  if (normalizedSlug) {
    cachedCountrySlugMap.set(normalizedSlug, null);
  }

  if (idCacheKey) {
    cachedCountrySlugMap.set(idCacheKey, null);
  }

  return null;
}

function readRawProperties(): Property[] {
  try {
    const data = fs.readFileSync(PROPERTIES_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Emlak verileri okunamadı:', error);
    return [];
  }
}

function writeRawProperties(properties: Property[]): void {
  try {
    fs.writeFileSync(PROPERTIES_DATA_PATH, JSON.stringify(properties, null, 2), 'utf8');
  } catch (error) {
    console.error('Emlak verileri yazılamadı:', error);
    throw new Error('Emlak verileri kaydedilemedi');
  }
}

// Satılık emlakları okuma
export function readSaleProperties(): Property[] {
  return readRawProperties().filter(property => property.type === 'sale');
}

// Kiralık emlakları okuma
export function readRentProperties(): Property[] {
  return readRawProperties().filter(property => property.type === 'rent');
}

// Tüm emlakları okuma
export function readAllProperties(): Property[] {
  return readRawProperties();
}

// Satılık emlakları yazma
export function writeSaleProperties(properties: Property[]): void {
  const currentRent = readRentProperties();
  writeRawProperties([...properties, ...currentRent]);
}

// Kiralık emlakları yazma
export function writeRentProperties(properties: Property[]): void {
  const currentSale = readSaleProperties();
  writeRawProperties([...currentSale, ...properties]);
}

// Yeni emlak ekleme
export function addProperty(property: Property): void {
  if (property.type === 'sale') {
    const saleProperties = readSaleProperties();
    saleProperties.push(property);
    writeSaleProperties(saleProperties);
  } else if (property.type === 'rent') {
    const rentProperties = readRentProperties();
    rentProperties.push(property);
    writeRentProperties(rentProperties);
  } else {
    throw new Error('Geçersiz emlak tipi');
  }
}

// Emlak silme
export function deleteProperty(propertyId: string): boolean {
  // Önce satılık emlakları kontrol et
  const saleProperties = readSaleProperties();
  const saleIndex = saleProperties.findIndex(p => p.id === propertyId);
  
  if (saleIndex !== -1) {
    saleProperties.splice(saleIndex, 1);
    writeSaleProperties(saleProperties);
    return true;
  }
  
  // Sonra kiralık emlakları kontrol et
  const rentProperties = readRentProperties();
  const rentIndex = rentProperties.findIndex(p => p.id === propertyId);
  
  if (rentIndex !== -1) {
    rentProperties.splice(rentIndex, 1);
    writeRentProperties(rentProperties);
    return true;
  }
  
  return false;
}

// Emlak güncelleme
export function updateProperty(propertyId: string, updatedProperty: Property): boolean {
  // Önce satılık emlakları kontrol et
  const saleProperties = readSaleProperties();
  const saleIndex = saleProperties.findIndex(p => p.id === propertyId);
  
  if (saleIndex !== -1) {
    saleProperties[saleIndex] = updatedProperty;
    writeSaleProperties(saleProperties);
    return true;
  }
  
  // Sonra kiralık emlakları kontrol et
  const rentProperties = readRentProperties();
  const rentIndex = rentProperties.findIndex(p => p.id === propertyId);
  
  if (rentIndex !== -1) {
    rentProperties[rentIndex] = updatedProperty;
    writeRentProperties(rentProperties);
    return true;
  }
  
  return false;
}

// ID'ye göre emlak bulma
export function findPropertyById(propertyId: string): Property | null {
  const allProperties = readAllProperties();
  return allProperties.find(p => p.id === propertyId) || null;
}

// Kullanıcıları okuma
export function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Kullanıcı verileri okunamadı:', error);
    return [];
  }
}

// Kullanıcıları yazma
export function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Kullanıcı verileri yazılamadı:', error);
    throw new Error('Kullanıcı verileri kaydedilemedi');
  }
}

// Yeni kullanıcı ekleme
export function addUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

// Kullanıcı silme
export function deleteUser(userId: string): boolean {
  const users = readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    writeUsers(users);
    return true;
  }
  return false;
}

// Kullanıcı güncelleme
export function updateUser(userId: string, updatedUser: User): boolean {
  const users = readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = updatedUser;
    writeUsers(users);
    return true;
  }
  return false;
}

// ID'ye göre kullanıcı bulma
export function findUserById(userId: string): User | null {
  const users = readUsers();
  return users.find(u => u.id === userId) || null;
}

// Aktivite loglarını okuma
export function readActivities(): UserActivity[] {
  try {
    const data = fs.readFileSync(ACTIVITIES_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Aktivite logları okunamadı:', error);
    return [];
  }
}

// Aktivite loglarını yazma
export function writeActivities(activities: UserActivity[]): void {
  try {
    fs.writeFileSync(ACTIVITIES_DATA_PATH, JSON.stringify(activities, null, 2), 'utf8');
  } catch (error) {
    console.error('Aktivite logları yazılamadı:', error);
    throw new Error('Aktivite logları kaydedilemedi');
  }
}

// Yeni aktivite logu ekleme
export function addActivity(activity: UserActivity): UserActivity {
  const activities = readActivities();
  
  // ID yoksa oluştur
  if (!activity.id) {
    activity.id = `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }
  
  activities.unshift(activity); // En yeni aktiviteyi başa ekle
  
  // Son 1000 aktiviteyi tut (performans için)
  if (activities.length > 1000) {
    activities.splice(1000);
  }
  
  writeActivities(activities);
  return activity;
}

// Aktivite logu oluşturma yardımcı fonksiyonu
export function createActivity(
  userId: string,
  userName: string,
  userEmail: string,
  action: ActivityAction,
  description: string,
  ipAddress: string,
  userAgent: string,
  targetType?: 'property' | 'user' | 'system',
  targetId?: string,
  status: 'success' | 'failed' | 'warning' = 'success',
  details?: UserActivity['details']
): UserActivity {
  return {
    id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    userEmail,
    action,
    description,
    targetType,
    targetId,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
    status,
    details
  };
}

// Kullanıcıya göre aktivite loglarını getirme
export function getActivitiesByUser(userId: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.userId === userId)
    .slice(0, limit);
}

// Son aktiviteleri getirme
export function getRecentActivities(limit: number = 100): UserActivity[] {
  const activities = readActivities();
  return activities.slice(0, limit);
}

// Aktivite tipine göre filtreleme
export function getActivitiesByAction(action: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.action === action)
    .slice(0, limit);
}

// Tarih aralığına göre aktivite getirme
export function getActivitiesByDateRange(
  startDate: string,
  endDate: string,
  limit: number = 100
): UserActivity[] {
  const activities = readActivities();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return activities
    .filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= start && activityDate <= end;
    })
    .slice(0, limit);
}

// IP adresine göre aktivite getirme
export function getActivitiesByIP(ipAddress: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.ipAddress === ipAddress)
    .slice(0, limit);
}

// Aktivite istatistikleri
export function getActivityStats(): {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  topActions: { action: string; count: number }[];
  topUsers: { userId: string; userName: string; count: number }[];
} {
  const activities = readActivities();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const todayActivities = activities.filter(a => new Date(a.timestamp) >= today).length;
  const weekActivities = activities.filter(a => new Date(a.timestamp) >= weekAgo).length;
  const monthActivities = activities.filter(a => new Date(a.timestamp) >= monthAgo).length;

  // En çok yapılan işlemler
  const actionCounts: Record<string, number> = {};
  activities.forEach(activity => {
    actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
  });
  const topActions = Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // En aktif kullanıcılar
  const userCounts: Record<string, { userName: string; count: number }> = {};
  activities.forEach(activity => {
    if (!userCounts[activity.userId]) {
      userCounts[activity.userId] = { userName: activity.userName, count: 0 };
    }
    userCounts[activity.userId].count++;
  });
  const topUsers = Object.entries(userCounts)
    .map(([userId, data]) => ({ userId, userName: data.userName, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalActivities: activities.length,
    todayActivities,
    weekActivities,
    monthActivities,
    topActions,
    topUsers
  };
}

// Aktivite loglama yardımcı fonksiyonu
export function logActivity(
  userId: string,
  userName: string,
  userEmail: string,
  action: ActivityAction,
  description: string,
  ipAddress: string = '127.0.0.1',
  userAgent: string = 'Unknown',
  targetType?: 'property' | 'user' | 'system',
  targetId?: string,
  status: 'success' | 'failed' | 'warning' = 'success',
  details?: UserActivity['details']
): void {
  const activity = createActivity(
    userId,
    userName,
    userEmail,
    action,
    description,
    ipAddress,
    userAgent,
    targetType,
    targetId,
    status,
    details
  );
  
  addActivity(activity);
}

// ============================================
// STORE (Mağaza) UTILITIES
// ============================================

export function readStores(): Store[] {
  try {
    const data = fs.readFileSync(STORES_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Mağaza verileri okunamadı:', error);
    return [];
  }
}

export function findStoreById(id: string): Store | null {
  const stores = readStores();
  return stores.find(s => s.id === id) || null;
}

export function findStoreBySlug(slug: string): Store | null {
  const stores = readStores();
  return stores.find(s => s.slug === slug) || null;
}

export function findStoreByAgent(agent: { name?: string; company?: string; email?: string; phone?: string } | any): Store | null {
  if (!agent) return null;

  const stores = readStores();

  // Primary: match by company name
  if (typeof agent.company === 'string' && agent.company.trim()) {
    const companyLower = agent.company.trim().toLowerCase();
    const found = stores.find(s => (
      (s.name && s.name.toLowerCase() === companyLower) ||
      (s.legalName && s.legalName.toLowerCase() === companyLower) ||
      (s.slug && s.slug.toLowerCase() === companyLower)
    ));

    if (found) return found;
  }

  // Secondary: match by contact email
  if (typeof agent.email === 'string' && agent.email.trim()) {
    const emailLower = agent.email.trim().toLowerCase();
    const byEmail = stores.find(s => s.contact?.email?.toLowerCase() === emailLower);
    if (byEmail) return byEmail;
  }

  // Tertiary: match by phone (normalize digits)
  if (typeof agent.phone === 'string' && agent.phone.trim()) {
    const normalizePhone = (p: string) => (p || '').replace(/\D+/g, '');
    const agentPhone = normalizePhone(agent.phone);
    if (agentPhone) {
      const byPhone = stores.find(s => normalizePhone(s.contact?.phone || '') === agentPhone);
      if (byPhone) return byPhone;
    }
  }

  return null;
}

export function writeStores(stores: Store[]): void {
  try {
    fs.writeFileSync(STORES_DATA_PATH, JSON.stringify(stores, null, 2), 'utf8');
  } catch (error) {
    console.error('Mağaza verileri yazılamadı:', error);
    throw error;
  }
}

