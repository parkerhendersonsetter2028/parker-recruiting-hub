// netlify/functions/gmail-auth-status.js
// Tells the frontend whether a refresh_token is stored (i.e. Parker is
// permanently connected). Never returns the token itself.

import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("parker-recruiting-hub");
    const tokens = await store.get("gmail-tokens", { type: "json" });
    return Response.json({
      connected: !!tokens?.refresh_token,
      connectedAt: tokens?.connected_at || null,
    });
  } catch (err) {
    return Response.json({ connected: false, error: err.message }, { status: 500 });
  }
};
