import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const logData = await request.json();
    
    // Log the authentication event
    console.log('Auth event:', logData);

    // Here you can implement more sophisticated logging
    // For example, saving to a database or sending to a logging service

    return NextResponse.json({ message: 'Log recorded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error logging auth event:', error);
    return NextResponse.json({ error: 'Failed to log auth event' }, { status: 500 });
  }
}