"use client";

import { Event } from "@/lib/types";
import { EventDetails } from "./event-details";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeedbackDialog } from "@/components/common/FeedbackDialog";

interface ViewEventProps {
  event: Event;
  isRegistered?: boolean;
}

export function ViewEvent({ event, isRegistered = false }: ViewEventProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">

      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <EventDetails event={event} />


      <div className="flex justify-end gap-3">
        {isRegistered && <FeedbackDialog />}
        <Button disabled={isRegistered}>
          {isRegistered ? "Registered" : "Register for Event"}
        </Button>
      </div>
    </div>
  );
}
