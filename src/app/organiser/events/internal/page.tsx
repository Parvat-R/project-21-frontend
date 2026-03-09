"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type EventItem = {
  id: string;
  title: string;
  description: string;
  visibility: "INTERNAL" | "PUBLIC";
  creatorId: string;
  startDatetime: string;
  endDatetime: string;
};

export default function OrganiserInternalEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/event?visibility=INTERNAL&take=50`, { cache: "no-store" });
        const result = await response.json();
        setEvents(Array.isArray(result) ? result : []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const internalEvents = useMemo(
    () => events.filter((event) => event.visibility === "INTERNAL"),
    [events]
  );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Internal Events</h1>
        <p className="text-sm text-muted-foreground">Events visible internally.</p>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Loading internal events...</p> : null}

      {!loading ? (
        <div className="flex flex-wrap gap-4">
          {internalEvents.length > 0 ? (
            internalEvents.map((event) => (
              <article key={event.id} className="h-72 w-72 rounded-lg border border-border bg-card p-4 flex flex-col">
                <h2 className="line-clamp-1 text-base font-semibold">{event.title}</h2>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Start:</strong> {new Date(event.startDatetime).toLocaleString()}
                  </p>
                  <p>
                    <strong className="text-foreground">End:</strong> {new Date(event.endDatetime).toLocaleString()}
                  </p>
                </div>

                <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                  {event.description || "No description"}
                </p>

                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Button size="sm" asChild>
                    <Link href={`/organiser/events/${event.id}`}>View More</Link>
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No internal events available.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
