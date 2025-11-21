import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logActivity } from '@/lib/server-activity-logger';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı getirilemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Password field'ını güncelleme işleminden çıkar
    const { password, _id, ...dataToUpdate } = updateData;

    // SQL güncelleme sorgusu oluştur
    const fields = Object.keys(dataToUpdate);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => dataToUpdate[field]);
    values.push(id); // WHERE koşulu için ID'yi ekle

    // Prevent non-super_admin users from assigning 'owner'
    const requesterRole = request.headers.get('x-user-role') || 'system';
    if (dataToUpdate.role === 'owner' && requesterRole !== 'super_admin') {
      return NextResponse.json({ error: 'Yetkisiz: Yalnızca super_admin owner atayabilir' }, { status: 403 });
    }

    await pool.execute(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Güncellenmiş kullanıcıyı getir
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const updatedUser = (rows as any[])[0];

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'user_update',
      description: `${updatedUser.name} adlı kullanıcı güncellendi`,
      targetType: 'user',
      targetId: updatedUser.id,
      status: 'success',
      details: {
        updatedFields: Object.keys(dataToUpdate)
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenemedi' },
      { status: 500 }
    );
  }
}
