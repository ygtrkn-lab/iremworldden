import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Basic filters
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    
    // Build WHERE clause
    const whereConditions: string[] = ['status = ?'];
    const values: any[] = ['active'];

    if (type) {
      whereConditions.push('type = ?');
      values.push(type);
    }

    if (city) {
      whereConditions.push('city = ?');
      values.push(city);
    }

    if (minPrice) {
      whereConditions.push('price >= ?');
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereConditions.push('price <= ?');
      values.push(parseFloat(maxPrice));
    }

    if (search && search.trim()) {
      whereConditions.push('(title LIKE ? OR description LIKE ? OR city LIKE ? OR district LIKE ?)');
      const searchTerm = `%${search.trim()}%`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Build query
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const query = `
      SELECT * FROM properties 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total FROM properties 
      ${whereClause}
    `;

    // Execute queries
    const [countResult] = await pool.query(countQuery, values);
    const totalResults = (countResult as any[])[0].total;
    
    const [rows] = await pool.query(query, values.concat([limit, offset]));
    const properties = rows as any[];

    // Format response
    const formattedProperties = properties.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      type: p.type,
      location: {
        country: p.country,
        city: p.city,
        district: p.district,
        address: p.address
      },
      specs: {
        netSize: p.net_size,
        grossSize: p.gross_size,
        rooms: p.rooms,
        bathrooms: p.bathrooms,
        age: p.age
      },
      category: {
        main: p.category_main,
        sub: p.category_sub
      },
      images: p.images ? JSON.parse(p.images) : [],
      agent: {
        name: p.agent_name,
        phone: p.agent_phone,
        email: p.agent_email,
        photo: p.agent_photo
      },
      createdAt: p.created_at,
      status: p.status
    }));

    // Calculate pagination
    const totalPages = Math.ceil(totalResults / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      properties: formattedProperties,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
    
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Arama sırasında bir hata oluştu',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

