"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Play, Check, Ban } from "lucide-react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import { EventFilterBanner } from "@/components/admin/EventFilterBanner";
import { EventDisplayCard } from "@/components/common/EventDisplayCard";
import { getUser } from "@/lib/auth";

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

function getEventLifecycleStatus(
  event: Pick<EventItem, "startDatetime" | "endDatetime">,
): EventStatus {
  const now = new Date();
  const start = new Date(event.startDatetime);
  const end = new Date(event.endDatetime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "CANCELLED";
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
    const user = getUser();

    if (!user) {
      setError("You are not signed in. Please sign in to view your events.");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${apiBase}/api/event?creatorId=${user.userId}&take=50`,
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

  const filteredEvents = useMemo(() => {
    if (filter === "ALL") return events;
    return events.filter((e) => getEventLifecycleStatus(e) === filter);
  }, [filter, events]);

  const stats = useMemo(() => {
    const counts: Record<EventStatus, number> = {
      UPCOMING: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    for (const event of events) {
      counts[getEventLifecycleStatus(event)] += 1;
    }
    return counts;
  }, [events]);

  return (
    <section className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Organiser Dashboard</h1>
        <p className="text-sm text-muted-foreground">Events created by you.</p>
      </div>

      {/* Stat cards */}
      <div className="flex justify-center m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          <EventStatCard
            category="Upcoming"
            count={stats.UPCOMING}
            comparison="Your events"
            color="yellow"
            icon={<Calendar />}
          />
          <EventStatCard
            category="Ongoing"
            count={stats.ONGOING}
            comparison="Your events"
            color="blue"
            icon={<Play />}
          />
          <EventStatCard
            category="Completed"
            count={stats.COMPLETED}
            comparison="Your events"
            color="green"
            icon={<Check />}
          />
          <EventStatCard
            category="Cancelled"
            count={stats.CANCELLED}
            comparison="Your events"
            color="red"
            icon={<Ban />}
          />
        </div>
      </div>

      <EventFilterBanner value={filter} onChange={setFilter} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading events...</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
                actionLabel="View Details"
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No events found for this filter.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
