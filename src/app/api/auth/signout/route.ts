import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/utils/encryption';

async function handleLogout() {
  try {
    const sessionToken = cookies().get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: 'No active session found' }, { status: 200 });
    }

    if (!global.sessions || !global.sessions.has(sessionToken)) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 400 });
    }

    const session = global.sessions.get(sessionToken);
    global.sessions.delete(sessionToken);

    // Clear the session cookie
    cookies().set('session_token', '', {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    // Logout from Keycloak
    if (session && session.id_token) {
      const decryptedIdToken = decrypt(session.id_token);
      const keycloakBaseUrl = process.env.KEYCLOAK_BASE_URL;
      const keycloakRealm = process.env.KEYCLOAK_REALM;
      const postLogoutRedirectUri = process.env.NEXTAUTH_URL;

      if (!keycloakBaseUrl || !keycloakRealm || !postLogoutRedirectUri) {
        console.error('Missing required environment variables for Keycloak logout');
        return NextResponse.json({ message: 'Logged out locally, but Keycloak logout failed' }, { status: 200 });
      }

      const logoutUrl = `${keycloakBaseUrl}/realms/${keycloakRealm}/protocol/openid-connect/logout`;
      const params = new URLSearchParams();
      params.append('id_token_hint', decryptedIdToken);
      params.append('post_logout_redirect_uri', postLogoutRedirectUri);

      try {
        const response = await fetch(`${logoutUrl}?${params.toString()}`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`Keycloak logout failed with status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error logging out from Keycloak:', err);
        return NextResponse.json({ message: 'Logged out locally, but Keycloak logout failed' }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout failed. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return handleLogout();
}

export async function POST() {
  return handleLogout();
}