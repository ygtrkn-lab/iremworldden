// CDN servisi için yardımcı fonksiyonlar (Cloudinary)

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageToCDN(file: File, folder: string = 'irem-users'): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return {
      success: true,
      url: result.url
    };
  } catch (error) {
    console.error('CDN upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

// Cloudinary URL'den public ID çıkarma
export function extractPublicIdFromCloudinaryUrl(url: string): string {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.split('.')[0];
}

// Resim boyutlandırma URL'i oluşturma
export function getResizedImageUrl(url: string, width: number, height?: number): string {
  if (!url.includes('cloudinary.com')) return url;
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const transformation = height 
    ? `c_fill,w_${width},h_${height}` 
    : `c_limit,w_${width}`;
    
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}
