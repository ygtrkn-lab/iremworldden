import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Gelen isteğin IP adresini al
    const ip = request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('cf-connecting-ip') ||
               '127.0.0.1';

    // Yanıtı oluştur ve IP adresini header'a ekle
    const response = NextResponse.next();
    response.headers.set('x-client-ip', ip);

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Middleware'in çalışacağı path'leri belirt - Sadece admin paneli için
export const config = {
  matcher: [
    // Admin panel routes removed — no paths matched
  ],
};
