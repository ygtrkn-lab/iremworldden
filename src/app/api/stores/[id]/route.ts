import { NextRequest, NextResponse } from 'next/server';
import { readStores, writeStores, findStoreById } from '@/lib/server-utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const store = findStoreById(id);
    if (!store) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    console.error('Get store error', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch store' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const role = request.headers.get('x-user-role') || 'system';
    if (!['admin', 'owner', 'super_admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const stores = readStores();
    const index = stores.findIndex(s => s.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const existing = stores[index];
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };

    stores[index] = updated;
    writeStores(stores);

    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'store_update',
      description: `Mağaza güncellendi: ${updated.name}`,
      targetType: 'store',
      targetId: updated.id,
      status: 'success'
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update store error', error);
    return NextResponse.json({ success: false, error: 'Failed to update store' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const role = request.headers.get('x-user-role') || 'system';
    if (!['admin', 'owner', 'super_admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    let stores = readStores();
    const before = stores.length;
    stores = stores.filter(s => s.id !== id);
    if (stores.length === before) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    writeStores(stores);

    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'store_delete',
      description: `Mağaza silindi: ${id}`,
      targetType: 'store',
      targetId: id,
      status: 'success'
    });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Delete store error', error);
    return NextResponse.json({ success: false, error: 'Failed to delete store' }, { status: 500 });
  }
}
