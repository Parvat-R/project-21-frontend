import { RoleSidebar } from "@/components/common/RoleSidebar";
import { AuthGuard } from "@/components/common/AuthGuard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="USER">
      <div className="flex min-h-screen bg-background">
        <RoleSidebar role="user" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
