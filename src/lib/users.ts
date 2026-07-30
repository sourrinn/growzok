import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  type CreateUserInput,
  EmailTakenError,
  type UserDoc,
  type UserRecord,
  serializeUser,
} from "@/types/user";

const COLLECTION = "users";

// Ensure the unique email index exists exactly once per process.
let indexReady: Promise<unknown> | null = null;

async function collection() {
  const db = await getDb();
  const col = db.collection<UserDoc>(COLLECTION);
  if (!indexReady) {
    // If createIndex ever rejects (e.g. Mongo isn't up yet on a cold start),
    // clear indexReady so the next call retries instead of replaying the same
    // rejected promise — and thus failing every login/registration — forever.
    indexReady = col.createIndex({ email: 1 }, { unique: true }).catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  return col;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const col = await collection();
  const doc = await col.findOne({ email });
  return doc ? serializeUser(doc) : null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? serializeUser(doc) : null;
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const col = await collection();
  const doc: UserDoc = {
    _id: new ObjectId(),
    email: input.email,
    name: input.name,
    passwordHash: input.passwordHash,
    createdAt: new Date(),
  };
  try {
    await col.insertOne(doc);
  } catch (err) {
    // Duplicate key from the unique email index → race-safe "email taken".
    if ((err as { code?: number }).code === 11000) throw new EmailTakenError();
    throw err;
  }
  return serializeUser(doc);
}
