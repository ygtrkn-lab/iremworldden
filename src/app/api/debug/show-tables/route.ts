import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.execute('SHOW TABLES');
    return NextResponse.json({ tables: rows });
  } catch (error: any) {
    console.error('Error showing tables:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
