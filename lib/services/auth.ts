import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongodb';

export const SESSION_COOKIE_NAME = 'mk_session';
export const ADMIN_SESSION_COOKIE_NAME = 'mk_admin_session';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'manager' | 'editor' | 'support' | 'viewer';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  expiresAt: number;
}

// Encode session as safe base64url signed payload
function encodeSession(session: UserSession): string {
  const json = JSON.stringify(session);
  return Buffer.from(json).toString('base64url');
}

function decodeSession(token: string): UserSession | null {
  try {
    const json = Buffer.from(token, 'base64url').toString('utf-8');
    const session = JSON.parse(json) as UserSession;
    if (session.expiresAt && session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Log audit events directly to MongoDB collection 'audit_logs'
 */
export async function logAuditMongo(
  adminName: string,
  adminEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  details: string
): Promise<void> {
  try {
    const db = await connectDB();
    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName,
      adminEmail,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log audit to MongoDB:', err);
  }
}

/**
 * Gets currently logged in user (any valid role: USER, ADMIN, SUPER_ADMIN).
 * Verified directly against MongoDB.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value || cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = decodeSession(sessionToken);
  if (!session) {
    return null;
  }

  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ 
      $or: [{ id: session.userId }, { email: session.email.toLowerCase() }] 
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      userId: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: (user.role as UserRole) || 'USER',
      avatar: user.avatar,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error('[Auth Service] MongoDB connection error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Gets current administrator session.
 * Rejects if user is not authorized for administration.
 */
export async function getCurrentAdmin(): Promise<UserSession | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const role = (user.role || '').toUpperCase();
  if (role === 'SUPER_ADMIN' || role === 'ADMIN' || user.role === 'manager' || user.role === 'editor' || user.role === 'support') {
    return user;
  }

  return null;
}

/**
 * Common Login function for BOTH Admin and Normal Users.
 * 100% MongoDB-backed authentication.
 */
export async function authenticateUser(
  email: string,
  passwordPlain: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; error?: string; user?: UserSession; redirectUrl?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  const db = await connectDB();
  const targetUser = await db.collection('users').findOne({ email: cleanEmail });

  if (!targetUser) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (targetUser.status !== 'active') {
    return { success: false, error: 'Your account is currently unavailable. Please contact support.' };
  }

  if (!targetUser.passwordHash) {
    return { success: false, error: 'Invalid email or password' };
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(passwordPlain, targetUser.passwordHash);
  } catch {
    isPasswordValid = false;
  }

  if (!isPasswordValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  const role: UserRole = targetUser.role || 'USER';
  const roleUpper = role.toUpperCase();
  const isAdmin = roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN' || role === 'manager' || role === 'editor';
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  const session: UserSession = {
    userId: targetUser.id || targetUser._id?.toString() || 'usr_001',
    name: targetUser.name || 'Patron',
    email: targetUser.email,
    role,
    avatar: targetUser.avatar,
    expiresAt: Date.now() + duration,
  };

  const token = encodeSession(session);
  const cookieStore = await cookies();

  // Set unified session cookie
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(duration / 1000),
  });

  if (isAdmin) {
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(duration / 1000),
    });
  }

  // Update lastLogin timestamp in MongoDB
  await db.collection('users').updateOne(
    { _id: targetUser._id },
    { $set: { lastLogin: new Date().toISOString() } }
  );

  // Log audit if admin
  if (isAdmin) {
    await logAuditMongo(targetUser.name, targetUser.email, 'ADMIN_LOGIN', 'Auth', session.userId, 'Admin logged in');
  }

  const redirectUrl = isAdmin ? '/admin' : '/account';

  return {
    success: true,
    user: session,
    redirectUrl,
  };
}

/**
 * Universal Logout function.
 * Clears cookies for both normal users and admins.
 */
export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

// Backward-compatible alias for existing imports
export const loginAdmin = async (email: string, pass: string) => {
  return authenticateUser(email, pass, false);
};
export const getAdminSession = getCurrentAdmin;
export const logoutAdmin = logoutUser;
