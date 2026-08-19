import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { donations } from '@/lib/schema';
export async function GET() {
  try {
    const allDonations = await db.select().from(donations);
    return NextResponse.json({ data: allDonations });
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return NextResponse.json({ data: [], error: 'Failed to fetch donations' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDonation = {
      id: `DON-${Date.now()}`,
      donorName: body.donorName,
      donorType: body.donorType, 
      amount: Number(body.amount),
      message: body.message || null,
    };
    await db.insert(donations).values(newDonation);
    return NextResponse.json({ success: true, data: newDonation });
  } catch (error) {
    console.error('Failed to record donation:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan donasi' }, { status: 500 });
  }
}
