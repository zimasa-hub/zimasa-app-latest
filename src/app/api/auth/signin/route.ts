import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { encrypt } from '@/lib/utils/encryption';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

interface KeycloakJwtPayload {
  realm_access: {
    roles: string[];
  };
  name: string;
  email: string;
  exp: number;
}

declare global {
  var sessions: Map<string, any>;
}

if (!global.sessions) {
  global.sessions = new Map();
}


export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID!);
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET!);
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid email profile');

    const response = await fetch(`${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const data = await response.json();

    if (response.ok) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      const decoded = jwtDecode(data.access_token) as KeycloakJwtPayload;

      const token = {
        decoded,
        access_token: data.access_token,
        id_token: data.id_token,
        refresh_token: data.refresh_token,
        expires_at: nowTimeStamp + data.expires_in,
      };

      // Create a session
      const sessionToken = uuidv4();
      const session = {
        access_token: encrypt(token.access_token),
        id_token: encrypt(token.id_token),
        refresh_token: encrypt(token.refresh_token),
        roles: token.decoded.realm_access.roles,
        user: {
          name: token.decoded.name,
          email: token.decoded.email,
        },
        expires_at: token.expires_at,
      };

      // Store the session
      global.sessions.set(sessionToken, session);

      // Set a cookie with the session token
      cookies().set('session_token', sessionToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',  //uncomment this when using HTTPS
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      return NextResponse.json({ 
        message: 'Sign-in successful',
        user: {
          name: token.decoded.name,
          email: token.decoded.email,
        },
      });
    } else {
      return NextResponse.json({ message: data.error_description || 'Invalid credentials' }, { status: response.status });
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ message: 'Sign-in failed. Please try again.' }, { status: 500 });
  }
}