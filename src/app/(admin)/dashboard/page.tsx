// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { EventStatCard } from "@/components/component/EventStatCard";
import { EventApprovalCard } from "@/components/component/EventApprovalCard";
import { EventFilterBanner } from "@/components/component/EventFilterBanner";
import { Calendar, Play, Check, Ban } from "lucide-react";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function Dashboard() {
  const [filter, setFilter] = useState<string>("ALL");

  const dummyEvents: {
    title: string;
    description: string;
    startDatetime: string;
    endDatetime: string;
    seats: number;
    amount: number;
    creator: string;
    approvalStatus: ApprovalStatus;
  }[] = [
    {
      title: "Tech Conference 2026",
      description: "A conference about the latest in AI and cloud computing.",
      startDatetime: "2026-04-01T10:00:00",
      endDatetime: "2026-04-01T17:00:00",
      seats: 200,
      amount: 499,
      creator: "Alice Johnson",
      approvalStatus: "PENDING",
    },
    {
      title: "Music Festival",
      description: "Outdoor festival with multiple bands and food stalls.",
      startDatetime: "2026-05-10T12:00:00",
      endDatetime: "2026-05-10T23:00:00",
      seats: 500,
      amount: 999,
      creator: "Bob Singh",
      approvalStatus: "APPROVED",
    },
    {
      title: "Startup Pitch Night",
      description: "Local entrepreneurs pitch their ideas.",
      startDatetime: "2026-06-15T18:00:00",
      endDatetime: "2026-06-15T21:00:00",
      seats: 100,
      amount: 299,
      creator: "Clara Lee",
      approvalStatus: "REJECTED",
    },
  ];

  const filteredEvents =
    filter === "ALL"
      ? dummyEvents
      : dummyEvents.filter((e) => e.approvalStatus === filter);

  return (
    <div className="w-full h-full">
      {/* Stats row */}
      <div className="flex justify-center m-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          <EventStatCard
            category="Upcoming Events"
            count={123}
            comparison="+1.34% Vs Last Month"
            color="yellow"
            icon={<Calendar />}
          />
          <EventStatCard
            category="Ongoing Events"
            count={456}
            comparison="-1.05% Vs Last Month"
            color="blue"
            icon={<Play />}
          />
          <EventStatCard
            category="Completed Events"
            count={789}
            comparison="+2.74% Vs Last Month"
            color="green"
            icon={<Check />}
          />
          <EventStatCard
            category="Cancelled Events"
            count={101}
            comparison="+0.04% Vs Last Month"
            color="red"
            icon={<Ban />}
          />
        </div>
      </div>

      {/* Banner filter */}
      <EventFilterBanner value={filter} onChange={setFilter}  />

      {/* Approval cards */}
      <div className="flex flex-col items-center space-y-6 mt-6">
        {filteredEvents.map((event, idx) => (
          <div key={idx} className="w-full max-w-2xl">
            <EventApprovalCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
}
