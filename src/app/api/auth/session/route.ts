import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/utils/auth-utils';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Only return necessary session data
    return NextResponse.json({
      user: {
        name: session.user.name,
        email: session.user.email,
        // Add any other necessary user data
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}