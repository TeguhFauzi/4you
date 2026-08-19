import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const userData = verifySessionToken(sessionCookie.value);
    if (!userData) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: userData });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
