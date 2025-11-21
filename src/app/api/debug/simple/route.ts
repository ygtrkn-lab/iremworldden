import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM properties');
    return NextResponse.json({ success: true, count: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
