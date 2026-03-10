"use client";

/**
 * src/components/common/AuthGuard.tsx
 *
 * Wraps a page/layout and redirects to /signin if:
 *  - No token in localStorage
 *  - Token is expired or missing required role
 *
 * Usage:
 *   <AuthGuard requiredRole="ORGANISER">{children}</AuthGuard>
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserSession } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If set, user must have this exact role. Otherwise any signed-in user is allowed. */
  requiredRole?: UserSession["role"];
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Wrong role — redirect to their correct dashboard
      switch (user.role) {
        case "ADMIN":
          router.replace("/admin/dashboard");
          break;
        case "ORGANISER":
          router.replace("/organiser/dashboard");
          break;
        default:
          router.replace("/user/events");
      }
      return;
    }

    setChecked(true);
  }, [router, requiredRole]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
