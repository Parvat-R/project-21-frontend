import { PrivateEventsGrid } from "@/components/common/PrivateEventsGrid";

export default function PrivateEventsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Private Events</h1>
          <p className="mt-2 text-muted-foreground">
            All internal company events
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PrivateEventsGrid />
      </div>
    </div>
  );
}
