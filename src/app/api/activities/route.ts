import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { UserActivity } from '@/types/activity';

// GET /api/activities - Aktiviteleri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = Number(searchParams.get('limit')) || 10;

    switch (type) {
      case 'stats':
        // Son 30 günlük istatistikler
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Bugünün başlangıcı
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Bu haftanın başlangıcı (Pazartesi)
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 1);
        thisWeek.setHours(0, 0, 0, 0);

        // Bu ayın başlangıcı
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        // Toplam aktivite sayısı
        const [totalCountResult] = await pool.query(
          'SELECT COUNT(*) as count FROM activities'
        );
        const totalCount = (totalCountResult as any[])[0].count;

        // Bugünkü aktiviteler
        const [todayCountResult] = await pool.query(
          'SELECT COUNT(*) as count FROM activities WHERE DATE(created_at) = DATE(?)',
          [today.toISOString()]
        );
        const todayCount = (todayCountResult as any[])[0].count;

        // Bu haftaki aktiviteler
        const [weekCountResult] = await pool.query(
          'SELECT COUNT(*) as count FROM activities WHERE YEARWEEK(created_at) = YEARWEEK(?)',
          [thisWeek.toISOString()]
        );
        const weekCount = (weekCountResult as any[])[0].count;

        // Bu ayki aktiviteler
        const [monthCountResult] = await pool.query(
          'SELECT COUNT(*) as count FROM activities WHERE YEAR(created_at) = YEAR(?) AND MONTH(created_at) = MONTH(?)',
          [thisMonth.toISOString(), thisMonth.toISOString()]
        );
        const monthCount = (monthCountResult as any[])[0].count;

        // En çok yapılan işlemler
        const [topActions] = await pool.query(
          `SELECT action, COUNT(*) as count 
           FROM activities 
           GROUP BY action 
           ORDER BY count DESC 
           LIMIT 5`
        );

        // En aktif kullanıcılar
        const [topUsers] = await pool.query(
          `SELECT user_id, user_name, COUNT(*) as count 
           FROM activities 
           GROUP BY user_id, user_name 
           ORDER BY count DESC 
           LIMIT 5`
        );

        const formattedStats = {
          totalActivities: totalCount,
          todayActivities: todayCount,
          weekActivities: weekCount,
          monthActivities: monthCount,
          topActions: topActions,
          topUsers: topUsers
        };

        return NextResponse.json(formattedStats);

      case 'recent':
      default:
        const [activities] = await pool.query(
          `SELECT * FROM activities 
           ORDER BY created_at DESC 
           LIMIT ?`,
          [limit]
        );

        // JSON stringlerini parse et
        const formattedActivities = (activities as any[]).map(activity => ({
          ...activity,
          details: JSON.parse(activity.details || '{}')
        }));

        return NextResponse.json(formattedActivities);
    }
  } catch (error) {
    console.error('Aktivite logları getirilirken hata:', error);
    return NextResponse.json(
      { 
        error: 'Aktivite logları getirilemedi',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST endpoint kaldırıldı - artık server-side activity logger kullanıyoruz
