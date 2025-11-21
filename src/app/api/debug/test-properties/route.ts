import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // Simple query to get first 5 properties
    const [rows] = await pool.execute('SELECT * FROM properties LIMIT 5');
    const properties = rows as any[];
    
    return NextResponse.json({ 
      count: properties.length,
      properties: properties.map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        price: p.price,
        city: p.city,
        created_at: p.created_at
      }))
    });
  } catch (error: any) {
    console.error('Error fetching test properties:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
