import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const slug = 'satilik-emlak-bagcilarin-merkezinde-kacirilmayacak-firsat-5';
    
    // Log the query
    console.log('Testing slug:', slug);
    
    // Execute the query
    const [rows] = await pool.execute(
      'SELECT * FROM properties WHERE slug = ?',
      [slug]
    );
    
    // Log the results
    console.log('Query results:', rows);
    
    return NextResponse.json({
      success: true,
      count: (rows as any[]).length,
      results: rows
    });
    
  } catch (error) {
    console.error('Debug test-slug error:', error);
    return NextResponse.json(
      { error: 'Debug test failed' },
      { status: 500 }
    );
  }
}
