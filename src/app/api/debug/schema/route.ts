import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.execute('DESCRIBE properties');
    return NextResponse.json({ schema: rows });
  } catch (error) {
    console.error('Schema debug error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
