import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // Check what tables exist
    const [tables] = await pool.execute('SHOW TABLES');
    
    // Check structure of properties table if it exists
    let propertiesStructure = null;
    try {
      const [structure] = await pool.execute('DESCRIBE properties');
      propertiesStructure = structure;
    } catch (e) {
      console.log('properties table does not exist');
    }
    
    // Check if Property table exists
    let PropertyStructure = null;
    try {
      const [structure] = await pool.execute('DESCRIBE Property');
      PropertyStructure = structure;
    } catch (e) {
      console.log('Property table does not exist');
    }
    
    return NextResponse.json({ 
      tables,
      propertiesStructure,
      PropertyStructure
    });
  } catch (error: any) {
    console.error('Error checking table structure:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
