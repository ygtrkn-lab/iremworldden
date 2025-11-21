import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'sale';
    
    // Simple query first
    const simpleQuery = 'SELECT id, title, type, status, price, city FROM properties WHERE status = ? AND type = ? LIMIT 5';
    const values = ['active', type];
    
    console.log('Executing simple query:', simpleQuery);
    console.log('Query params:', values);
    
    const [rows] = await pool.execute(simpleQuery, values);
    const properties = rows as any[];
    
    return NextResponse.json({ 
      count: properties.length,
      properties,
      query: simpleQuery,
      params: values
    });
  } catch (error: any) {
    console.error('Simple search error:', error);
    return NextResponse.json({ 
      error: 'Simple search error',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
