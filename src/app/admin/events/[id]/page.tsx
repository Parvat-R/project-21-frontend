"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type EventDetail = {
  id: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  creatorId: string;
  approvalStatus: ApprovalStatus;
  visibility: string;
  slug: string;
  imageUrl?: string;
};

export default function AdminEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/event/${id}`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result?.error ?? "Event not found");
          return;
        }
        setEvent(result);
      } catch {
        setError("Unable to load event.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const updateStatus = async (nextStatus: ApprovalStatus) => {
    if (!event) return;
    try {
      setUpdating(true);
      const apiBase =
        process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
        "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/event/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: nextStatus }),
      });
      if (!response.ok) return;
      setEvent((prev) =>
        prev ? { ...prev, approvalStatus: nextStatus } : prev
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge =
    event?.approvalStatus === "APPROVED"
      ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
      : event?.approvalStatus === "REJECTED"
        ? "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
        : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700";

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading event...</p>;
  }

  if (error || !event) {
    return <p className="text-sm text-destructive">{error || "Event not found."}</p>;
  }

  return (
    <section className="w-full h-full max-w-3xl">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Event image */}
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="mb-6 h-56 w-full rounded-lg border border-border object-cover"
        />
      ) : (
        <div className="mb-6 flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          No image
        </div>
      )}

      {/* Title + status */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <span className={statusBadge}>{event.approvalStatus}</span>
      </div>

      {/* Details */}
      <div className="mb-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <p>
          <strong>Slug:</strong> {event.slug}
        </p>
        <p>
          <strong>Visibility:</strong> {event.visibility}
        </p>
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
        <p className="col-span-full">
          <strong>Creator ID:</strong>{" "}
          <span className="font-mono text-xs">{event.creatorId}</span>
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium">Description</p>
        <p className="min-h-20 rounded-md border border-border bg-muted/20 p-3 text-sm whitespace-pre-wrap">
          {event.description || "No description provided."}
        </p>
      </div>

      {/* Approve / Reject */}
      <div className="flex gap-3">
        <Button
          variant="default"
          onClick={() => updateStatus("APPROVED")}
          disabled={updating || event.approvalStatus === "APPROVED"}
        >
          {updating ? "Updating..." : "Approve"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => updateStatus("REJECTED")}
          disabled={updating || event.approvalStatus === "REJECTED"}
        >
          {updating ? "Updating..." : "Reject"}
        </Button>
      </div>
    </section>
  );
}
