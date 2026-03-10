// components/EventSection.tsx
"use client";

import EventCard from "./EventCard";
import { events } from "@/lib/mockEventData";


export default function EventSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-orange-500 font-medium">What We Do</p>

          <h2 className="text-3xl font-bold">
            Top <span className="text-orange-500">Event Planning</span> Services
          </h2>
        </div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
