import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const algorithm = 'aes-256-ctr';
const salt = 'salt'; // You can change this, but keep it constant

function getKey(secret: string): Buffer {
  // Use scrypt to derive a 32-byte key from the secret
  return scryptSync(secret, salt, 32);
}

export function encrypt(text: string): string {
  const secretKey = process.env.ENCRYPTION_KEY || 'defaultSecretKey';
  const key = getKey(secretKey);
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(token: string | undefined): string {
  if (!token) {
    throw new Error('Cannot decrypt undefined or null value');
  }

  // Check if the token is already in JWT format (not encrypted)
  if (token.split('.').length === 3) {
    console.log('Token appears to be a raw JWT, returning as-is');
    return token;
  }

  const secretKey = process.env.ENCRYPTION_KEY || 'defaultSecretKey';
  const key = getKey(secretKey);
  const parts = token.split(':');

  if (parts.length !== 2) {
    throw new Error(`Invalid encrypted string format. Expected 2 parts, got ${parts.length}`);
  }

  const [ivHex, contentHex] = parts;

  if (!ivHex || !contentHex) {
    throw new Error('Invalid encrypted string format: missing IV or content');
  }

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');
    const decipher = createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}