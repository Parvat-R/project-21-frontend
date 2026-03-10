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
    { label: "Create Event", href: "/organiser/events/create", icon: CalendarPlus2 },
    { label: "Dashboard", href: "/organiser/dashboard", icon: LayoutDashboard },
    { label: "Internal Events", href: "/organiser/events/internal", icon: ListFilter },
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

  return (
    <aside className="h-screen w-72 shrink-0 border-r border-border bg-background p-4">
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Role</p>
        <h2 className="text-lg font-semibold capitalize">{role}</h2>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
