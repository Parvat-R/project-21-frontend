// app/events/page.tsx
"use client";

import { useState } from "react";
import { EventCard } from "@/components/component/EventCard";
import { EventFilterBanner } from "@/components/component/EventFilterBanner";
import img from "@/assests/event.png";
import { StaticImageData } from "next/dist/shared/lib/image-external";

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  rating: string;
  image: string | StaticImageData;
  status: EventStatus;
}

export default function EventsPage() {
  const [filter, setFilter] = useState<EventStatus | "ALL">("ALL");

  const dummyEvents: EventData[] = [
    {
      id: "1",
      title: "City Marathon 2024",
      description: "Annual marathon event with thousands of participants.",
      date: "Jan 03",
      time: "07:00 AM",
      location: "Uyanwatta Ground, Sri Lanka",
      attendees: "5678",
      rating: "★★★★☆",
      image: img,
      status: "UPCOMING",
    },
    {
      id: "2",
      title: "IIT Convocation",
      description: "Graduation ceremony for IIT students.",
      date: "Jan 13",
      time: "11:00 AM",
      location: "BMICH, Sri Lanka",
      attendees: "4000+",
      rating: "★★★★☆",
      image: img,
      status: "COMPLETED",
    },
    {
      id: "3",
      title: "Summer Beats Festival",
      description: "Music festival with international artists.",
      date: "Dec 15",
      time: "07:00 PM",
      location: "Wembley Stadium, London",
      attendees: "20000+",
      rating: "★★★★★",
      image: img,
      status: "UPCOMING",
    },
  ];

  const filteredEvents =
    filter === "ALL"
      ? dummyEvents
      : dummyEvents.filter((e) => e.status === filter);

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <EventFilterBanner value={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, idx) => (
          <EventCard key={idx} {...event} />
        ))}
      </div>
    </div>
  );
}
