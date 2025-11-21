import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { hashPassword } from '@/lib/auth';
import { User, CreateUserData } from '@/types/user';
import { logActivity } from '@/lib/server-activity-logger';

// GET /api/users - Tüm kullanıcıları getir
export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at, updated_at FROM users'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST /api/users - Yeni kullanıcı ekle
export async function POST(request: Request) {
  try {
    const userData: CreateUserData = await request.json();
    
    // Gerekli alanların kontrolü
    if (!userData.email || !userData.name || !userData.password || !userData.role) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik (email, name, password, role)' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (userData.password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Email benzersizliği kontrolü
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    );
    
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(userData.password);

    // Kullanıcı sayısını al ve ID oluştur
    const [countResult] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const userCount = (countResult as any[])[0].count;
    const userId = `U${String(userCount + 1).padStart(3, '0')}`;

    // Avatar URL'ini belirle
    const avatarUrl = userData.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`;

    // Sanity checks: only super_admin can create an 'owner' role
    const creatorRole = request.headers.get('x-user-role') || 'system';
    if (userData.role === 'owner' && creatorRole !== 'super_admin') {
      return NextResponse.json({ error: 'Only super_admin can create an owner account' }, { status: 403 });
    }

    // Yeni kullanıcı oluştur
    await pool.execute(
      `INSERT INTO users (id, name, email, phone, password, role, avatar, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, userData.name, userData.email, userData.phone || null, hashedPassword, userData.role, avatarUrl, true]
    );

    // Oluşturulan kullanıcıyı getir (şifre olmadan)
    const [newUserRows] = await pool.execute(
      'SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    const newUser = (newUserRows as any[])[0];

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'user_create',
      description: `${newUser.name} adlı yeni kullanıcı oluşturuldu`,
      targetType: 'user',
      targetId: newUser.id,
      status: 'success',
      details: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı eklenemedi' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Kullanıcıları güncelle
export async function PUT(request: Request) {
  try {
    const updatedUsers: User[] = await request.json();
    
    // Her kullanıcıyı güncelle
    const updatePromises = updatedUsers.map(async (userData) => {
      const { password, ...updateData } = userData as any;
      
      // SQL güncelleme sorgusu oluştur
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updateData[field]);
      values.push(userData.id); // WHERE koşulu için ID'yi ekle
      
      // Prevent non-super_admins from assigning 'owner' role through updates
      const roleBecomingOwner = updateData.role === 'owner';
      const requesterRole = request.headers.get('x-user-role') || 'system';
      if (roleBecomingOwner && requesterRole !== 'super_admin') {
        throw new Error('Only super_admin can assign owner role');
      }

      await pool.execute(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      // Güncellenmiş kullanıcıyı getir
      const [updatedRows] = await pool.execute(
        'SELECT id, name, email, phone, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
        [userData.id]
      );
      return (updatedRows as any[])[0];
    });

    const results = await Promise.all(updatePromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Kullanıcılar güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE /api/users?id={userId} - Kullanıcı sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Silinecek kullanıcıyı önce getir
    const [userRows] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );
    
    if ((userRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    const deletedUser = (userRows as any[])[0];

    // Kullanıcıyı sil
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'user_delete',
      description: `${deletedUser.name} adlı kullanıcı silindi`,
      targetType: 'user',
      targetId: deletedUser.id,
      status: 'success',
      details: {
        deletedUser: {
          name: deletedUser.name,
          email: deletedUser.email,
          role: deletedUser.role
        }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    );
  }
}
