// netlify/functions/gmail-auth-callback.js
// Google redirects here with ?code=... after the user grants consent. We
// exchange the code for an access_token + refresh_token, then stash the
// refresh_token in Netlify Blobs. From then on, the server can mint fresh
// access tokens whenever Parker creates drafts — no re-auth needed.

import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const backTo = (params) => {
    const u = new URL(url.origin);
    u.hash = "#/gmail-drafts";
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return Response.redirect(u.toString(), 302);
  };

  if (error) return backTo({ gmail_auth: "error", reason: error });
  if (!code)  return backTo({ gmail_auth: "error", reason: "no_code" });

  const store = getStore("parker-recruiting-hub");
  const saved = await store.get("gmail-oauth-state", { type: "json" });
  if (!saved?.state || saved.state !== state) {
    return backTo({ gmail_auth: "error", reason: "state_mismatch" });
  }
  await store.delete("gmail-oauth-state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return backTo({ gmail_auth: "error", reason: "missing_env" });
  }
  const redirectUri = `${url.origin}/.netlify/functions/gmail-auth-callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();

  if (!tokenRes.ok || !tokens.refresh_token) {
    // No refresh_token usually means the user has granted consent before and
    // Google silently reused it. prompt=consent should prevent this, but if it
    // happens we surface an actionable reason.
    return backTo({
      gmail_auth: "error",
      reason: tokens.error || "no_refresh_token",
    });
  }

  await store.setJSON("gmail-tokens", {
    refresh_token: tokens.refresh_token,
    scope: tokens.scope || "",
    connected_at: Date.now(),
  });

  return backTo({ gmail_auth: "success" });
};
