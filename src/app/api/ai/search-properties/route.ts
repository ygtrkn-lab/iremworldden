import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

// AI-optimized property search endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, district, type, category, minPrice, maxPrice, minSize, maxSize, rooms, limit = 5 } = body;

    const conditions: string[] = [];
    const values: any[] = [];

    // City filter (required for country-specific AI)
    if (city) {
      conditions.push('city LIKE ?');
      values.push(`%${city}%`);
    }

    if (district) {
      conditions.push('district LIKE ?');
      values.push(`%${district}%`);
    }

    if (type) {
      conditions.push('type = ?');
      values.push(type);
    }

    if (category) {
      conditions.push('category = ?');
      values.push(category);
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

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM properties ${whereClause}`,
      values
    );
    const total = (countResult as any[])[0].total;

    // Get top results (limit to 5 for AI context)
    const query = `SELECT 
      id, title, type, category, price, city, district, neighborhood,
      netSize, grossSize, rooms, bathrooms, age
      FROM properties ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ${Math.min(limit, 10)}`;

    const [rows] = await pool.execute(query, values);

    const properties = (rows as any[]).map((prop: any) => ({
      id: prop.id,
      title: prop.title,
      type: prop.type,
      category: prop.category,
      price: prop.price,
      city: prop.city,
      district: prop.district,
      neighborhood: prop.neighborhood,
      netSize: prop.netSize,
      grossSize: prop.grossSize,
      rooms: prop.rooms,
      bathrooms: prop.bathrooms,
      age: prop.age,
      link: `/property/${prop.id}`,
    }));

    return NextResponse.json({
      success: true,
      total,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json(
      { success: false, error: 'Property search failed' },
      { status: 500 }
    );
  }
}
