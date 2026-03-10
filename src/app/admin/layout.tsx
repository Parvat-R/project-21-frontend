import { RoleSidebar } from "@/components/common/RoleSidebar";
import { AuthGuard } from "@/components/common/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="flex min-h-screen bg-background">
        <RoleSidebar role="admin" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
