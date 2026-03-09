"use client";

import { Event } from "@/lib/types";
import { EventDetails } from "./event-details";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ViewEventProps {
  event: Event;
}

export function ViewEvent({ event }: ViewEventProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <EventDetails event={event} />

      {/* Register button */}
      <div className="flex justify-end">
        <Button>Register for Event</Button>
      </div>
    </div>
  );
}
