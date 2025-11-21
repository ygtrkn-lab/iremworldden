import pool from '@/lib/mysql';

export async function logActivity(activityData: {
  userId: string;
  userName: string;
  userEmail?: string;
  action: string;
  description: string;
  targetType?: string;
  targetId?: string;
  status?: 'success' | 'failed' | 'warning';
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    // Aktivite ID'si oluştur - timestamp bazlı
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    const activityId = `ACT${timestamp}${random}`;

    console.log('Creating activity:', {
      id: activityId,
      action: activityData.action,
      description: activityData.description,
      userId: activityData.userId,
      targetType: activityData.targetType
    });

    // Aktiviteyi MySQL'e kaydet - doğru tablo ve sütun adlarını kullan
    await pool.execute(
      `INSERT INTO activities (
        id, user_id, user_name, user_email, action, description, 
        target_type, target_id, status, details, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        activityId,
        activityData.userId,
        activityData.userName,
        activityData.userEmail || null,
        activityData.action,
        activityData.description,
        activityData.targetType || null,
        activityData.targetId || null,
        activityData.status || 'success',
        JSON.stringify(activityData.details || {}),
        activityData.ipAddress || null,
        activityData.userAgent || null
      ]
    );
    
    console.log('Activity successfully logged:', {
      id: activityId,
      action: activityData.action,
      status: activityData.status || 'success'
    });

    return {
      id: activityId,
      ...activityData,
      timestamp: new Date(),
      status: activityData.status || 'success'
    };
  } catch (error) {
    // Detaylı hata loglaması
    console.error('Activity logging error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      activityData: {
        action: activityData.action,
        userId: activityData.userId,
        targetType: activityData.targetType
      }
    });

    // Hata durumunda da devam et ama null döndür
    return null;
  }
}
