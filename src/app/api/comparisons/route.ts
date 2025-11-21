import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COMPARISONS_FILE = path.join(process.cwd(), 'data', 'comparisons.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(COMPARISONS_FILE)) {
    fs.writeFileSync(COMPARISONS_FILE, JSON.stringify([]));
  }
}

// GET - Retrieve a comparison by ID
export async function GET(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const data = fs.readFileSync(COMPARISONS_FILE, 'utf-8');
    const comparisons = JSON.parse(data);
    const comparison = comparisons.find((c: any) => c.id === id);

    if (!comparison) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404 });
    }

    // Normalize property IDs to strings before returning
    comparison.propertyIds = (comparison.propertyIds || []).map((pid: any) => String(pid));
    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Error reading comparison:', error);
    return NextResponse.json({ error: 'Failed to read comparison' }, { status: 500 });
  }
}

// POST - Create a new comparison
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const { propertyIds } = body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json({ error: 'Property IDs required' }, { status: 400 });
    }

    const id = generateId();
    // Normalize all property IDs to string to avoid numeric/string mismatches
    const normalizedPropertyIds = Array.from(new Set(propertyIds.map((pid: any) => String(pid))));
    const comparison = {
      id,
      propertyIds: normalizedPropertyIds,
      createdAt: new Date().toISOString(),
    };

    const data = fs.readFileSync(COMPARISONS_FILE, 'utf-8');
    const comparisons = JSON.parse(data);
    comparisons.push(comparison);
    fs.writeFileSync(COMPARISONS_FILE, JSON.stringify(comparisons, null, 2));

    return NextResponse.json({ id, url: `/comparison/${id}` });
  } catch (error) {
    console.error('Error creating comparison:', error);
    return NextResponse.json({ error: 'Failed to create comparison' }, { status: 500 });
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
