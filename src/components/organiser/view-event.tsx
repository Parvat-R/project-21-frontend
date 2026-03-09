"use client";

import { useEffect, useState } from "react";
import { Event, RegisteredUser } from "@/lib/types";
import { EventDetails } from "./event-details";
import { RegisteredUsersTable } from "./registered-users-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ViewEventProps {
  event: Event;
  eventId?: string;
  registeredUsers?: RegisteredUser[];
  backHref?: string;
}

type RegistrationApiResponse = {
  user?: {
    id: string;
    email: string;
  };
  attendance?: boolean;
};

export function ViewEvent({ event, eventId, registeredUsers = [], backHref = "/" }: ViewEventProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState<RegisteredUser[]>(registeredUsers);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(registeredUsers.length > 0);

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
          .filter((item) => item.user?.id && item.user?.email)
          .map((item) => ({
            id: item.user!.id,
            email: item.user!.email,
            approved: Boolean(item.attendance),
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
      {/* Back button */}
      <Link href={backHref}>
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

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
