import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbUser } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await connectDB();
  const docs = await db.collection('users').find({}, { projection: { passwordHash: 0 } }).toArray();
  const users = docs.map(u => {
    const { _id, ...rest } = u;
    return { ...rest, id: rest.id || _id?.toString() } as DbUser;
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session || (session.role as string).toUpperCase() !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only Super Admin can create team members' }, { status: 403 });
  }

  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const db = await connectDB();

    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password || 'admin123', 10);
    const newUser: DbUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash,
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await db.collection('users').insertOne(newUser as any);
    await logAuditMongo(session.name, session.email, 'USER_CREATED', 'User', newUser.id, `Created team member ${newUser.name} with role ${newUser.role}`);

    const { passwordHash: _, ...safe } = newUser;
    return NextResponse.json({ success: true, user: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session || (session.role as string).toUpperCase() !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only Super Admin can edit team members' }, { status: 403 });
  }

  try {
    const { id, role, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const updates: any = {};
    if (role) updates.role = role;
    if (status) updates.status = status;

    await db.collection('users').updateOne(filter, { $set: updates });
    await logAuditMongo(session.name, session.email, 'USER_UPDATED', 'User', id, `Updated team member ${id} in MongoDB`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session || (session.role as string).toUpperCase() !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only Super Admin can delete team members' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const result = await db.collection('users').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await logAuditMongo(session.name, session.email, 'USER_DELETED', 'User', id, 'Deleted team member from MongoDB');

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
