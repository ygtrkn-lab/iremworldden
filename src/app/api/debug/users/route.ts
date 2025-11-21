import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // First check table structure
    const [columns] = await pool.query('DESCRIBE users');
    
    // Get first 5 users from the existing users table
    const [rows] = await pool.query('SELECT * FROM users LIMIT 5');
    const users = rows as any[];
    
    return NextResponse.json({ 
      tableStructure: columns,
      count: users.length,
      users: users
    });
  } catch (error: any) {
    console.error('Error fetching test users:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
