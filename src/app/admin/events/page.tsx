"use client";

import { useEffect, useMemo, useState } from "react";
import { EventApprovalCard } from "@/components/admin/EventApprovalCard";
import { EventFilterBanner } from "@/components/admin/EventFilterBanner";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type EventApiItem = {
  id: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  creatorId: string;
  approvalStatus: ApprovalStatus;
  imageUrl?: string;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_BASE_URL ||
          "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/event?take=100`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result?.error ?? "Failed to fetch events");
          return;
        }
        setEvents(Array.isArray(result) ? result : []);
      } catch {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredEvents = useMemo(
    () =>
      filter === "ALL"
        ? events
        : events.filter((e) => e.approvalStatus === filter),
    [filter, events]
  );

  const updateApprovalStatus = async (id: string, nextStatus: ApprovalStatus) => {
    try {
      setUpdatingEventId(id);
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
        "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/event/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: nextStatus }),
      });
      if (!response.ok) return;
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, approvalStatus: nextStatus } : event
        )
      );
    } finally {
      setUpdatingEventId(null);
    }
  };

  return (
    <section className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">All Events</h1>
        <p className="text-sm text-muted-foreground">
          Browse, filter, and manage all submitted events.
        </p>
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
              <EventApprovalCard
                key={event.id}
                eventId={event.id}
                title={event.title}
                description={event.description}
                startDatetime={event.startDatetime}
                endDatetime={event.endDatetime}
                seats={event.seats}
                amount={event.amount}
                creator={event.creatorId}
                approvalStatus={event.approvalStatus}
                imageUrl={event.imageUrl}
                loading={updatingEventId === event.id}
                onDecision={updateApprovalStatus}
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
