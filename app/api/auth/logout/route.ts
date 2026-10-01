import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/services/auth';

export async function POST() {
  await logoutUser();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
