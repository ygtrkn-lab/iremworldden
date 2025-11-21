import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // First check table structure
    const [columns] = await pool.query('DESCRIBE agents');
    
    // Get all agents
    const [rows] = await pool.query('SELECT * FROM agents ORDER BY name ASC');
    const agents = rows as any[];
    
    return NextResponse.json({ 
      tableStructure: columns,
      count: agents.length,
      agents: agents
    });
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
