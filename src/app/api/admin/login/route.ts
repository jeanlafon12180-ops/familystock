import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.FAMILYSTOCK_ADMIN_PASSWORD;
  const sessionSecret = process.env.FAMILYSTOCK_ADMIN_SESSION_SECRET;
  if (!configuredPassword || !sessionSecret || sessionSecret.length < 32) {
    return NextResponse.json({ error: "Configuration admin manquante." }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  if (typeof body.password !== "string" || body.password !== configuredPassword) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const { createHmac } = await import("node:crypto");
  const signature = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("familystock_admin_session", payload + "." + signature, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/admin", maxAge: 8 * 60 * 60
  });
  return response;
}
