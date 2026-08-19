import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { encryptId } from '@/lib/encryption';
export async function GET() {
  try {
    const allServices = await db.select().from(services).where(eq(services.isActive, true));
    const dataWithEncrypted = allServices.map(service => ({
      ...service,
      encryptedId: encryptId(service.id)
    }));
    return NextResponse.json({ data: dataWithEncrypted });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ data: [], error: 'Failed to fetch services' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'add') {
      const newService = {
        id: Date.now().toString(),
        name: body.name,
        description: body.description || '',
        price: Number(body.price),
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80',
        isActive: true,
      };
      await db.insert(services).values(newService);
    } else if (body.action === 'delete') {
      await db.delete(services).where(eq(services.id, body.id));
    } else if (body.action === 'update') {
      await db.update(services).set(body.service).where(eq(services.id, body.id));
    }
    const allServices = await db.select().from(services).where(eq(services.isActive, true));
    const dataWithEncrypted = allServices.map(service => ({
      ...service,
      encryptedId: encryptId(service.id)
    }));
    return NextResponse.json({ success: true, data: dataWithEncrypted });
  } catch (error) {
    console.error('Failed to update services:', error);
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
  }
}
