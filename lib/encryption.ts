import crypto from 'crypto';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'jasa-bersih-secret-key-012345678'; 
export function encryptId(id: string | number): string {
  const idStr = String(id);
  const key = Buffer.alloc(32, ENCRYPTION_KEY);
  const hash = crypto.createHash('md5').update(idStr).digest();
  const nonce = Buffer.alloc(16);
  hash.copy(nonce); 
  const cipher = crypto.createCipheriv('chacha20', key, nonce);
  let encrypted = cipher.update(idStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const combined = Buffer.concat([nonce, Buffer.from(encrypted, 'hex')]);
  return combined.toString('base64url');
}
export function decryptId(encryptedStr: string): string | null {
  try {
    const combined = Buffer.from(encryptedStr, 'base64url');
    if (combined.length <= 16) return null;
    const nonce = combined.subarray(0, 16);
    const encrypted = combined.subarray(16);
    const key = Buffer.alloc(32, ENCRYPTION_KEY);
    const decipher = crypto.createDecipheriv('chacha20', key, nonce);
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt ID:', error);
    return null;
  }
}
