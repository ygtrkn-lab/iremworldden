import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // First check table structure
    const [columns] = await pool.query('DESCRIBE activities');
    
    // Get latest 5 activities
    const [rows] = await pool.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 5');
    const activities = rows as any[];
    
    return NextResponse.json({ 
      tableStructure: columns,
      count: activities.length,
      activities: activities
    });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
