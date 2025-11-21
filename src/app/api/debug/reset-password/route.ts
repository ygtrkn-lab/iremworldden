import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();
    
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password
    const [result] = await pool.execute(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      [hashedPassword, email]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Password updated for ${email}`,
      hashedPassword: hashedPassword.substring(0, 20) + '...'
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
