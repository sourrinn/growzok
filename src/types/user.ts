import type { ObjectId } from "mongodb";

/** Shape stored in MongoDB. */
export interface UserDoc {
  _id: ObjectId;
  /** Always stored lowercased; the unique login identifier. */
  email: string;
  name: string;
  /** scrypt hash, "salt:derivedKey" hex. Never leaves the server. */
  passwordHash: string;
  createdAt: Date;
}

/** JSON-safe user record used server-side for authentication. Includes the
 * password hash, so it must never be sent to the client. */
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

/** Thrown by createUser when the email is already registered. */
export class EmailTakenError extends Error {
  constructor() {
    super("Email already registered");
    this.name = "EmailTakenError";
  }
}

export function serializeUser(doc: UserDoc): UserRecord {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt.toISOString(),
  };
}
