import { NextRequest, NextResponse } from "next/server";

// Code provisoire du prototype. Remplacez cette valeur dans ce fichier.
const ADMIN_PASSWORD = "Jean1805@";
const SESSION_SECRET = "familystock-prototype-session-key-2026-public";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (typeof body.password !== "string" || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const payload = Buffer.from(JSON.stringify({
    exp: Date.now() + 8 * 60 * 60 * 1000,
  })).toString("base64url");
  const { createHmac } = await import("node:crypto");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  const response = NextResponse.json({ ok: true });
  response.cookies.set("familystock_admin_session", payload + "." + signature, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
