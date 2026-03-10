"use client";

import EventFeatureCard from "./EventFeatureCard";
import { eventFeatures } from "@/lib/mockEventFeature";

export default function EventFeaturesSection() {
  return (
    <section className="bg-gray-100 py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE - CARDS */}
        <div className="relative space-y-8">
          {/* Background Circle */}
          <div className="absolute -left-20 top-10 w-105 h-105 bg-orange-200 rounded-full opacity-40 blur-2xl"></div>

          <div className="relative grid gap-6">
            {eventFeatures.map((feature, index) => (
              <EventFeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div>
          <p className="text-orange-500 font-semibold mb-2">
            Event Management Platform
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Professional Event Registration & Management System
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Our web-based event management platform helps organizers create,
            manage, and track events efficiently. Users can discover upcoming
            events, register online, receive confirmations, and stay updated
            with event notifications. Organizers gain powerful tools to manage
            attendees, track participation, and generate insightful event
            reports.
          </p>

          <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
            Explore the Platform
          </button>
        </div>
      </div>
    </section>
  );
}
