import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with Node's built-in scrypt — no native dependencies, so the
 * dev experience stays zero-setup. Hashes are stored as "salt:derivedKey" (hex).
 */
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

const KEY_LEN = 64;

/**
 * Reject passwords longer than this before hashing. scrypt's cost is dominated
 * by a fixed ROMix step, but without a cap a client (or attacker) could still
 * submit multi-megabyte input on every request and burn CPU on the single
 * Node process serving this app.
 */
export const MAX_PASSWORD_LENGTH = 200;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LEN);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, "hex");
  const derived = await scryptAsync(password, salt, KEY_LEN);
  // Length check guards timingSafeEqual (which throws on length mismatch).
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}
