// netlify/functions/gmail-auth-start.js
// Kicks off the Google OAuth authorization-code flow. Browser hits this URL,
// we redirect to Google's consent page with access_type=offline + prompt=consent
// so Google returns a refresh_token we can use forever (7 days in Testing mode).

import { getStore } from "@netlify/blobs";
import crypto from "crypto";

export default async (req) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing GOOGLE_CLIENT_ID env var", { status: 500 });
  }

  const url = new URL(req.url);
  const redirectUri = `${url.origin}/.netlify/functions/gmail-auth-callback`;

  // CSRF-ish state check — Google echoes this back to the callback
  const state = crypto.randomBytes(16).toString("hex");
  const store = getStore("parker-recruiting-hub");
  await store.setJSON("gmail-oauth-state", { state, createdAt: Date.now() });

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.compose");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("include_granted_scopes", "true");

  return Response.redirect(authUrl.toString(), 302);
};
