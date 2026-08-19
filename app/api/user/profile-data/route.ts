import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/schema';
import { verifySessionToken } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const sessionData = await verifySessionToken(sessionCookie.value);
    
    if (!sessionData) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userId = sessionData.userId; // Fixed here

    // Fetch Profile Data
    const addresses = await db.query.userAddresses.findMany({
      where: eq(schema.userAddresses.userId, userId)
    });

    const wallet = await db.query.userWallets.findFirst({
      where: eq(schema.userWallets.userId, userId)
    });

    const vouchers = await db.query.userVouchers.findMany({
      where: and(eq(schema.userVouchers.userId, userId), eq(schema.userVouchers.isUsed, false))
    });

    const unreadNotifications = await db.query.notifications.findMany({
      where: and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false))
    });

    const settings = await db.query.userSettings.findFirst({
      where: eq(schema.userSettings.userId, userId)
    });

    return NextResponse.json({
      authenticated: true,
      data: {
        addressCount: addresses.length,
        walletBalance: wallet?.balance || 0,
        activeVouchers: vouchers.length,
        unreadNotifications: unreadNotifications.length,
        language: settings?.language || 'ID'
      }
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
