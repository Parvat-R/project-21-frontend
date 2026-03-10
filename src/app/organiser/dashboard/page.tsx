"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Play, Check, Ban } from "lucide-react";
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

const TEMP_CREATOR_ID = "cmm7d6ttv0007uoeihdxt0g26";

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

export default function OrganiserDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const response = await fetch(
          `${apiBase}/api/event?creatorId=${TEMP_CREATOR_ID}&includeImage=true&take=50`,
          { cache: "no-store" },
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

    run();
  }, []);

  const myEvents = events;

  const filteredEvents = useMemo(() => {
    if (filter === "ALL") return myEvents;
    return myEvents.filter((event) => getEventLifecycleStatus(event) === filter);
  }, [filter, myEvents]);

  const stats = useMemo(() => {
    const counts: Record<EventStatus, number> = {
      UPCOMING: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    for (const event of myEvents) {
      const status = getEventLifecycleStatus(event);
      counts[status] += 1;
    }

    return counts;
  }, [myEvents]);

  return (
    <section className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Organiser Dashboard</h1>
        <p className="text-sm text-muted-foreground">Shows events created by you.</p>
      </div>

      <div className="flex justify-center m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          <EventStatCard
            category="Upcoming Events"
            count={stats.UPCOMING}
            comparison="From your created events"
            color="yellow"
            icon={<Calendar />}
          />
          <EventStatCard
            category="Ongoing Events"
            count={stats.ONGOING}
            comparison="From your created events"
            color="blue"
            icon={<Play />}
          />
          <EventStatCard
            category="Completed Events"
            count={stats.COMPLETED}
            comparison="From your created events"
            color="green"
            icon={<Check />}
          />
          <EventStatCard
            category="Cancelled Events"
            count={stats.CANCELLED}
            comparison="From your created events"
            color="red"
            icon={<Ban />}
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
                        event.approvalStatus === "APPROVED"
                          ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"
                          : event.approvalStatus === "REJECTED"
                            ? "rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"
                            : "rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700"
                      }
                    >
                      {event.approvalStatus}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {event.description || "No description"}
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
                        <strong>Amount:</strong> ₹{event.amount}
                      </p>
                      <p>
                        <strong>Visibility:</strong> {event.visibility}
                      </p>
                      <p>
                        <strong>Approval Flow:</strong> Pending admin action
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/organiser/events/${event.id}/edit`}>Edit Event</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No created events found.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
