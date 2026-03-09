"use client";

import { Event, RegisteredUser } from "@/lib/types";
import { EventDetails } from "./event-details";
import { RegisteredUsersTable } from "./registered-users-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ViewEventProps {
  event: Event;
  registeredUsers: RegisteredUser[];
}

export function ViewEvent({ event, registeredUsers }: ViewEventProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="users">
            Registered Users ({registeredUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <EventDetails event={event} />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <RegisteredUsersTable users={registeredUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
