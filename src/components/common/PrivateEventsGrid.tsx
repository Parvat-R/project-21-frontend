"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Users,
  IndianRupee,
  Lock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { mockPrivateEvents } from "@/lib/mock-data";

interface PrivateEvent extends Event {
  totalRegistrations: number;
  seatsRemaining: number;
  creator: {
    name: string;
    email: string;
  };
}

export function PrivateEventsGrid() {
  const [events, setEvents] = useState<PrivateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivateEvents() {
      try {
        // Using mock data for display
        setEvents(mockPrivateEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPrivateEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-semibold">Error loading events</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-semibold">No private events found</p>
        <p className="text-sm text-muted-foreground">
          No internal events are scheduled at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <PrivateEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function PrivateEventCard({ event }: { event: PrivateEvent }) {
  const seatsPercentage = (event.totalRegistrations / event.seats) * 100;

  return (
    <Card className="flex flex-col overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300">
      <CardContent className="flex flex-col space-y-4 p-6">
        {/* Header Row - Title and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight text-gray-900">{event.title}</h3>
            <p className="mt-1 text-xs text-gray-500">
              ID: {event.id}
            </p>
          </div>
          <Badge className="whitespace-nowrap bg-blue-100 text-blue-800 hover:bg-blue-100">
            {event.approvalStatus}
          </Badge>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-gray-600">
          {event.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Creator/Slug Row */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500">CREATOR</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{event.creator.name}</p>
              <p className="text-xs text-gray-500">{event.creator.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500">EVENT SLUG</p>
              <p className="mt-1 truncate text-sm font-medium text-gray-900">{event.slug}</p>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <CalendarDays className="h-4 w-4" />
                START DATE
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {new Date(event.startDatetime).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(event.startDatetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <Clock className="h-4 w-4" />
                END DATE
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {new Date(event.endDatetime).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(event.endDatetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Seats and Amount Row */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <Users className="h-4 w-4" />
                SEATS
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.totalRegistrations} / {event.seats}
              </p>
              <p className="text-xs text-gray-500">
                {event.seatsRemaining} remaining
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <IndianRupee className="h-4 w-4" />
                AMOUNT
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.amount === 0 ? "Free" : `₹${parseInt(String(event.amount)).toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600">Capacity</p>
              <p className="text-xs font-bold text-gray-900">{Math.round(seatsPercentage)}%</p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(seatsPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Visibility and Creation Date */}
          <div className="flex justify-between border-t border-gray-200 pt-4 text-xs">
            <div>
              <p className="font-semibold text-gray-500">VISIBILITY</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-gray-900">
                <Lock className="h-3 w-3" />
                {event.visibility}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-500">CREATED</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {new Date(event.createdOn).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* View Button - Full Width at Bottom */}
        <div className="mt-auto flex gap-2 pt-4">
          <Link href={`/private-events/${event.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              View Details
            </Button>
          </Link>
          <Button variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
