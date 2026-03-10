// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import { EventApprovalCard } from "@/components/admin/EventApprovalCard";
import { Calendar, Play, Check, Ban } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
};

function useAdminEvents() {
  const [events, setEvents] = useState<EventApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/event?take=100`, { cache: "no-store" });
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

  return { events, setEvents, loading, error };
}

export default function Dashboard() {
  const { events, setEvents, loading, error } = useAdminEvents();
  const [filter, setFilter] = useState<string>("ALL");
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const event of events) {
      if (event.approvalStatus === "PENDING") pending += 1;
      if (event.approvalStatus === "APPROVED") approved += 1;
      if (event.approvalStatus === "REJECTED") rejected += 1;
    }

    return {
      pending,
      approved,
      rejected,
      total: events.length,
    };
  }, [events]);

  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter((e) => e.approvalStatus === filter);

  const updateApprovalStatus = async (id: string, nextStatus: ApprovalStatus) => {
    try {
      setUpdatingEventId(id);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/event/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: nextStatus }),
      });

      if (!response.ok) {
        return;
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, approvalStatus: nextStatus } : event,
        ),
      );
    } finally {
      setUpdatingEventId(null);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Stats row */}
      <div className="flex justify-center m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          <EventStatCard
            category="Pending Approval"
            count={counts.pending}
            comparison="Needs admin action"
            color="yellow"
            icon={<Calendar />}
          />
          <EventStatCard
            category="Approved Events"
            count={counts.approved}
            comparison="Approved by admins"
            color="blue"
            icon={<Play />}
          />
          <EventStatCard
            category="Rejected Events"
            count={counts.rejected}
            comparison="Rejected by admins"
            color="green"
            icon={<Check />}
          />
          <EventStatCard
            category="Total Events"
            count={counts.total}
            comparison="All submitted events"
            color="red"
            icon={<Ban />}
          />
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex w-full max-w-2xl items-center justify-between rounded-md bg-gray-100 p-4 shadow">
          <h2 className="text-lg font-semibold">Filter by Approval Status</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? <p className="text-center text-sm text-muted-foreground">Loading events...</p> : null}
      {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

      {/* Approval cards */}
      <div className="flex flex-col items-center space-y-6 mt-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="w-full max-w-2xl">
            <EventApprovalCard
              eventId={event.id}
              title={event.title}
              description={event.description}
              startDatetime={event.startDatetime}
              endDatetime={event.endDatetime}
              seats={event.seats}
              amount={event.amount}
              creator={event.creatorId}
              approvalStatus={event.approvalStatus}
              loading={updatingEventId === event.id}
              onDecision={updateApprovalStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
