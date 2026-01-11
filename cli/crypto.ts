import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const KEY_ENV = 'ONESAAS_ENCRYPTION_KEY';
const KEY_FILE_NAME = 'encryption.key';
const ALGO = 'aes-256-gcm';
const VERSION = 'v1';

type KeyOptions = {
  allowCreate?: boolean;
  storageDir: string;
};

function deriveKeyFromEnv(value: string): Buffer {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

export function getEncryptionKey({ allowCreate = false, storageDir }: KeyOptions): Buffer | null {
  const envKey = process.env[KEY_ENV];
  if (envKey) {
    return deriveKeyFromEnv(envKey);
  }

  if (allowCreate && !fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true, mode: 0o700 });
  }

  const keyPath = path.join(storageDir, KEY_FILE_NAME);
  if (fs.existsSync(keyPath)) {
    const stored = fs.readFileSync(keyPath, 'utf8').trim();
    if (stored) {
      return Buffer.from(stored, 'base64');
    }
  }

  if (!allowCreate) {
    return null;
  }

  const key = crypto.randomBytes(32);
  fs.writeFileSync(keyPath, key.toString('base64'), { mode: 0o600 });
  return key;
}

export function encryptString(plain: string, key: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':');
}

export function decryptString(payload: string, key: Buffer): string {
  const [version, ivB64, tagB64, dataB64] = payload.split(':');
  if (version !== VERSION || !ivB64 || !tagB64 || !dataB64) {
    throw new Error('Unsupported encrypted payload');
  }
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
