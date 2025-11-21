import { NextResponse } from 'next/server';
// import pool from '@/lib/mysql'; // MySQL devre dışı
import { authenticateUser } from '@/lib/auth';
import { readUsers, writeUsers } from '@/lib/server-utils';
import { LoginCredentials, User } from '@/types/user';
// import { logActivity } from '@/lib/server-activity-logger'; // MySQL bağımlı

export async function POST(request: Request) {
  try {
    const credentials: LoginCredentials = await request.json();

    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    // JSON'dan kullanıcıyı doğrula
    const user = await authenticateUser(credentials);

    if (!user) {
      console.log(`Başarısız giriş denemesi: ${credentials.email}`);
      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // Son giriş zamanını güncelle
    const users = readUsers();
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, lastLogin: new Date().toISOString() }
        : u
    );
    writeUsers(updatedUsers);

    console.log(`Başarılı giriş: ${user.name} (${user.email})`);

    // Şifreyi response'dan çıkar
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
