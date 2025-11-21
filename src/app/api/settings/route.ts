import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logActivity } from '@/lib/server-activity-logger';


const SETTINGS_FILE = path.join(process.cwd(), 'src/data/settings.json');

// Ayarları oku
function readSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
      siteName: "IremWorld",
      siteDescription: "Emlak ve Gayrimenkul Yönetim Sistemi",
      headerLogo: "/logo.png",
      footerLogo: "/logo.png",
      primaryColor: "#FF6B35",
      secondaryColor: "#2E294E",
      footerText: "© 2024 IremWorld. Tüm hakları saklıdır.",
      socialLinks: {
        facebook: "https://facebook.com/iremworld",
        twitter: "https://twitter.com/iremworld",
        instagram: "https://instagram.com/iremworld",
        linkedin: "https://linkedin.com/company/iremworld"
      }
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  
  const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
  return JSON.parse(data);
}

// Ayarları kaydet
function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// GET - Ayarları getir
export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Ayarlar getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Ayarları güncelle
export async function PUT(request: NextRequest) {
  try {
    const updatedSettings = await request.json();
    
    // Mevcut ayarları al
    const currentSettings = readSettings();
    
    // Ayarları birleştir
    const newSettings = { ...currentSettings, ...updatedSettings };
    
    // Ayarları kaydet
    saveSettings(newSettings);

    // IP ve user agent bilgileri
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      '127.0.0.1';

    // Aktivite logu ekle
    logActivity(
      'system', // TODO: Gerçek kullanıcı ID'si
      'System User', // TODO: Gerçek kullanıcı adı
      'system@iremworld.com', // TODO: Gerçek kullanıcı email'i
      'settings_update',
      'Site ayarları güncellendi',
      ipAddress,
      userAgent,
      'system',
      undefined,
      'success',
      { updatedFields: Object.keys(updatedSettings) }
    );

    return NextResponse.json(
      { message: 'Ayarlar başarıyla güncellendi', settings: newSettings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ayarlar güncellenirken hata:', error);

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      '127.0.0.1';

    logActivity(
      'system',
      'System User',
      'system@iremworld.com',
      'settings_update',
      'Site ayarları güncelleme işlemi başarısız oldu',
      ipAddress,
      userAgent,
      'system',
      undefined,
      'failed',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );

    return NextResponse.json(
      { error: 'Ayarlar güncellenemedi' },
      { status: 500 }
    );
  }
}
