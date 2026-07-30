import type { DefaultSession } from "next-auth";

// Add our user id to the session so server code can scope data per user.
// (The id comes from token.sub, which Auth.js populates from the authorized user.)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
