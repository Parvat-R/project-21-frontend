"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { EventDetails } from "./event-details";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeedbackDialog } from "@/components/common/FeedbackDialog";
import { getUser, getToken } from "@/lib/auth";
import {
  registerForEvent,
  getUserRegistrations,
} from "@/services/operations/Registration";

interface ViewEventProps {
  event: Event;
}

type RegState = "loading" | "not-registered" | "registered";

export function ViewEvent({ event }: ViewEventProps) {
  const isEventOver = new Date(event.endDatetime) < new Date();

  const [regState, setRegState] = useState<RegState>("loading");
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState("");
  const [feedbackDone, setFeedbackDone] = useState(false);

  // On mount — check if the user is already registered for this event
  useEffect(() => {
    const check = async () => {
      const user = getUser();
      const token = getToken();
      if (!user || !token) {
        setRegState("not-registered");
        return;
      }

      const registrations = await getUserRegistrations(user.userId, token);
      const existing = registrations.find((r) => r.eventId === event.id);
      if (existing) {
        setRegistrationId(existing.id);
        setRegState("registered");
        setFeedbackDone(!!existing.feedback);
      } else {
        setRegState("not-registered");
      }
    };
    check();
  }, [event.id]);

  const handleRegister = async () => {
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
      setRegError("You must be signed in to register.");
      return;
    }

    setRegistering(true);
    setRegError("");

    try {
      const result = await registerForEvent(event.id, user.userId, token);
      if (result.acknowledgement) {
        // Fetch the registrationId from the user's registrations
        const registrations = await getUserRegistrations(user.userId, token);
        const created = registrations.find((r) => r.eventId === event.id);
        setRegistrationId(created?.id ?? null);
        setRegState("registered");
      } else {
        setRegError(result.message ?? "Registration failed. Please try again.");
      }
    } catch {
      setRegError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = regState === "registered";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link href="/user/events">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <EventDetails event={event} />

      {/* Error message */}
      {regError ? (
        <p className="text-sm text-destructive">{regError}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        {/* Feedback button — only when registered AND event is over AND no feedback yet */}
        {isRegistered && isEventOver && registrationId && (
          <div className="flex items-center gap-2">
            {feedbackDone ? (
              <Button disabled variant="outline" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Feedback Submitted
              </Button>
            ) : (
              <FeedbackDialog
                registrationId={registrationId}
                eventId={event.id}
                onSuccess={() => setFeedbackDone(true)}
              />
            )}
          </div>
        )}

        {/* Register button */}
        {regState === "loading" ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </Button>
        ) : isRegistered ? (
          <Button
            disabled
            className="cursor-not-allowed gap-2 bg-green-600 text-white opacity-90 hover:bg-green-600"
          >
            <CheckCircle2 className="h-4 w-4" />
            Registered
          </Button>
        ) : isEventOver ? (
          <Button disabled>Event Ended</Button>
        ) : (
          <Button onClick={handleRegister} disabled={registering}>
            {registering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register for Event"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
