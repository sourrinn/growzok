import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/users";
import { hashPassword, MAX_PASSWORD_LENGTH, verifyPassword } from "@/lib/password";

// A valid-looking hash with no real matching password, hashed once and reused.
// authorize() checks against this when the email isn't registered, so an
// "unknown email" response takes the same scrypt-derivation time as a "wrong
// password" response — otherwise the unknown-email path returns early and its
// faster response time lets an attacker enumerate registered emails.
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHash) dummyHash = hashPassword("not-a-real-account-password");
  return dummyHash;
}

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * - Email + password via the Credentials provider; users live in MongoDB,
 *   same as habits.
 * - JWT session strategy, so no database session adapter is needed — the signed
 *   cookie carries the user id, which every API route uses to scope data.
 *
 * Sign-up (creating users) is handled separately at POST /api/register, since
 * the Credentials provider only authenticates existing users.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Auth.js only trusts the incoming Host header on known platforms (e.g. it
  // auto-detects Vercel) or when told to. Without this, `next start` on any other
  // host/port — a VM, Docker container, or even local `npm start` — throws
  // "UntrustedHost" and every auth request 500s. This is a reasonable fallback
  // for local/self-hosted use, but self-hosted production deployments should set
  // AUTH_URL to pin the canonical origin instead of trusting the request's Host
  // header (see README's Production section) — otherwise a client that can send
  // an arbitrary Host/X-Forwarded-Host (e.g. no reverse proxy normalizing it)
  // could influence this app's own redirect URLs and cookie Secure flag.
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.toLowerCase().trim()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password || password.length > MAX_PASSWORD_LENGTH) {
          return null;
        }

        const user = await getUserByEmail(email);
        // Always run the scrypt derivation, even for an unknown email, so the
        // response time doesn't reveal whether the account exists.
        const ok = await verifyPassword(
          password,
          user ? user.passwordHash : await getDummyHash()
        );
        if (!user || !ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // Auth.js sets token.sub to the authorized user's id; surface it on the session.
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
