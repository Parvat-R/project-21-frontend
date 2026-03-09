// components/EventApprovalCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventApprovalCardProps {
  eventId: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  creator: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  loading?: boolean;
  onDecision: (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => Promise<void> | void;
}

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
  loading = false,
  onDecision,
}: EventApprovalCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">Created by {creator}</p>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{description}</p>
        <div className="text-sm space-y-1">
          <p>
            <strong>Start:</strong> {new Date(startDatetime).toLocaleString()}
          </p>
          <p>
            <strong>End:</strong> {new Date(endDatetime).toLocaleString()}
          </p>
          <p>
            <strong>Seats:</strong> {seats}
          </p>
          <p>
            <strong>Amount:</strong> ₹{amount}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                approvalStatus === "APPROVED"
                  ? "text-green-600 font-semibold"
                  : approvalStatus === "REJECTED"
                    ? "text-red-600 font-semibold"
                    : "text-yellow-600 font-semibold"
              }
            >
              {approvalStatus}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="default"
          onClick={() => onDecision(eventId, "APPROVED")}
          disabled={loading}
        >
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDecision(eventId, "REJECTED")}
          disabled={loading}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
