import { ViewEvent } from "@/components/organiser/view-event";
import { Event } from "@/lib/types";

type EventApiResponse = Omit<Event, "amount"> & {
  amount: number | string;
};

export default async function OrganiserEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const eventRes = await fetch(`${apiBase}/api/event/${id}`, {
    cache: "no-store",
  });

  if (!eventRes.ok) {
    return (
      <p className="text-sm text-destructive">Unable to load this event.</p>
    );
  }

  const eventRaw: EventApiResponse = await eventRes.json();

  const event: Event = {
    ...eventRaw,
    amount: Number(eventRaw.amount),
  };

  /**
   * Pass creatorId to ViewEvent.
   * ViewEvent reads the session user client-side via getUser() and compares:
   *   - If session.userId === creatorId  → shows Edit button
   *   - Otherwise                        → shows Register button
   */
  return (
    <ViewEvent
      event={event}
      eventId={id}
      backHref="/organiser/dashboard"
      creatorId={event.creatorId}
    />
  );
}
