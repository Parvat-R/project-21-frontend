"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus2,
  LayoutDashboard,
  Landmark,
  ListFilter,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

type Role = "organiser" | "user";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const roleNavItems: Record<Role, NavItem[]> = {
  organiser: [
    {
      label: "Create Event",
      href: "/organiser/events/create",
      icon: CalendarPlus2,
    },
    { label: "Dashboard", href: "/organiser/dashboard", icon: LayoutDashboard },
    {
      label: "Internal Events",
      href: "/organiser/events/internal",
      icon: ListFilter,
    },
    { label: "Public Events", href: "/organiser/events/public", icon: Globe2 },
    { label: "Wallet", href: "/organiser/wallet", icon: Landmark },
  ],
  user: [
    { label: "My Events", href: "/user/events", icon: LayoutDashboard },
    { label: "Wallet", href: "/user/wallet", icon: Landmark },
  ],
};

export function RoleSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const navItems = roleNavItems[role];
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // optionally redirect
    window.location.href = "/signin";
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-border bg-background p-4">
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Role</p>
        <h2 className="text-lg font-semibold capitalize">{role}</h2>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex gap-4 pt-4 border-t border-border">
        {isLoggedIn ? (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            <Link href="/profile" className="flex-1">
              <Button className="w-full">Profile</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
