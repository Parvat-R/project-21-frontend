// components/EventCard.tsx
"use client";
import { format } from "date-fns";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition">
      {/* Image */}
      <div className="relative h-64 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-gray-500 text-sm">
          {format(new Date(event.startDatetime), "dd/MM/yyyy")}
        </p>
        <p className="text-orange-500 font-semibold mt-2">₹{event.amount}</p>
      </CardContent>
    </Card>
  );
}
