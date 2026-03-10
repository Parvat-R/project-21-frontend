"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface EventDisplayCardProps {
  id: string;
  title: string;
  description?: string;
  startDatetime: string;
  endDatetime: string;
  seats?: number;
  amount?: number;
  visibility?: string;
  imageUrl?: string;
  approvalStatus?: ApprovalStatus;
  /** href the primary action button links to */
  actionHref: string;
  /** Label for the primary action button */
  actionLabel?: string;
}

const approvalColors: Record<ApprovalStatus, string> = {
  PENDING: "text-yellow-600",
  APPROVED: "text-green-600",
  REJECTED: "text-red-600",
};

export function EventDisplayCard({
  id,
  title,
  description,
  startDatetime,
  endDatetime,
  seats,
  amount,
  visibility,
  imageUrl,
  approvalStatus,
  actionHref,
  actionLabel = "View More",
}: EventDisplayCardProps) {
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
      {/* Title + optional approval status */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {approvalStatus && (
          <p className={`text-sm font-semibold ${approvalColors[approvalStatus]}`}>
            {approvalStatus}
          </p>
        )}
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
        <div
          className="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs text-muted-foreground"
          style={{ height: "200px" }}
        >
          No image
        </div>
      )}

      {/* Details */}
      <CardContent className="space-y-2 mt-3 pb-2">
        <p className="text-sm">{description || "No description provided."}</p>
        <p className="text-sm">
          <strong>Date:</strong> {dateStr} at {timeStr} – {endTimeStr}
        </p>
        {seats !== undefined && (
          <p className="text-sm">
            <strong>Seats:</strong> {seats}
          </p>
        )}
        {amount !== undefined && (
          <p className="text-sm">
            <strong>Amount:</strong> ₹{amount}
          </p>
        )}
        {visibility && (
          <p className="text-sm">
            <strong>Visibility:</strong> {visibility}
          </p>
        )}
      </CardContent>

      {/* Action button */}
      <div className="px-4 pb-2">
        <Button size="sm" className="w-full" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
