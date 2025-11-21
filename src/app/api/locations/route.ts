import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get('type'); // Property type filter (sale/rent)

    // Base query to get all locations from active properties
    let query = `
      SELECT DISTINCT country, city, district 
      FROM properties 
      WHERE status = ?
    `;
    const values: any[] = ['active'];

    // Add property type filter if specified
    if (propertyType) {
      query += ' AND type = ?';
      values.push(propertyType);
    }

    query += ' ORDER BY country, city, district';

    console.log('Executing locations query:', query);
    console.log('Query params:', values);

    const [rows] = await pool.execute(query, values);
    const properties = rows as any[];

    // Build the location data structure expected by AdvancedSearchBar
    const countries: Array<{value: string, label: string}> = [];
    const cities: { [country: string]: Array<{value: string, label: string}> } = {};
    const districts: { [city: string]: Array<{value: string, label: string}> } = {};

    // Process each property to build location hierarchy
    properties.forEach(property => {
      const { country, city, district } = property;

      // Add country if not already added
      if (country && !countries.find(c => c.value === country)) {
        countries.push({
          value: country,
          label: country === 'TR' ? 'Türkiye' : country
        });
      }

      // Add city to country
      if (country && city) {
        if (!cities[country]) {
          cities[country] = [];
        }
        if (!cities[country].find(c => c.value === city)) {
          cities[country].push({
            value: city,
            label: city
          });
        }
      }

      // Add district to city
      if (city && district) {
        if (!districts[city]) {
          districts[city] = [];
        }
        if (!districts[city].find(d => d.value === district)) {
          districts[city].push({
            value: district,
            label: district
          });
        }
      }
    });

    // Sort all arrays alphabetically
    countries.sort((a, b) => a.label.localeCompare(b.label, 'tr'));
    
    Object.keys(cities).forEach(country => {
      cities[country].sort((a, b) => a.label.localeCompare(b.label, 'tr'));
    });

    Object.keys(districts).forEach(city => {
      districts[city].sort((a, b) => a.label.localeCompare(b.label, 'tr'));
    });

    // Return the structured data expected by AdvancedSearchBar
    return NextResponse.json({
      countries,
      cities,
      districts
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Lokasyonlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
