import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // Tüm tabloları listele
    const [tables] = await pool.execute(`SHOW TABLES`);
    console.log('Tables:', tables);

    // Properties tablosunun yapısını göster
    const [columns] = await pool.execute(`DESCRIBE properties`);
    console.log('Properties columns:', columns);

    // Örnek bir property'nin tüm verilerini göster
    const [rows] = await pool.execute('SELECT * FROM properties LIMIT 1');
    console.log('Sample property:', rows[0]);

    return NextResponse.json({ 
      tables,
      columns,
      sampleProperty: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
