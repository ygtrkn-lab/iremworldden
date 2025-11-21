import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.execute('DESCRIBE properties');
    return NextResponse.json({ columns: rows });
  } catch (error: any) {
    console.error('Error describing table:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
