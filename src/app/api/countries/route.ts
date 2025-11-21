import { NextResponse } from 'next/server';
import countryIndex from '@/data/countries/index.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: countryIndex
    });
  } catch (error) {
    console.error('Countries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
