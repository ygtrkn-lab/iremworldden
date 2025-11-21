import { v2 as cloudinary } from 'cloudinary';

// Environment variables kontrolü - runtime'da da çalışacak şekilde
function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
}

// Cloudinary konfigürasyonu - her kullanımda yeniden kontrol et
function configureCloudinary() {
  const config = getCloudinaryConfig();
  
  console.log('Cloudinary config check:', {
    cloud_name: config.cloud_name ? 'SET' : 'MISSING',
    api_key: config.api_key ? 'SET' : 'MISSING',
    api_secret: config.api_secret ? 'SET' : 'MISSING'
  });

  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
  });

  return config;
}

export default cloudinary;

// Resim yükleme fonksiyonu
export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
  folder: string = 'irem-properties'
): Promise<string> {
  try {
    // Cloudinary'yi yeniden konfigüre et
    const config = configureCloudinary();
    
    // Environment variables kontrolü
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.warn('Cloudinary environment variables missing, using fallback method');
      console.warn('Missing vars:', {
        cloud_name: !config.cloud_name,
        api_key: !config.api_key,
        api_secret: !config.api_secret
      });
      // Fallback: Local storage simulation for development
      const fallbackUrl = `/uploads/properties/${fileName}.jpg`;
      console.log('Using fallback URL:', fallbackUrl);
      return fallbackUrl;
    }

    console.log('Starting Cloudinary upload:', {
      fileName,
      folder,
      bufferSize: file.length,
      cloudName: config.cloud_name
    });

    // Dosya tipini belirle (video mu resim mi)
    const isVideo = fileName.includes('video') || 
                   file.toString('hex', 0, 4) === '66747970' || // MP4 signature
                   file.toString('hex', 0, 8) === '000000186674797071742020'; // MOV signature
    
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: isVideo ? 'video' : 'image',
        folder: folder,
        public_id: fileName,
        timeout: 120000 // 2 dakika timeout (video için daha uzun)
      };

      // Video için farklı transformasyonlar
      if (isVideo) {
        uploadOptions.transformation = [
          { quality: 'auto' },
          { format: 'auto' }
        ];
      } else {
        uploadOptions.transformation = [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ];
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(file);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Cloudinary upload error details:', error);
    
    // Fallback durumunda local URL döndür
    const fallbackUrl = `/uploads/properties/${fileName}.jpg`;
    console.log('Cloudinary failed, using fallback URL:', fallbackUrl);
    
    if (error instanceof Error) {
      console.warn(`Cloudinary yükleme hatası: ${error.message}, fallback kullanılıyor`);
    }
    
    return fallbackUrl;
  }
}

// Resim silme fonksiyonu
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

// URL'den public ID çıkarma fonksiyonu
export function extractPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.split('.')[0];
}
