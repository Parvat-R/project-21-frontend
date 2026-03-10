// components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side - App name */}
        <div className="text-2xl font-extrabold tracking-tight">
          <Link href="/">JEVENT</Link>
        </div>

        {/* Right side - Buttons */}
        <div className="flex gap-4">
          <Link href="/signin">
            <Button variant="ghost" className="rounded-full">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-full">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
