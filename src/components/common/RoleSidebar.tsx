"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus2,
  LayoutDashboard,
  Landmark,
  ListFilter,
  Globe2,
  ShieldCheck,
  Users,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { clearSession, getUser, type UserSession } from "@/lib/auth";

type Role = "organiser" | "user" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const roleNavItems: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
    { label: "All Events", href: "/admin/events", icon: CalendarDays },
    { label: "Users", href: "/admin/users", icon: Users },
  ],
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
    { label: "Registered Events", href: "/organiser/events/registered", icon: CalendarDays },
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
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleSignOut = () => {
    clearSession();
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-border bg-background p-4">
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Role
        </p>
        <h2 className="text-lg font-semibold capitalize">{role}</h2>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto pr-2">
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

      <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-border">
        {user !== null ? (
          <>
            <div className="flex flex-col truncate px-1">
              <span className="text-sm font-medium truncate">
                {user.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
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
