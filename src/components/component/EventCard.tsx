// components/EventCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  rating: string;
  image: string;
  status: EventStatus;
}

export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  attendees,
  rating,
  image,
  status,
}: EventCardProps) {
  return (
    <Link href={`/events/${id}`}>
      <Card className="w-full max-w-md shadow-md cursor-pointer hover:shadow-lg transition p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{status}</p>
        </CardHeader>
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className="rounded-md object-cover"
        />
        <CardContent className="space-y-2 mt-2">
          <p>{description}</p>
          <p>
            <strong>Date:</strong> {date} at {time}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Attendees:</strong> {attendees}
          </p>
          <p>
            <strong>Rating:</strong> {rating}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
