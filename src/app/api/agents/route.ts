import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM agents WHERE is_active = 1 ORDER BY created_at DESC'
    );
    const agents = rows as any[];
    
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate agent ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    const agentId = `AGT${timestamp}${random}`;
    
    const [result] = await pool.query(
      `INSERT INTO agents (
        id, name, email, phone, photo, company, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        agentId,
        body.name,
        body.email,
        body.phone || null,
        body.photo || null,
        body.company || null,
        true
      ]
    );
    
    // Fetch the created agent
    const [rows] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [agentId]
    );
    const agent = (rows as any[])[0];
    
    return NextResponse.json(agent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating agent:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Emlak danışmanı eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const [result] = await pool.query(
      `UPDATE agents SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        photo = ?, 
        company = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        updateData.name,
        updateData.email,
        updateData.phone || null,
        updateData.photo || null,
        updateData.company || null,
        id
      ]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Emlak danışmanı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Fetch the updated agent
    const [rows] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [id]
    );
    const agent = (rows as any[])[0];
    
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Emlak danışmanı ID gerekli' },
        { status: 400 }
      );
    }
    
    const [result] = await pool.query(
      'UPDATE agents SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Emlak danışmanı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Emlak danışmanı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
