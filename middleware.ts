import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "familystock_admin_session";

async function validSession(token: string | undefined, secret: string | undefined) {
  if (!token || !secret || secret.length < 32) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const signatureBytes = Uint8Array.from(
      atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
      character => character.charCodeAt(0),
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(payload),
    );
    if (!valid) return false;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const data = JSON.parse(atob(padded));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const secret = process.env.FAMILYSTOCK_ADMIN_SESSION_SECRET;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (await validSession(token, secret)) return NextResponse.next();

  const loginUrl = new URL("/admin/connexion", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/membres"],
};
