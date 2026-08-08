import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const uid = decoded.uid;
    const role = (decoded as Record<string, unknown>).role as string | undefined;

    if (role !== 'student') return NextResponse.json({ error: 'Access Denied' }, {status: 401})

    // 🍪 2. Create session cookie (5 days)
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });

    const cookieStore = await cookies()

    // 🍪 3. Set HttpOnly cookie
    cookieStore.set("sessionCookie", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      uid,
      role,
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}