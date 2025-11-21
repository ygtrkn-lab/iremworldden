import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { generateSlug } from '@/utils/slug';
import { logActivity } from '@/lib/server-activity-logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    const rooms = searchParams.get('rooms');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // WHERE koşullarını oluştur
    const conditions: string[] = [];
    const values: any[] = [];

    if (type) {
      conditions.push('type = ?');
      values.push(type);
    }
    if (city) {
      conditions.push('city = ?');
      values.push(city);
    }
    if (district) {
      conditions.push('district = ?');
      values.push(district);
    }
    if (minPrice) {
      conditions.push('price >= ?');
      values.push(parseInt(minPrice));
    }
    if (maxPrice) {
      conditions.push('price <= ?');
      values.push(parseInt(maxPrice));
    }
    if (minSize) {
      conditions.push('netSize >= ?');
      values.push(parseInt(minSize));
    }
    if (maxSize) {
      conditions.push('netSize <= ?');
      values.push(parseInt(maxSize));
    }
    if (rooms) {
      conditions.push('rooms = ?');
      values.push(rooms);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Toplam sayıyı hesapla
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM properties ${whereClause}`,
      values
    );
    const total = (countResult as any[])[0].total;
    const totalPages = Math.ceil(total / limit);

    // Emlakları getir
    const offset = (page - 1) * limit;
    
    // MySQL'de LIMIT ve OFFSET için string interpolation kullanıyoruz
    const query = `SELECT * FROM properties ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    
    console.log('Executing query:', query);
    console.log('Query params:', values);
    
    const [rows] = await pool.execute(query, values);

    // JSON stringlerini parse et ve MongoDB formatına uygun hale getir
    const formattedProperties = (rows as any[]).map(property => ({
      ...property,
      images: JSON.parse(property.images || '[]'),
      panoramicImages: JSON.parse(property.panoramicImages || '[]'),
      location: {
        country: property.country,
        state: property.state,
        city: property.city,
        district: property.district,
        neighborhood: property.neighborhood,
        address: property.address,
        coordinates: property.coordinatesLat && property.coordinatesLng ? {
          lat: property.coordinatesLat,
          lng: property.coordinatesLng
        } : undefined
      },
      specs: {
        netSize: property.netSize,
        grossSize: property.grossSize,
        rooms: property.rooms,
        bathrooms: property.bathrooms,
        age: property.age,
        floor: property.floor,
        totalFloors: property.totalFloors,
        heating: property.heating,
        furnishing: property.furnishing,
        balconyCount: property.balconyCount
      },
      category: {
        main: property.categoryMain,
        sub: property.categorySub
      },
      agent: {
        id: property.agentId,
        name: property.agentName,
        phone: property.agentPhone,
        email: property.agentEmail,
        photo: property.agentPhoto,
        company: property.agentCompany,
        isOwner: property.agentIsOwner
      }
    }));

    return NextResponse.json({
      properties: formattedProperties,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error('Properties API Error:', error);
    return NextResponse.json(
      { error: 'Emlaklar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ID oluştur
    const propertyId = `IW${Date.now()}${Math.random().toString(36).substr(2, 3)}`;
    
    // Slug oluştur
    const slug = generateSlug(body.title, body.type);

    // MySQL ile property oluştur
    await pool.execute(
      `INSERT INTO properties (
        id, type, categoryMain, categorySub, title, slug, description, price,
        country, state, city, district, neighborhood, address, coordinatesLat, coordinatesLng,
        netSize, grossSize, rooms, bathrooms, age, floor, totalFloors, heating, furnishing, balconyCount,
        kitchenType, hasBuiltInKitchen, hasBuiltInWardrobe, hasLaminate, hasParquet, hasCeramic, hasMarble,
        hasWallpaper, hasPaintedWalls, hasSpotLighting, hasHiltonBathroom, hasJacuzzi, hasShowerCabin,
        hasAmericanDoor, hasSteelDoor, hasIntercom, hasBalcony, hasTerrace, hasGarden, hasGardenUse,
        hasSeaView, hasCityView, hasNatureView, hasPoolView, facade, hasElevator, hasCarPark,
        hasClosedCarPark, hasOpenCarPark, hasSecurity, has24HourSecurity, hasCameraSystem, hasConcierge,
        hasPool, hasGym, hasSauna, hasTurkishBath, hasPlayground, hasBasketballCourt, hasTennisCourt,
        hasGenerator, hasFireEscape, hasFireDetector, hasWaterBooster, hasSatelliteSystem, hasWifi,
        usageStatus, deedStatus, fromWho, isSettlement, creditEligible, exchangeAvailable, inSite,
        monthlyFee, hasDebt, debtAmount, isRentGuaranteed, rentGuaranteeAmount, isNewBuilding,
        isSuitableForOffice, hasBusinessLicense, zoningStatus, pricePerSquareMeter, blockNumber,
        parcelNumber, sheetNumber, floorAreaRatio, buildingHeight, creditEligibility, images,
        virtualTour, panoramicImages, viewCount, isFeatured, isSponsored, status, agentId, agentName,
        agentPhone, agentEmail, agentPhoto, agentCompany, agentIsOwner, sahibindenLink,
        hurriyetEmlakLink, emlakJetLink, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        propertyId,
        body.type,
        body.category?.main || 'Konut',
        body.category?.sub || 'Daire',
        body.title,
        slug,
        body.description,
        body.price,
        body.location?.country || 'TR',
        body.location?.state,
        body.location?.city,
        body.location?.district,
        body.location?.neighborhood,
        body.location?.address,
        body.location?.coordinates?.lat,
        body.location?.coordinates?.lng,
        body.specs?.size || body.specs?.netSize,
        body.specs?.grossSize,
        body.specs?.rooms,
        body.specs?.bathrooms,
        body.specs?.age,
        body.buildingFeatures?.floor || body.specs?.floor,
        body.buildingFeatures?.totalFloors || body.specs?.totalFloors,
        body.propertyDetails?.heatingType || body.specs?.heating,
        body.specs?.furnishing,
        body.specs?.balconyCount,
        body.propertyDetails?.kitchenType || body.interiorFeatures?.kitchenType,
        body.interiorFeatures?.hasBuiltInKitchen || false,
        body.interiorFeatures?.hasBuiltInWardrobe || false,
        body.interiorFeatures?.hasLaminate || false,
        body.interiorFeatures?.hasParquet || false,
        body.interiorFeatures?.hasCeramic || false,
        body.interiorFeatures?.hasMarble || false,
        body.interiorFeatures?.hasWallpaper || false,
        body.interiorFeatures?.hasPaintedWalls || false,
        body.interiorFeatures?.hasSpotLighting || false,
        body.interiorFeatures?.hasHiltonBathroom || false,
        body.interiorFeatures?.hasJacuzzi || false,
        body.interiorFeatures?.hasShowerCabin || false,
        body.interiorFeatures?.hasAmericanDoor || false,
        body.interiorFeatures?.hasSteelDoor || false,
        body.interiorFeatures?.hasIntercom || false,
        body.propertyDetails?.hasBalcony || body.exteriorFeatures?.hasBalcony || false,
        body.exteriorFeatures?.hasTerrace || false,
        body.exteriorFeatures?.hasGarden || false,
        body.exteriorFeatures?.hasGardenUse || false,
        body.exteriorFeatures?.hasSeaView || false,
        body.exteriorFeatures?.hasCityView || false,
        body.exteriorFeatures?.hasNatureView || false,
        body.exteriorFeatures?.hasPoolView || false,
        body.exteriorFeatures?.facade,
        body.buildingFeatures?.hasElevator || false,
        body.buildingFeatures?.hasParking || body.buildingFeatures?.hasCarPark || false,
        body.buildingFeatures?.hasClosedCarPark || false,
        body.buildingFeatures?.hasOpenCarPark || false,
        body.buildingFeatures?.hasSecurity || false,
        body.buildingFeatures?.has24HourSecurity || false,
        body.buildingFeatures?.hasCameraSystem || false,
        body.buildingFeatures?.hasConcierge || false,
        body.buildingFeatures?.hasPool || false,
        body.buildingFeatures?.hasGym || false,
        body.buildingFeatures?.hasSauna || false,
        body.buildingFeatures?.hasTurkishBath || false,
        body.buildingFeatures?.hasPlayground || false,
        body.buildingFeatures?.hasBasketballCourt || false,
        body.buildingFeatures?.hasTennisCourt || false,
        body.buildingFeatures?.hasGenerator || false,
        body.buildingFeatures?.hasFireEscape || false,
        body.buildingFeatures?.hasFireDetector || false,
        body.buildingFeatures?.hasWaterBooster || false,
        body.buildingFeatures?.hasSatelliteSystem || false,
        body.buildingFeatures?.hasWifi || false,
        body.propertyDetails?.usageStatus,
        body.propertyDetails?.deedStatus,
        body.propertyDetails?.fromWho,
        body.propertyDetails?.isSettlement || false,
        body.propertyDetails?.creditEligible || false,
        body.propertyDetails?.exchangeAvailable || false,
        body.propertyDetails?.inSite || false,
        body.propertyDetails?.monthlyFee,
        body.propertyDetails?.hasDebt || false,
        body.propertyDetails?.debtAmount,
        body.propertyDetails?.isRentGuaranteed || false,
        body.propertyDetails?.rentGuaranteeAmount,
        body.propertyDetails?.isNewBuilding || false,
        body.propertyDetails?.isSuitableForOffice || false,
        body.propertyDetails?.hasBusinessLicense || false,
        body.landDetails?.zoningStatus,
        body.landDetails?.pricePerSquareMeter,
        body.landDetails?.blockNumber,
        body.landDetails?.parcelNumber,
        body.landDetails?.sheetNumber,
        body.landDetails?.floorAreaRatio,
        body.landDetails?.buildingHeight,
        body.landDetails?.creditEligibility,
        JSON.stringify(body.images || []),
        body.virtualTour,
        JSON.stringify(body.panoramicImages || []),
        0,
        body.isFeatured || false,
        body.isSponsored || false,
        body.status || 'active',
        body.agent?.id,
        body.agent?.name,
        body.agent?.phone,
        body.agent?.email,
        body.agent?.photo,
        body.agent?.company,
        body.agent?.isOwner || false,
        body.sahibindenLink,
        body.hurriyetEmlakLink,
        body.emlakJetLink
      ]
    );

    // Oluşturulan property'yi getir
    const [createdRows] = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [propertyId]
    );
    const createdProperty = (createdRows as any[])[0];

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email'),
      action: 'property_create',
      description: `${createdProperty.title} başlıklı yeni emlak eklendi`,
      targetType: 'property',
      targetId: createdProperty.id,
      status: 'success',
      details: {
        propertyType: createdProperty.type,
        category: {
          main: createdProperty.categoryMain,
          sub: createdProperty.categorySub
        },
        location: {
          city: createdProperty.city,
          district: createdProperty.district
        },
        price: createdProperty.price,
        specs: {
          netSize: createdProperty.netSize,
          rooms: createdProperty.rooms,
          bathrooms: createdProperty.bathrooms
        }
      },
      // Mağaza - agent bilgisine göre eşleştirme yap (Sunucu yardımcı fonksiyonu)
      storeId: (function() {
        try {
          const { findStoreByAgent } = require('@/lib/server-utils');
          const matched = findStoreByAgent({
            name: property.agentName,
            company: property.agentCompany,
            email: property.agentEmail,
            phone: property.agentPhone
          });
          return matched ? matched.id : undefined;
        } catch (err) {
          return undefined;
        }
      })(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent')
    });
    
    return NextResponse.json(createdProperty);
  } catch (error) {
    console.error('Property Creation Error:', error);
    return NextResponse.json(
      { error: 'Emlak eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
