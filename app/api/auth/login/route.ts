import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await authenticateUser(email, password, Boolean(rememberMe));

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.user,
      redirectUrl: result.redirectUrl,
    });
  } catch (error: any) {
    // Never expose stack trace or database credentials
    console.error('[Login API Error]:', error?.message);
    return NextResponse.json({ error: 'Authentication service temporarily unavailable' }, { status: 500 });
  }
}
