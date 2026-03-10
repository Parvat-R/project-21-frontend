/**
 * src/lib/auth.ts
 * Shared client-side auth utilities.
 * Uses jwt-decode (browser-safe) — NOT jsonwebtoken (Node.js only).
 */

const TOKEN_KEY = "token";

export type UserSession = {
  userId: string;
  email: string;
  role: "USER" | "ORGANISER" | "ADMIN";
  name?: string;
};

/**
 * Decode a JWT payload without verifying the signature.
 * Verification happens on the server — client just needs the payload.
 */
function decodeToken(token: string): UserSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload?.userId || !payload?.email || !payload?.role) return null;
    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

/** Get the raw JWT string from localStorage. Returns null if not present. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Get the decoded user session from the stored token. Returns null if not signed in or token expired. */
export function getUser(): UserSession | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}

/** Save a token to localStorage. */
export function saveSession(token: string): UserSession | null {
  if (typeof window === "undefined") return null;
  localStorage.setItem(TOKEN_KEY, token);
  return decodeToken(token);
}

/** Clear the stored token (sign out). */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Also clear the organiser ID key if it exists
  localStorage.removeItem("organiser_user_id");
}

/** Get the role-based redirect path after signin. */
export function dashboardPathForRole(role: UserSession["role"]): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "ORGANISER":
      return "/organiser/dashboard";
    default:
      return "/user/events";
  }
}
