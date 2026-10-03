import { NextResponse } from 'next/server';
import { getNavigationTree } from '@/lib/db/navigation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roots = await getNavigationTree();
    return NextResponse.json(
      {
        success: true,
        navigation: roots,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[Public Navbar API Error]:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve navigation' },
      { status: 500 }
    );
  }
}
