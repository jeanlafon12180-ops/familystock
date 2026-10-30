import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "familystock_admin_session";
const SESSION_SECRET = "familystock-prototype-session-key-2026-public";

async function validSession(token: string | undefined) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const normalized = signature.replace(/-/g, "+").replace(/_/g, "/");
    const signatureBytes = Uint8Array.from(
      atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)),
      character => character.charCodeAt(0),
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(payload),
    );
    if (!valid) return false;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(
      atob(normalizedPayload + "=".repeat((4 - normalizedPayload.length % 4) % 4)),
    );
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (await validSession(token)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/connexion", request.url));
}

export const config = {
  matcher: ["/admin/membres", "/admin/membres/:path*"],
};
