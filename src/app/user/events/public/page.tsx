"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type EventItem = {
  id: string;
  title: string;
  description: string;
  visibility: "INTERNAL" | "PUBLIC";
  startDatetime: string;
  endDatetime: string;
  imageUrl?: string;
  amount: number;
};

export default function UserPublicEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";

        const response = await fetch(
          `${apiBase}/api/event?visibility=PUBLIC&approvalStatus=APPROVED&take=50`,
          { cache: "no-store" },
        );
        const result = await response.json();
        setEvents(Array.isArray(result) ? result : []);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const publicEvents = useMemo(
    () => events.filter((event) => event.visibility === "PUBLIC"),
    [events],
  );

  return (
    <section className="space-y-4 h-full w-full">
      <div>
        <h1 className="text-2xl font-semibold">Public Events</h1>
        <p className="text-sm text-muted-foreground">
          Discover and register for public events.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading public events...
        </p>
      ) : null}

      {!loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {publicEvents.length > 0 ? (
            publicEvents.map((event) => (
              <article
                key={event.id}
                className="flex min-h-[24rem] flex-col rounded-lg border border-border bg-card p-4"
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="mb-3 h-28 w-full rounded-md border border-border object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                    No image
                  </div>
                )}

                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="line-clamp-1 text-base font-semibold">
                    {event.title}
                  </h2>
                  <span
                    className={
                      event.amount === 0
                        ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"
                    }
                  >
                    {event.amount === 0 ? "FREE" : `₹${event.amount}`}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Start:</strong>{" "}
                    {new Date(event.startDatetime).toLocaleString()}
                  </p>
                  <p>
                    <strong className="text-foreground">End:</strong>{" "}
                    {new Date(event.endDatetime).toLocaleString()}
                  </p>
                </div>

                <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                  {event.description || "No description provided."}
                </p>

                <div className="mt-auto flex items-center justify-end gap-2 pt-4">
                  <Button size="sm" asChild>
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No public events available at the moment.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
