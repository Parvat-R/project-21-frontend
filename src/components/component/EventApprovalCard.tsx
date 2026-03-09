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
import { useState } from "react";

interface EventApprovalCardProps {
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  seats: number;
  amount: number;
  creator: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export function EventApprovalCard({
  title,
  description,
  startDatetime,
  endDatetime,
  seats,
  amount,
  creator,
  approvalStatus: initialStatus,
}: EventApprovalCardProps) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    initialStatus,
  );

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
                status === "APPROVED"
                  ? "text-green-600 font-semibold"
                  : status === "REJECTED"
                    ? "text-red-600 font-semibold"
                    : "text-yellow-600 font-semibold"
              }
            >
              {status}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default" onClick={() => setStatus("APPROVED")}>
          Approve
        </Button>
        <Button variant="destructive" onClick={() => setStatus("REJECTED")}>
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
