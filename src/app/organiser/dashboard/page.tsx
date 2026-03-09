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
  imageData?: unknown;
};

type EventCardItem = EventItem & { imageSrc: string };

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

function toBase64FromBytes(bytes: number[]) {
  if (!bytes.length) return "";

  // Build base64 in chunks to avoid call stack / memory spikes on larger images.
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

function toImageSource(imageData: unknown) {
  if (!imageData) return "";

  if (typeof imageData === "string") {
    if (imageData.startsWith("data:image/")) return imageData;
    if (imageData.startsWith("http://") || imageData.startsWith("https://") || imageData.startsWith("/")) {
      return imageData;
    }

    return `data:image/jpeg;base64,${imageData}`;
  }

  if (Array.isArray(imageData) && imageData.every((value) => typeof value === "number")) {
    const base64 = toBase64FromBytes(imageData as number[]);
    return base64 ? `data:image/jpeg;base64,${base64}` : "";
  }

  if (typeof imageData === "object") {
    const bufferStyle = imageData as { type?: string; data?: number[] };
    if (bufferStyle.type === "Buffer" && Array.isArray(bufferStyle.data)) {
      const base64 = toBase64FromBytes(bufferStyle.data);
      return base64 ? `data:image/jpeg;base64,${base64}` : "";
    }
  }

  return "";
}

export default function OrganiserDashboardPage() {
  const [events, setEvents] = useState<EventCardItem[]>([]);
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

        const normalized: EventCardItem[] = (Array.isArray(result) ? result : []).map((event) => ({
          ...event,
          imageSrc: toImageSource(event.imageData),
        }));

        setEvents(normalized);
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
        <div className="mt-6 flex flex-wrap gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="w-72">
                <article className="h-72 rounded-lg border border-border bg-card p-4 flex flex-col">
                  {event.imageSrc ? (
                    <img
                      src={event.imageSrc}
                      alt={event.title}
                      className="mb-3 h-28 w-full rounded-md border border-border object-cover"
                    />
                  ) : null}

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

                  <div className="grid grid-cols-1 gap-1 text-xs md:grid-cols-2 mt-auto">
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

                  <div className="mt-3 flex justify-end">
                    <Button size="sm" asChild>
                      <Link href={`/organiser/events/${event.id}/edit`}>Edit Event</Link>
                    </Button>
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
