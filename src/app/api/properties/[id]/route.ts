import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';
import { logActivity } from '@/lib/server-activity-logger';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    const property = (rows as any[])[0];
    
    // JSON alanları parse et
    if (property.images) {
      try {
        property.images = JSON.parse(property.images);
      } catch (e) {
        property.images = [];
      }
    }
    
    if (property.panoramic_images) {
      try {
        property.panoramic_images = JSON.parse(property.panoramic_images);
      } catch (e) {
        property.panoramic_images = [];
      }
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Property Detail API Error:', error);
    return NextResponse.json(
      { error: 'Emlak detayları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Güncelleme öncesi mevcut property'yi al
    const [oldRows] = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );
    
    if ((oldRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    const oldProperty = (oldRows as any[])[0];

    // JSON alanları stringify et
    if (body.images && Array.isArray(body.images)) {
      body.images = JSON.stringify(body.images);
    }
    if (body.panoramic_images && Array.isArray(body.panoramic_images)) {
      body.panoramic_images = JSON.stringify(body.panoramic_images);
    }

    // SQL güncelleme sorgusu oluştur
    const fields = Object.keys(body);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => body[field]);
    values.push(id); // WHERE koşulu için ID'yi ekle

    await pool.execute(
      `UPDATE properties SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Güncellenmiş property'yi getir
    const [updatedRows] = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );
    
    const property = (updatedRows as any[])[0];

    // JSON alanları parse et
    if (property.images) {
      try {
        property.images = JSON.parse(property.images);
      } catch (e) {
        property.images = [];
      }
    }

    // Değişiklikleri tespit et
    const changes: any = {};
    const fieldsToCheck = ['title', 'price', 'type', 'category_main', 'category_sub', 'description'];
    
    fieldsToCheck.forEach(field => {
      if (oldProperty[field] !== body[field]) {
        changes[field] = {
          old: oldProperty[field],
          new: body[field]
        };
      }
    });

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'property_update',
      description: `${property.title} başlıklı emlak güncellendi`,
      targetType: 'property',
      targetId: property.id,
      status: 'success',
      details: {
        changes,
        updatedFields: Object.keys(changes)
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Property Update API Error:', error);
    return NextResponse.json(
      { error: 'Emlak güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    const property = (rows as any[])[0];

    // JSON alanları parse et
    let images = [];
    if (property.images) {
      try {
        images = JSON.parse(property.images);
      } catch (e) {
        images = [];
      }
    }

    // Cloudinary'den resimleri sil
    if (images && images.length > 0) {
      const deletePromises = images.map(async (imageUrl: string) => {
        try {
          // URL'den public ID çıkar (irem-properties/filename formatında)
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          const publicId = `irem-properties/${fileName}`;
          
          return await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Cloudinary resim silme hatası:', error);
          return false;
        }
      });

      await Promise.all(deletePromises);
    }

    // Silme işleminden önce property detaylarını kaydet
    const propertyDetails = {
      id: property.id,
      title: property.title,
      type: property.type,
      category_main: property.category_main,
      category_sub: property.category_sub,
      price: property.price,
      city: property.city,
      district: property.district
    };

    // MySQL'den emlakı sil
    await pool.execute('DELETE FROM properties WHERE id = ?', [id]);

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'property_delete',
      description: `${property.title} başlıklı emlak silindi`,
      targetType: 'property',
      targetId: property.id,
      status: 'success',
      details: {
        deletedProperty: propertyDetails,
        deletedImages: images?.length || 0
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(
      { message: 'Emlak ve resimleri başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Property Delete API Error:', error);
    return NextResponse.json(
      { error: 'Emlak silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
