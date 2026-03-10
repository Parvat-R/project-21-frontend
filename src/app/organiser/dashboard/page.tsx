"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Play, Check, Ban } from "lucide-react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import { EventFilterBanner } from "@/components/admin/EventFilterBanner";
import { EventDisplayCard } from "@/components/common/EventDisplayCard";
import { Input } from "@/components/ui/input";
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

const STORAGE_KEY = "organiser_user_id";

function getEventLifecycleStatus(
  event: Pick<EventItem, "startDatetime" | "endDatetime">
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
  const [userId, setUserId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  // Load saved user ID from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUserId(saved);
      setInputValue(saved);
    }
  }, []);

  // Fetch events whenever userId changes
  useEffect(() => {
    if (!userId) return;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const response = await fetch(
          `${apiBase}/api/event?creatorId=${userId}&take=50`,
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

    run();
  }, [userId]);

  const handleApply = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setUserId(trimmed);
  };

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
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Organiser Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Shows events created by you.
        </p>
      </div>

      {/* User ID input (temporary until auth is wired) */}
      <div className="mb-6 flex items-end gap-2 rounded-md border border-border bg-muted/30 p-4">
        <div className="flex-1">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Your User ID{" "}
            <span className="text-muted-foreground/60">
              (temporary — paste your user ID to see your events)
            </span>
          </p>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. cmm7d6ttv0007uoeihdxt0g26"
            className="font-mono text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <Button onClick={handleApply} disabled={!inputValue.trim()}>
          Load My Events
        </Button>
      </div>

      {userId ? (
        <>
          {/* Stat cards */}
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

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : null}
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

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
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter your User ID above and click &quot;Load My Events&quot; to see your events.
        </p>
      )}
    </section>
  );
}
