import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // Basit bir sorgu deneyelim
    const [rows] = await pool.execute(
      'SELECT * FROM properties LIMIT 1'
    );
    
    console.log('Test query result:', rows);
    
    return NextResponse.json({ 
      success: true,
      data: rows,
      message: 'Test query executed successfully'
    });
  } catch (error) {
    console.error('Test query error:', error);
    return NextResponse.json({ 
      success: false,
      error: error,
      message: 'Test query failed'
    }, { status: 500 });
  }
}
