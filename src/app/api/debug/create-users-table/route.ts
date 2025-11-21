import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    // Create User table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS User (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin', 'manager', 'agent') NOT NULL,
        avatar VARCHAR(500) DEFAULT '',
        isActive BOOLEAN DEFAULT TRUE,
        lastLogin VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (isActive)
      )
    `);

    // Create default admin user
    const hashedPassword = await hashPassword('admin123');
    await pool.query(`
      INSERT INTO User (id, name, email, password, role, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE email = email
    `, ['admin1', 'Admin User', 'admin@iremworld.com', hashedPassword, 'super_admin', true]);

    return NextResponse.json({ 
      message: 'User table created and default admin user added',
      defaultCredentials: {
        email: 'admin@iremworld.com',
        password: 'admin123'
      }
    });
  } catch (error: any) {
    console.error('Error creating user table:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: error.message 
    }, { status: 500 });
  }
}
