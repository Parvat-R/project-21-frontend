import { RoleSidebar } from "@/components/common/RoleSidebar";
import { AuthGuard } from "@/components/common/AuthGuard";

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="ORGANISER">
      <div className="flex min-h-screen bg-background">
        <RoleSidebar role="organiser" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
