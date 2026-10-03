import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbCoupon } from '@/lib/db/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal = 0 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const db = await connectDB();

    const coupon = (await db.collection('coupons').findOne({
      code: cleanCode,
      status: 'active',
    })) as unknown as DbCoupon | null;

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon code.' }, { status: 404 });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json({ valid: false, message: 'This coupon is not active yet.' }, { status: 400 });
    }

    if (coupon.endDate) {
      const end = new Date(coupon.endDate);
      end.setHours(23, 59, 59, 999);
      if (now > end) {
        return NextResponse.json({ valid: false, message: 'This coupon has expired.' }, { status: 400 });
      }
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of ₹${coupon.minOrder.toLocaleString('en-IN')} required for this coupon.`,
      }, { status: 400 });
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: 'This coupon has reached its maximum usage limit.' }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount: discount,
      type: coupon.type,
      value: coupon.value,
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (error: any) {
    console.error('[Coupon Validation Error]:', error?.message);
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon.' }, { status: 500 });
  }
}
