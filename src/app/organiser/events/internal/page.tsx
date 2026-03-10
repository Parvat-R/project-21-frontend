"use client";

import { useEffect, useMemo, useState } from "react";
import { EventDisplayCard } from "@/components/common/EventDisplayCard";

type EventItem = {
  id: string;
  title: string;
  description: string;
  visibility: "INTERNAL" | "PUBLIC";
  creatorId: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
};

export default function OrganiserInternalEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const response = await fetch(
          `${apiBase}/api/event?visibility=INTERNAL&take=50`,
          { cache: "no-store" }
        );
        const result = await response.json();
        setEvents(Array.isArray(result) ? result : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const internalEvents = useMemo(
    () => events.filter((e) => e.visibility === "INTERNAL"),
    [events]
  );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Internal Events</h1>
        <p className="text-sm text-muted-foreground">Events visible internally.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading internal events...</p>
      ) : null}

      {!loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {internalEvents.length > 0 ? (
            internalEvents.map((event) => (
              <EventDisplayCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                startDatetime={event.startDatetime}
                endDatetime={event.endDatetime}
                seats={event.seats}
                amount={event.amount}
                visibility={event.visibility}
                imageUrl={event.imageUrl}
                approvalStatus={event.approvalStatus}
                actionHref={`/organiser/events/${event.id}`}
                actionLabel="View More"
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No internal events available.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
