"use client";

import { useEffect, useState } from "react";
import { EventDisplayCard } from "@/components/common/EventDisplayCard";

type EventItem = {
  id: string;
  title: string;
  description: string;
  visibility: "INTERNAL" | "PUBLIC";
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
};

export default function UserEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const response = await fetch(
          `${apiBase}/api/event?visibility=PUBLIC&approvalStatus=APPROVED&take=50`,
          { cache: "no-store" }
        );
        const result = await response.json();
        if (!response.ok) {
          setError(result?.error ?? "Failed to load events.");
          return;
        }
        setEvents(Array.isArray(result) ? result : []);
      } catch {
        setError("Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="text-sm text-muted-foreground">
          Browse approved public events.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading events...</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => (
              <EventDisplayCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                startDatetime={event.startDatetime}
                endDatetime={event.endDatetime}
                seats={event.seats}
                amount={event.amount}
                imageUrl={event.imageUrl}
                actionHref={`/events/${event.id}`}
                actionLabel="View Event"
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No events available right now.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
