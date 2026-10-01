import { NextResponse } from 'next/server';
import { getCurrentUser, logoutUser } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const roleUpper = session.role?.toUpperCase();
  const isAdmin = roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN' || session.role === 'manager' || session.role === 'editor';

  return NextResponse.json({
    authenticated: true,
    user: session,
    isAdmin,
  });
}

export async function POST() {
  await logoutUser();
  return NextResponse.json({ success: true });
}
