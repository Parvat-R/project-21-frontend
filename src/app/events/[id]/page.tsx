import { ViewEvent } from "@/components/user-event/view-event";
import { RoleSidebar } from "@/components/common/RoleSidebar";
import { Event } from "@/lib/types";

type EventApiResponse = Omit<Event, "amount"> & {
  amount: number | string;
};

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  const eventRes = await fetch(`${apiBase}/api/event/${id}`, { cache: "no-store" });

  if (!eventRes.ok) {
    return (
      <div className="flex min-h-screen bg-background">
        <RoleSidebar role="user" />
        <main className="flex-1 p-6">
          <p className="text-sm text-destructive">Unable to load this event.</p>
        </main>
      </div>
    );
  }

  const eventRaw: EventApiResponse = await eventRes.json();

  const event: Event = {
    ...eventRaw,
    amount: Number(eventRaw.amount),
  };

  return (
    <div className="flex min-h-screen bg-background">
      <RoleSidebar role="user" />
      <main className="flex-1 p-6">
        <ViewEvent event={event} />
      </main>
    </div>
  );
}
