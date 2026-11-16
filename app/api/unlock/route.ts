import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OWNER_COOKIE, ownerToken, safeEqual } from "@/lib/shared/owner-lock";

const BodySchema = z.object({ password: z.string().min(1).max(200) });

/** POST {password} → sets the owner cookie. DELETE → clears it. */
export async function POST(req: NextRequest) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a password." }, { status: 400 });
  }
  const expected = process.env.BRANDSIGNAL_OWNER_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "No owner password is set on this site yet." },
      { status: 503 },
    );
  }
  const [given, want] = await Promise.all([
    ownerToken(parsed.data.password),
    ownerToken(expected),
  ]);
  if (!safeEqual(given, want)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE, want, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(OWNER_COOKIE);
  return res;
}
