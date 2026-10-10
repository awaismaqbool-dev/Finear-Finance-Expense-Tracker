import "server-only";
import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { SessionUser } from "@/lib/types/api";
import { prisma } from "@/lib/db/prisma";

export const SESSION_COOKIE = "token";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function assertSessionConfiguration(): void {
  getJwtSecret();
}

export function signSession(userId: string): string {
  return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: SESSION_MAX_AGE_SECONDS });
}

export async function setSessionCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const tokenUserId = typeof decoded === "object" ? (decoded as JwtPayload & { id?: string | number }).id : undefined;
    const userId = Number(tokenUserId);
    if (!Number.isSafeInteger(userId) || userId < 1) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, isVerified: true, imagePath: true },
    });
    return user ? { ...user, id: String(user.id) } : null;
  } catch {
    return null;
  }
}
