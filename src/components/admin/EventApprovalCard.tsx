"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface EventApprovalCardProps {
  eventId: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  creator: string;
  approvalStatus: ApprovalStatus;
  imageUrl?: string;
  loading?: boolean;
  onDecision: (id: string, status: "APPROVED" | "REJECTED") => Promise<void> | void;
}

const statusColor: Record<ApprovalStatus, string> = {
  PENDING: "text-yellow-600",
  APPROVED: "text-green-600",
  REJECTED: "text-red-600",
};

export function EventApprovalCard({
  eventId,
  title,
  description,
  startDatetime,
  endDatetime,
  seats,
  amount,
  creator,
  approvalStatus,
  imageUrl,
  loading = false,
  onDecision,
}: EventApprovalCardProps) {
  const start = new Date(startDatetime);
  const end = new Date(endDatetime);

  const dateStr = start.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const timeStr = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition p-4 cursor-default">
      {/* Title + status label */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className={`text-sm font-semibold ${statusColor[approvalStatus]}`}>
          {approvalStatus}
        </p>
      </CardHeader>

      {/* Full-width image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full rounded-md object-cover"
          style={{ height: "200px" }}
        />
      ) : (
        <div className="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs text-muted-foreground" style={{ height: "200px" }}>
          No image
        </div>
      )}

      {/* Details */}
      <CardContent className="space-y-2 mt-3 pb-2">
        <p className="text-sm">{description || "No description provided."}</p>
        <p className="text-sm">
          <strong>Date:</strong> {dateStr} at {timeStr} – {endTimeStr}
        </p>
        <p className="text-sm">
          <strong>Creator:</strong>{" "}
          <span className="font-mono text-xs">{creator}</span>
        </p>
        <p className="text-sm">
          <strong>Seats:</strong> {seats}
        </p>
        <p className="text-sm">
          <strong>Amount:</strong> ₹{amount}
        </p>
      </CardContent>

      {/* Approve / Reject actions */}
      <div className="flex gap-2 px-4 pb-4">
        <Button
          size="sm"
          variant="default"
          className="flex-1"
          onClick={() => onDecision(eventId, "APPROVED")}
          disabled={loading || approvalStatus === "APPROVED"}
        >
          {loading ? "Updating..." : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={() => onDecision(eventId, "REJECTED")}
          disabled={loading || approvalStatus === "REJECTED"}
        >
          {loading ? "Updating..." : "Reject"}
        </Button>
      </div>
    </Card>
  );
}
