"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/services/operations/Auth";
import { dashboardPathForRole } from "@/lib/auth";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signIn({ email, password })();

      if (result?.success && result.user) {
        router.push(dashboardPathForRole(result.user.role));
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button className="w-full" onClick={handleSignin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
