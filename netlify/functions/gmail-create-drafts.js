// netlify/functions/gmail-create-drafts.js
// Creates Gmail drafts server-side using the refresh_token stored by the
// auth-callback function. The browser never sees an access token — it just
// sends a list of drafts and gets back per-school status.
//
// Body: { drafts: [{ schoolId, to, subject, body }] }
// Returns: { results: [{ schoolId, status }] }

import { getStore } from "@netlify/blobs";

async function mintAccessToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    const msg = data.error_description || data.error || `refresh failed: ${res.status}`;
    const err = new Error(msg);
    err.code = data.error || "refresh_failed";
    throw err;
  }
  return data.access_token;
}

function encodeRfc2822({ to, subject, body }) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    body,
  ].join("\r\n");
  return Buffer.from(message, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { drafts } = await req.json();
    if (!Array.isArray(drafts)) {
      return Response.json({ error: "drafts must be an array" }, { status: 400 });
    }

    const store = getStore("parker-recruiting-hub");
    const tokens = await store.get("gmail-tokens", { type: "json" });
    if (!tokens?.refresh_token) {
      return Response.json({ error: "not_connected" }, { status: 401 });
    }

    let accessToken;
    try {
      accessToken = await mintAccessToken(tokens.refresh_token);
    } catch (e) {
      // invalid_grant means the refresh token was revoked / expired (common
      // in Testing mode after 7 days). Clear it so the UI prompts to reconnect.
      if (e.code === "invalid_grant") await store.delete("gmail-tokens");
      return Response.json({ error: e.code || "refresh_failed" }, { status: 401 });
    }

    const results = [];
    for (const d of drafts) {
      if (!d.to) { results.push({ schoolId: d.schoolId, status: "skipped" }); continue; }
      const encoded = encodeRfc2822(d);
      const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { raw: encoded } }),
      });
      results.push({ schoolId: d.schoolId, status: r.ok ? "done" : "error" });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return Response.json({ results });
  } catch (err) {
    console.error("gmail-create-drafts error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};
