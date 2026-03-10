"use client";

import { useEffect, useState } from "react";
import { Event, RegisteredUser } from "@/lib/types";
import { EventDetails } from "./event-details";
import { RegisteredUsersTable } from "./registered-users-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth";

interface ViewEventProps {
  event: Event;
  eventId?: string;
  registeredUsers?: RegisteredUser[];
  backHref?: string;
  editHref?: string;
  showRegister?: boolean;
  /** The creatorId of the event — used to decide Edit vs Register */
  creatorId?: string;
}

type RegistrationApiResponse = {
  id: string;
  user?: {
    id: string;
    email: string;
  };
  attendance?: boolean;
};

export function ViewEvent({ event, eventId, registeredUsers = [], backHref = "/", editHref, showRegister, creatorId }: ViewEventProps) {
  const currentUser = getUser();
  const isCreator = creatorId ? currentUser?.userId === creatorId : false;
  const resolvedEditHref = isCreator ? `/organiser/events/${eventId}/edit` : editHref;
  const resolvedShowRegister = showRegister !== undefined ? showRegister : !isCreator;

  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState<RegisteredUser[]>(registeredUsers);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(registeredUsers.length > 0);
  const [registering, setRegistering] = useState(false);
  const [registerMsg, setRegisterMsg] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    if (activeTab !== "users" || usersLoaded || !eventId) return;

    const loadUsers = async () => {
      try {
        setIsUsersLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        const response = await fetch(`${apiBase}/api/register/event/${eventId}`, { cache: "no-store" });

        if (!response.ok) {
          setUsers([]);
          setUsersLoaded(true);
          return;
        }

        const data: RegistrationApiResponse[] = await response.json();
        const mappedUsers: RegisteredUser[] = (Array.isArray(data) ? data : [])
          .filter((item) => item.id && item.user?.id && item.user?.email)
          .map((item) => ({
            id: item.user!.id,
            email: item.user!.email,
            approved: Boolean(item.attendance),
            registrationId: item.id,
          }));

        setUsers(mappedUsers);
        setUsersLoaded(true);
      } finally {
        setIsUsersLoading(false);
      }
    };

    loadUsers();
  }, [activeTab, usersLoaded, eventId]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Back + Action row */}
      <div className="flex items-center justify-between">
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {resolvedEditHref && (
            <Link href={resolvedEditHref}>
              <Button size="sm">Edit Event</Button>
            </Link>
          )}

          {resolvedShowRegister && (
            <Button
              size="sm"
              disabled={registering || !!registerMsg}
              onClick={async () => {
                if (!eventId) return;
                setRegistering(true);
                setRegisterError("");
                try {
                  const apiBase =
                    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
                    "http://localhost:3000";
                  const res = await fetch(`${apiBase}/api/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: getUser()?.userId ?? "",
                      eventId,
                    }),
                  });
                  if (res.ok) {
                    setRegisterMsg("Registered successfully!");
                  } else {
                    const data = await res.json();
                    setRegisterError(data?.error ?? "Registration failed.");
                  }
                } catch {
                  setRegisterError("Unable to reach server.");
                } finally {
                  setRegistering(false);
                }
              }}
            >
              {registering ? "Registering..." : registerMsg ? "Registered ✓" : "Register"}
            </Button>
          )}
        </div>
      </div>

      {registerError && <p className="text-sm text-destructive">{registerError}</p>}
      {registerMsg && !registerError && <p className="text-sm text-green-600">{registerMsg}</p>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="users">
            Registered Users ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <EventDetails event={event} />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          {isUsersLoading ? (
            <p className="text-sm text-muted-foreground">Loading registered users...</p>
          ) : (
            <RegisteredUsersTable users={users} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
