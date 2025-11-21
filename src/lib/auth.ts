// import bcrypt from 'bcryptjs'; // DEVRE DIŞI
import { readUsers, writeUsers } from './server-utils';

import { User, LoginCredentials } from '@/types/user';

export async function hashPassword(password: string): Promise<string> {
  // Bcrypt devre dışı - düz metin şifre döndür
  return password;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Bcrypt devre dışı - düz metin karşılaştırma
  return password === hashedPassword;
}

export async function authenticateUser(credentials: LoginCredentials): Promise<User | null> {
  const users = readUsers();
  const user = users.find(u => u.email === credentials.email && u.isActive);
  
  if (!user) {
    return null;
  }

  // Düz metin şifre karşılaştırması
  const isValid = credentials.password === user.password;
  return isValid ? user : null;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return false;
  }

  const user = users[userIndex];
  
  // Düz metin şifre kontrolü
  if (currentPassword !== user.password) {
    return false;
  }

  // Yeni şifreyi düz metin olarak kaydet
  users[userIndex].password = newPassword;
  users[userIndex].updatedAt = new Date().toISOString();
  
  writeUsers(users);
  return true;
}
