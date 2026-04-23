// netlify/functions/gmail-disconnect.js
// Deletes the stored refresh_token. Also revokes it with Google so the
// credential is actually dead, not just forgotten locally.

import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore("parker-recruiting-hub");
  const tokens = await store.get("gmail-tokens", { type: "json" });

  if (tokens?.refresh_token) {
    try {
      await fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: tokens.refresh_token }),
      });
    } catch {
      // Best-effort — we still clear locally even if revoke fails.
    }
  }

  await store.delete("gmail-tokens");
  return Response.json({ ok: true });
};
