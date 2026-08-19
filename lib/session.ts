import crypto from 'crypto';
const SESSION_SECRET = process.env.ENCRYPTION_KEY || 'jasa-bersih-secret-key-012345678';
export function generateSessionToken(userId: string, email: string, role: string): string {
  const payload = JSON.stringify({
    userId,
    email,
    role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, 
  });
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  const token = Buffer.from(payload).toString('base64url') + '.' + signature;
  return token;
}
export function verifySessionToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return null;
    }
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) {
      return null;
    }
    return { userId: data.userId, email: data.email, role: data.role };
  } catch {
    return null;
  }
}
