"use client";

import { useEffect, useState } from "react";
import { EventDisplayCard } from "@/components/common/EventDisplayCard";
import { getUser } from "@/lib/auth";

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

type RegistrationItem = {
  id: string;
  eventId: string;
  userId: string;
  attendance: boolean;
  event: EventItem;
};

export default function OrganiserRegisteredEventsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user) {
      setError("Please sign in to view your registrations.");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/register/user/${user.userId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 404) {
            setRegistrations([]);
          } else {
            setError("Failed to load registrations.");
          }
          return;
        }

        const result = await response.json();
        setRegistrations(Array.isArray(result) ? result : []);
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
        <h1 className="text-2xl font-semibold">Registered Events</h1>
        <p className="text-sm text-muted-foreground">
          Events you have signed up for.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading registered events...</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {registrations.length > 0 ? (
            registrations.map(({ event }) => {
              if (!event) return null;
              return (
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
                  actionHref={`/organiser/events/${event.id}`}
                  actionLabel="View Event"
                />
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't registered for any events yet.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
