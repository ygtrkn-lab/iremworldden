import { NextRequest, NextResponse } from 'next/server';
import { readStores, writeStores } from '@/lib/server-utils';
import { logActivity } from '@/lib/server-activity-logger';
import { StoreFilters } from '@/types/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Filtreleri al
    const filters: StoreFilters = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      country: searchParams.get('country') || undefined,
      specialty: searchParams.get('specialty') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      verified: searchParams.get('verified') === 'true' ? true : undefined,
    };

    let stores = readStores();

    // Filtreleme
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      stores = stores.filter(
        s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.contact.city.toLowerCase().includes(searchLower)
      );
    }

    if (filters.city) {
      stores = stores.filter(s => s.contact.city === filters.city);
    }

    if (filters.country) {
      stores = stores.filter(s => s.contact.country === filters.country);
    }

    if (filters.specialty) {
      stores = stores.filter(s => s.specialties.includes(filters.specialty!));
    }

    if (filters.featured !== undefined) {
      stores = stores.filter(s => s.featured === filters.featured);
    }

    if (filters.verified !== undefined) {
      stores = stores.filter(s => s.verified === filters.verified);
    }

    // Sıralama (varsayılan: öne çıkanlar önce, sonra isme göre)
    stores.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name, 'tr-TR');
    });

    return NextResponse.json({
      success: true,
      data: stores,
      meta: {
        total: stores.length,
        filtered: Object.keys(filters).length > 0,
      },
    });
  } catch (error) {
    console.error('Stores API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // permission check
    const role = request.headers.get('x-user-role') || 'system';
    if (!['admin', 'owner', 'super_admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const stores = readStores();

    // Basic validation
    if (!body.name || !body.contact || !body.contact.email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const id = `store-${Date.now()}`;
    const slug = (body.slug || body.name).toLowerCase().replace(/[^a-z0-9-çğıöşü]/g, '-').replace(/-+/g, '-');

    const newStore = {
      id,
      slug,
      name: body.name,
      legalName: body.legalName || '',
      description: body.description || '',
      tagline: body.tagline || '',
      contact: body.contact,
      logo: body.logo || '',
      coverImage: body.coverImage || '',
      brandColor: body.brandColor || '',
      stats: body.stats || { activeListings: 0, yearsInBusiness: 0 },
      specialties: body.specialties || [],
      serviceAreas: body.serviceAreas || [],
      featured: !!body.featured,
      verified: !!body.verified,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      social: body.social || {},
      licenseNumber: body.licenseNumber || '',
      taxNumber: body.taxNumber || '',
      foundedYear: body.foundedYear || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
    };

    stores.push(newStore);
    writeStores(stores);

    // Log activity
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'store_create',
      description: `Yeni mağaza oluşturuldu: ${newStore.name}`,
      targetType: 'store',
      targetId: newStore.id,
      status: 'success'
    });

    return NextResponse.json({ success: true, data: newStore }, { status: 201 });
  } catch (error) {
    console.error('Create store error', error);
    return NextResponse.json({ success: false, error: 'Failed to create store' }, { status: 500 });
  }
}
