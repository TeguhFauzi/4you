const STORAGE_KEY_PREFIX = '_enc_';
const PASSPHRASE = 'jb-cl13nt-s3cur3-k3y-2024'; 
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('jasa-bersih-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
export async function encryptData(data: string): Promise<string> {
  try {
    const key = await deriveKey(PASSPHRASE);
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    );
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch {
    return data; 
  }
}
export async function decryptData(encryptedData: string): Promise<string | null> {
  try {
    const key = await deriveKey(PASSPHRASE);
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}
export async function setEncryptedItem(key: string, value: string): Promise<void> {
  const encrypted = await encryptData(value);
  localStorage.setItem(STORAGE_KEY_PREFIX + key, encrypted);
}
export async function getEncryptedItem(key: string): Promise<string | null> {
  const encrypted = localStorage.getItem(STORAGE_KEY_PREFIX + key);
  if (!encrypted) return null;
  return decryptData(encrypted);
}
export function removeEncryptedItem(key: string): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + key);
}
