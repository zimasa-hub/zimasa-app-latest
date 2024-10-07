import { decrypt, encrypt } from './encryption';
import { cookies } from 'next/headers';

interface Session {
  user: any;
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_at: number;
  // Add other session properties as needed
}

export async function getValidAccessToken(): Promise<string> {
  const session = await getServerSession() as Session | null;

  if (!session) {
    throw new Error('No session found');
  }

  const nowTimeStamp = Math.floor(Date.now() / 1000);
  const tokenExpirationThreshold = 300; // 5 minutes in seconds

  if (session.expires_at - nowTimeStamp < tokenExpirationThreshold) {
    return refreshAccessToken(session);
  }

  return decrypt(session.access_token);
}

async function refreshAccessToken(session: Session): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID!);
  params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET!);
  params.append('refresh_token', decrypt(session.refresh_token));

  const response = await fetch(`${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const refreshedTokens = await response.json();

  const updatedSession: Session = {
    ...session,
    access_token: encrypt(refreshedTokens.access_token),
    id_token: encrypt(refreshedTokens.id_token),
    refresh_token: encrypt(refreshedTokens.refresh_token),
    expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
  };

  // Update the session in storage
  const sessionToken = cookies().get('session_token')?.value;
  if (sessionToken) {
    global.sessions.set(sessionToken, updatedSession);
  }

  return refreshedTokens.access_token;
}

export async function getServerSession(): Promise<Session | null> {
  const sessionToken = cookies().get('session_token')?.value;
  if (!sessionToken) return null;

  const session = global.sessions.get(sessionToken);
  return session || null;
}