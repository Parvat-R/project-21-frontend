import { RoleSidebar } from "@/components/common/RoleSidebar";

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <RoleSidebar role="organiser" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
