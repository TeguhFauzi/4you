import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let allOrders;
    if (status) {
      allOrders = await db.select().from(orders).where(eq(orders.status, status));
    } else {
      allOrders = await db.select().from(orders);
    }
    return NextResponse.json({ data: allOrders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ data: [], error: 'Failed to fetch orders' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduled = new Date(body.scheduledDate);
    scheduled.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (scheduled < tomorrow) {
      return NextResponse.json(
        { success: false, error: 'Pemesanan hanya bisa dilakukan minimal H+1 (besok).' },
        { status: 400 }
      );
    }
    const newOrder = {
      id: `ORD-${Date.now()}`,
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      address: body.address,
      scheduledDate: body.scheduledDate,
      totalPrice: Number(body.totalPrice),
      status: 'upcoming',
      notes: body.notes || null,
    };
    await db.insert(orders).values(newOrder);
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
