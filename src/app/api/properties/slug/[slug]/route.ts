import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { findCountryPropertyBySlug, normalizeCountryProperty, readAllProperties } from '@/lib/server-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let decodedSlug = slug;

    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (decodeError) {
      console.warn('Slug decode failed, using raw slug:', slug, decodeError);
    }

    const normalizedSlug = decodedSlug.toLowerCase();
    console.log('Fetching property with slug:', decodedSlug);

    // Sadece property verilerini çek
    let dbProperty: any | null = null;
    const potentialId = decodedSlug.split('-').pop();

    try {
      const [rows] = await pool.execute(
        `SELECT * FROM properties WHERE slug = ?`,
        [decodedSlug]
      );

      if ((rows as any[]).length > 0) {
        dbProperty = (rows as any[])[0];
      }

      if (!dbProperty && potentialId && /^\d+$/.test(potentialId)) {
        const [rowsById] = await pool.execute(
          `SELECT * FROM properties WHERE id = ?`,
          [potentialId]
        );

        if ((rowsById as any[]).length > 0) {
          dbProperty = (rowsById as any[])[0];
        }
      }
    } catch (dbError) {
      console.warn('MySQL property lookup failed, falling back to JSON data:', dbError);
    }

    if (dbProperty) {
      // API response formatını frontend'in beklediği formata dönüştür
      const formattedProperty = {
        id: dbProperty.id,
        title: dbProperty.title,
        slug: dbProperty.slug,
        description: dbProperty.description,
        price: dbProperty.price,
        type: dbProperty.type,
        location: {
          city: dbProperty.city,
          district: dbProperty.district,
          neighborhood: dbProperty.neighborhood,
          address: dbProperty.address,
          coordinates: {
            lat: dbProperty.coordinates_lat,
            lng: dbProperty.coordinates_lng
          }
        },
        specs: {
          netSize: dbProperty.net_size,
          grossSize: dbProperty.gross_size,
          rooms: dbProperty.rooms,
          bathrooms: dbProperty.bathrooms,
          age: dbProperty.age,
          floor: dbProperty.floor,
          totalFloors: dbProperty.total_floors,
          heating: dbProperty.heating,
          furnishing: dbProperty.furnishing,
          balconyCount: dbProperty.balcony_count
        },
        category: {
          main: dbProperty.category_main,
          sub: dbProperty.category_sub
        },
        images: dbProperty.images ? JSON.parse(dbProperty.images) : [],
        agent: {
          id: dbProperty.agent_id,
          name: dbProperty.agent_name,
          phone: dbProperty.agent_phone,
          email: dbProperty.agent_email,
          photo: dbProperty.agent_photo,
          company: dbProperty.agent_company
        },
        createdAt: dbProperty.created_at,
        updatedAt: dbProperty.updated_at,
        viewCount: dbProperty.view_count,
        status: dbProperty.status,
        propertyDetails: {
          usageStatus: dbProperty.usage_status,
          deedStatus: dbProperty.deed_status,
          fromWho: dbProperty.from_who,
          isSettlement: dbProperty.is_settlement,
          creditEligible: dbProperty.credit_eligible,
          exchangeAvailable: dbProperty.exchange_available,
          inSite: dbProperty.in_site,
          monthlyFee: dbProperty.monthly_fee,
          hasDebt: dbProperty.has_debt,
          debtAmount: dbProperty.debt_amount,
          isRentGuaranteed: dbProperty.is_rent_guaranteed,
          rentGuaranteeAmount: dbProperty.rent_guarantee_amount,
          isNewBuilding: dbProperty.is_new_building,
          isSuitableForOffice: dbProperty.is_suitable_for_office,
          hasBusinessLicense: dbProperty.has_business_license
        },
        // Mağaza bilgisini agent'a göre bul
        storeId: (function(){
          try {
            const { findStoreByAgent } = require('@/lib/server-utils');
            const matched = findStoreByAgent({
              name: dbProperty.agent_name,
              company: dbProperty.agent_company,
              email: dbProperty.agent_email,
              phone: dbProperty.agent_phone
            });
            return matched ? matched.id : undefined;
          } catch (err) {
            return undefined;
          }
        })(),
        interiorFeatures: {
          kitchenType: dbProperty.kitchen_type,
          hasBuiltInKitchen: dbProperty.has_built_in_kitchen,
          hasBuiltInWardrobe: dbProperty.has_built_in_wardrobe,
          hasLaminate: dbProperty.has_laminate,
          hasParquet: dbProperty.has_parquet,
          hasCeramic: dbProperty.has_ceramic,
          hasMarble: dbProperty.has_marble,
          hasWallpaper: dbProperty.has_wallpaper,
          hasPaintedWalls: dbProperty.has_painted_walls,
          hasSpotLighting: dbProperty.has_spot_lighting,
          hasHiltonBathroom: dbProperty.has_hilton_bathroom,
          hasJacuzzi: dbProperty.has_jacuzzi,
          hasShowerCabin: dbProperty.has_shower_cabin,
          hasAmericanDoor: dbProperty.has_american_door,
          hasSteelDoor: dbProperty.has_steel_door,
          hasIntercom: dbProperty.has_intercom
        },
        exteriorFeatures: {
          hasBalcony: dbProperty.has_balcony,
          hasTerrace: dbProperty.has_terrace,
          hasGarden: dbProperty.has_garden,
          hasGardenUse: dbProperty.has_garden_use,
          hasSeaView: dbProperty.has_sea_view,
          hasCityView: dbProperty.has_city_view,
          hasNatureView: dbProperty.has_nature_view,
          hasPoolView: dbProperty.has_pool_view,
          facade: dbProperty.facade
        },
        buildingFeatures: {
          hasElevator: dbProperty.has_elevator,
          hasCarPark: dbProperty.has_car_park,
          hasClosedCarPark: dbProperty.has_closed_car_park,
          hasOpenCarPark: dbProperty.has_open_car_park,
          hasSecurity: dbProperty.has_security,
          has24HourSecurity: dbProperty.has_24_hour_security,
          hasCameraSystem: dbProperty.has_camera_system,
          hasConcierge: dbProperty.has_concierge,
          hasPool: dbProperty.has_pool,
          hasGym: dbProperty.has_gym,
          hasSauna: dbProperty.has_sauna,
          hasTurkishBath: dbProperty.has_turkish_bath,
          hasPlayground: dbProperty.has_playground,
          hasBasketballCourt: dbProperty.has_basketball_court,
          hasTennisCourt: dbProperty.has_tennis_court,
          hasGenerator: dbProperty.has_generator,
          hasFireEscape: dbProperty.has_fire_escape,
          hasFireDetector: dbProperty.has_fire_detector,
          hasWaterBooster: dbProperty.has_water_booster,
          hasSatelliteSystem: dbProperty.has_satellite_system,
          hasWifi: dbProperty.has_wifi
        },
        landDetails: dbProperty.category_main === 'Arsa' ? {
          zoningStatus: dbProperty.zoning_status,
          pricePerSquareMeter: dbProperty.price_per_square_meter,
          blockNumber: dbProperty.block_number,
          parcelNumber: dbProperty.parcel_number,
          sheetNumber: dbProperty.sheet_number,
          floorAreaRatio: dbProperty.floor_area_ratio,
          buildingHeight: dbProperty.building_height,
          creditEligibility: dbProperty.credit_eligibility
        } : undefined
      };

      // İlan görüntülenme sayısını artır
      await pool.execute(
        'UPDATE properties SET view_count = view_count + 1 WHERE id = ?',
        [dbProperty.id]
      );

      return NextResponse.json(formattedProperty);
    }

    // Country JSON fallback (same source as /property page)
    const countryProperty = findCountryPropertyBySlug(decodedSlug, potentialId);

    if (countryProperty) {
      console.log('Serving property from country dataset for slug:', decodedSlug);
      // Try to match store by agent from country properties
      try {
        const matched = findStoreByAgent(countryProperty.agent);
        if (matched) {
          countryProperty.storeId = matched.id;
        }
      } catch (err) {
        // ignore
      }
      return NextResponse.json(countryProperty);
    }

    // Legacy JSON fallback
    const allProperties = readAllProperties();
    const fallbackProperty = allProperties.find((item) => {
      if (!item) return false;

      const rawSlug = item.slug;
      let normalizedSlug = rawSlug;

      if (typeof rawSlug === 'string') {
        try {
          normalizedSlug = decodeURIComponent(rawSlug);
        } catch (decodeError) {
          console.warn('Fallback slug decode failed, using raw slug:', rawSlug, decodeError);
        }
      }

      const itemId = item.id ? String(item.id) : undefined;

      return (
        normalizedSlug === decodedSlug ||
        normalizedSlug === slug ||
        rawSlug === decodedSlug ||
        rawSlug === slug ||
        itemId === potentialId
      );
    });

    if (fallbackProperty) {
      console.log('Serving property from JSON dataset for slug:', decodedSlug);

      const normalizedFallback = normalizeCountryProperty(
        fallbackProperty,
        decodedSlug,
        normalizedSlug,
        potentialId
      );

      return NextResponse.json(normalizedFallback);
    }

    return NextResponse.json(
      { error: 'Emlak bulunamadı' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Property slug API Error:', error);
    return NextResponse.json(
      { error: 'Emlak detayları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
