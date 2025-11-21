import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'irem-properties';

    console.log('File received:', file?.name, 'Size:', file?.size, 'Type:', file?.type);

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: `Geçersiz dosya tipi: ${file.type}. Sadece JPEG, PNG, GIF, WEBP ve video (MP4, MOV, AVI, WMV) formatları desteklenir.` },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        { error: `Dosya boyutu çok büyük: ${Math.round(file.size / 1024 / 1024)}MB. Maksimum 50MB desteklenir.` },
        { status: 400 }
      );
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}`;

    console.log('Generated filename:', fileName);

    // Dosyayı buffer'a çevir
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer created, size:', buffer.length);

    // Cloudinary'ye yükle
    console.log('Uploading to Cloudinary...');
    const cloudinaryUrl = await uploadToCloudinary(buffer, fileName, folder);
    console.log('Upload successful, URL:', cloudinaryUrl);

    // Eğer fallback URL ise, dosyayı local olarak da kaydet
    if (cloudinaryUrl.startsWith('/uploads/')) {
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Public uploads dizinini oluştur
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'properties');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Dosyayı kaydet
        const filePath = path.join(uploadsDir, `${fileName}.jpg`);
        fs.writeFileSync(filePath, buffer);
        console.log('File saved locally:', filePath);
      } catch (localError) {
        console.warn('Local file save failed:', localError);
        // Local kayıt başarısız olsa da devam et
      }
    }

    return NextResponse.json({ 
      url: cloudinaryUrl,
      success: true,
      fileName: fileName,
      method: cloudinaryUrl.startsWith('/uploads/') ? 'local' : 'cloudinary'
    });

  } catch (error) {
    console.error('Upload error details:', error);
    
    let errorMessage = 'Dosya yüklenemedi';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
