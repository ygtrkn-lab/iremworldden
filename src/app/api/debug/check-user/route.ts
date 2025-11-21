import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { verifyPassword } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Get user
    const [userRows] = await pool.execute(
      'SELECT id, name, email, password, is_active FROM users WHERE email = ?',
      [email]
    );

    const users = userRows as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    
    // Check password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
      },
      passwordValid: isPasswordValid,
      hashedPassword: user.password.substring(0, 20) + '...' // Show first 20 chars for debugging
    });
  } catch (error: any) {
    console.error('Error checking user:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
