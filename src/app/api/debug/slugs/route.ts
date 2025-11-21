import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id, title, slug FROM properties LIMIT 10');
    
    return NextResponse.json({ 
      success: true,
      properties: rows
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
