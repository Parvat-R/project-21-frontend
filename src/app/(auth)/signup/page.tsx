"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/services/operations/Auth";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signUp({ user: username, email, password })();
      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to start managing or attending events.
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">Name</label>
            <Input
              id="username"
              placeholder="Your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
