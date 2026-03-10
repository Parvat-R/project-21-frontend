import { ViewEvent } from "@/components/organiser/view-event";
import { Event } from "@/lib/types";

type EventApiResponse = Omit<Event, "amount"> & {
  amount: number | string;
};

// Temporary until real auth session is available
const TEMP_CREATOR_ID = "cmm7d6ttv0007uoeihdxt0g26";

export default async function OrganiserEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  const eventRes = await fetch(`${apiBase}/api/event/${id}`, { cache: "no-store" });

  if (!eventRes.ok) {
    return <p className="text-sm text-destructive">Unable to load this event.</p>;
  }

  const eventRaw: EventApiResponse = await eventRes.json();

  const event: Event = {
    ...eventRaw,
    amount: Number(eventRaw.amount),
  };

  // Only the creator can edit — others can register instead
  const isCreator = event.creatorId === TEMP_CREATOR_ID;

  return (
    <ViewEvent
      event={event}
      eventId={id}
      backHref="/organiser/dashboard"
      editHref={isCreator ? `/organiser/events/${id}/edit` : undefined}
      showRegister={!isCreator}
    />
  );
}
