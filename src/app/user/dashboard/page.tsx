"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Play, Check, Navigation } from "lucide-react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import { EventFilterBanner } from "@/components/admin/EventFilterBanner";
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
  amount: number;
  seats: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
};

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

function getEventLifecycleStatus(event: Pick<EventItem, "startDatetime" | "endDatetime">): EventStatus {
  const now = new Date();
  const start = new Date(event.startDatetime);
  const end = new Date(event.endDatetime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "CANCELLED";
  }

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ONGOING";
  return "COMPLETED";
}

export default function UserDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3001";
        // Fetching all approved events for the user to browse
        const response = await fetch(
          `${apiBase}/api/event?approvalStatus=APPROVED&includeImage=true&take=50`,
          { cache: "no-store" }
        );
        const result = await response.json();

        if (!response.ok) {
          setError(result?.error ?? "Failed to fetch events.");
          return;
        }

        setEvents(Array.isArray(result) ? result : []);
      } catch {
        setError("Unable to load dashboard events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const availableEvents = events;

  const filteredEvents = useMemo(() => {
    if (filter === "ALL") return availableEvents;
    return availableEvents.filter((event) => getEventLifecycleStatus(event) === filter);
  }, [filter, availableEvents]);

  const stats = useMemo(() => {
    const counts: Record<EventStatus, number> = {
      UPCOMING: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    for (const event of availableEvents) {
      const status = getEventLifecycleStatus(event);
      counts[status] += 1;
    }

    return counts;
  }, [availableEvents]);

  return (
    <section className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">User Dashboard</h1>
        <p className="text-sm text-muted-foreground">Discover and explore available events.</p>
      </div>

      <div className="flex justify-center m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          <EventStatCard
            category="Upcoming Events"
            count={stats.UPCOMING}
            comparison="Available soon"
            color="yellow"
            icon={<Calendar />}
          />
          <EventStatCard
            category="Ongoing Events"
            count={stats.ONGOING}
            comparison="Happening right now"
            color="blue"
            icon={<Play />}
          />
          <EventStatCard
            category="Completed Events"
            count={stats.COMPLETED}
            comparison="Past events"
            color="green"
            icon={<Check />}
          />
          <EventStatCard
            category="Total Available"
            count={availableEvents.length}
            comparison="All approved events"
            color="blue"
            icon={<Navigation />}
          />
        </div>
      </div>

      <EventFilterBanner value={filter} onChange={setFilter} />

      {loading ? <p className="text-sm text-muted-foreground">Loading events...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="h-full">
                <article className="flex h-full min-h-[28rem] flex-col rounded-lg border border-border bg-card p-4">
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
                    <h2 className="line-clamp-1 text-base font-semibold">{event.title}</h2>
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

                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {event.description || "No description provided."}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-1 gap-1 text-xs md:grid-cols-2">
                      <p>
                        <strong>Start:</strong> {new Date(event.startDatetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>End:</strong> {new Date(event.endDatetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Seats:</strong> {event.seats}
                      </p>
                      <p>
                        <strong>Status:</strong> {getEventLifecycleStatus(event)}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No available events found.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
