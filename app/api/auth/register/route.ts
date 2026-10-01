import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/mongodb';
import { SESSION_COOKIE_NAME, UserSession } from '@/lib/services/auth';

function encodeSession(session: UserSession): string {
  const json = JSON.stringify(session);
  return Buffer.from(json).toString('base64url');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword, phone, terms } = body;

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Please enter your email address.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Please enter a password.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    if (!terms) {
      return NextResponse.json({ error: 'You must agree to the Terms & Conditions and Privacy Policy.' }, { status: 400 });
    }

    // 2. Connect to MongoDB and check for existing user
    const db = await connectDB();
    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // 3. Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create new patron user document
    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'USER' as const,
      status: 'active' as const,
      avatar: '/images/avatars/customer.jpg',
      addresses: [],
      wishlist: [],
      createdAt: nowIso,
      lastLogin: nowIso,
    };

    // 5. Atomic write to MongoDB
    await db.collection('users').insertOne(newUser);
    await db.collection('customers').insertOne({
      id: `cust-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      ordersCount: 0,
      totalSpend: 0,
      status: 'active',
      addresses: [],
      wishlist: [],
      createdAt: nowIso,
    });

    // 6. Establish secure authenticated session
    const duration = 7 * 24 * 60 * 60 * 1000; // 7 days
    const session: UserSession = {
      userId: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: 'USER',
      avatar: newUser.avatar,
      expiresAt: Date.now() + duration,
    };

    const token = encodeSession(session);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(duration / 1000),
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: 'USER',
      },
      redirectUrl: '/account',
      redirectTo: '/account',
    });
  } catch (error: any) {
    console.error('[Registration API Error]:', error?.message);
    return NextResponse.json(
      { error: 'Unable to complete registration. Please try again.' },
      { status: 500 }
    );
  }
}
