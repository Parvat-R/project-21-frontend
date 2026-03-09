"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Users,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

interface PrivateEventDetail extends Event {
  creator: {
    name: string;
    email: string;
  };
  totalRegistrations: number;
  seatsRemaining: number;
}

export default function PrivateEventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<PrivateEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setEventId(p.id));
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const response = await fetch(`/api/event/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error || "Event not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const seatsPercentage = (event.totalRegistrations / event.seats) * 100;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="mt-2 text-muted-foreground">Event ID: {event.id}</p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={
              event.approvalStatus === "APPROVED"
                ? "default"
                : event.approvalStatus === "REJECTED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {event.approvalStatus}
          </Badge>
          <Badge variant="outline">{event.visibility}</Badge>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="mt-2 text-gray-600">{event.description}</p>
          </div>
        )}

        {/* Event Details Grid */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-700">Event Details</h3>
          <div className="flex flex-wrap gap-6">
            {/* Event ID */}
            <div>
              <p className="text-xs font-medium text-gray-500">Event ID</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.id}
              </p>
            </div>

            {/* Slug */}
            <div>
              <p className="text-xs font-medium text-gray-500">Slug</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.slug}
              </p>
            </div>

            {/* Creator ID */}
            <div>
              <p className="text-xs font-medium text-gray-500">Creator ID</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.creatorId}
              </p>
            </div>

            {/* Created On */}
            <div>
              <p className="text-xs font-medium text-gray-500">Created On</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(event.createdOn).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-700">Event Schedule</h3>
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Start Date */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays className="h-5 w-5" />
                <p className="font-medium">Start Date & Time</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {new Date(event.startDatetime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(event.startDatetime).toLocaleTimeString()}
              </p>
            </div>

            {/* End Date */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5" />
                <p className="font-medium">End Date & Time</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {new Date(event.endDatetime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(event.endDatetime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Seats & Amount Section */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-700">Seat Information</h3>
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Total Seats */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-5 w-5" />
                <p className="font-medium">Total Seats</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {event.seats}
              </p>
            </div>

            {/* Registered */}
            <div className="flex-1">
              <p className="font-medium text-gray-700">Registered Users</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {event.totalRegistrations}
              </p>
            </div>

            {/* Remaining */}
            <div className="flex-1">
              <p className="font-medium text-gray-700">Seats Remaining</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {event.seatsRemaining}
              </p>
            </div>

            {/* Amount */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-700">
                <IndianRupee className="h-5 w-5" />
                <p className="font-medium">Event Fee</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₹{parseInt(String(event.amount)).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Capacity Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Capacity</span>
              <span className="text-gray-600">{Math.round(seatsPercentage)}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${Math.min(seatsPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Organizer Section */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-700">Organizer</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.creator.name}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.creator.email}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-700">Additional Info</h3>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500">Visibility</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.visibility}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Approval Status</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.approvalStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
