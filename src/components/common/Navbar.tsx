// components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side - App name */}
        <div className="text-2xl font-bold">
          <Link href="/">EMS</Link>
        </div>

        {/* Right side - Buttons */}
        <div className="flex gap-4">
          <Link href="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
