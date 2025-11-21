import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

type SortStrategy = 'recent' | 'price_desc' | 'price_asc';

const sortProperties = (properties: any[], strategy: SortStrategy) => {
  switch (strategy) {
    case 'price_desc':
      return [...properties].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'price_asc':
      return [...properties].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'recent':
      return [...properties].sort((a, b) => {
        const aDate = new Date(a.createdAt ?? 0).getTime();
        const bDate = new Date(b.createdAt ?? 0).getTime();
        return bDate - aDate;
      });
    default:
      return properties;
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Sadece ülke parametresini al (diğer filtreler client-side)
    const country = searchParams.get('country');
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit');
    const sortParam = searchParams.get('sort') as SortStrategy | null;
    const idsParam = searchParams.get('ids');

    // Eğer ülke belirtilmişse, sadece o ülkenin JSON'unu yükle
    let properties: any[] = [];
    
    if (country) {
      try {
        const countryFilePath = path.join(process.cwd(), 'src', 'data', 'countries', `${country}.json`);
        const countryData = JSON.parse(fs.readFileSync(countryFilePath, 'utf-8'));
        properties = countryData;
        console.log(`📍 Loaded ${properties.length} properties from ${country}.json`);
      } catch (error) {
        console.error(`❌ Country file not found: ${country}`);
        return NextResponse.json({
          success: true,
          data: [],
          meta: { total: 0, country }
        });
      }
    } else {
      // Ülke belirtilmemişse, tüm veriyi yükle (sadece ülke listesi için)
      const allPropertiesPath = path.join(process.cwd(), 'src', 'data', 'enhanced-sale.json');
      properties = JSON.parse(fs.readFileSync(allPropertiesPath, 'utf-8'));
      console.log(`🌍 Loaded all ${properties.length} properties`);
    }

    if (type && ['sale', 'rent'].includes(type)) {
      properties = properties.filter(property => property.type === type);
    }

    if (idsParam) {
      const requestedIds = idsParam
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);

      if (requestedIds.length) {
        const propertyMap = new Map(properties.map(property => [property.id, property]));
        properties = requestedIds
          .map(id => propertyMap.get(id))
          .filter(Boolean) as any[];
      }
    }

    if (sortParam && ['recent', 'price_desc', 'price_asc'].includes(sortParam)) {
      properties = sortProperties(properties, sortParam);
    }

    if (limitParam) {
      const limit = Number(limitParam);
      if (Number.isFinite(limit) && limit > 0) {
        properties = properties.slice(0, limit);
      }
    }

    // Artık filtreler client-side'da yapılıyor
    // API sadece ülkeye göre tüm veriyi döndürür
    
    return NextResponse.json({
      success: true,
      data: properties,
      meta: {
        total: properties.length,
        country: country || 'all'
      }
    });

  } catch (error) {
    console.error('Properties JSON API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
