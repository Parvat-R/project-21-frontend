"use client";

import { useState, useEffect } from "react";
import { Calendar, Play, Check, IndianRupee, MapPin, UserCheck, TicketCheck } from "lucide-react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser, getToken } from "@/lib/auth";

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

type EventItem = {
  id: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  amount: number;
  location: string;
  status: EventStatus;
  imageUrl?: string;
};

// ------------------------------------

// ------------------------------------

export default function UserDashboardPage() {
  const [filter, setFilter] = useState<EventStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistered: 0,
    amountSpent: 0,
    eventsAttended: 0,
    upcomingEvents: 0,
  });
  const [registeredEvents, setRegisteredEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getUser();
        const token = getToken();
        if (!user || !token) {
          setLoading(false);
          return;
        }

        const userId = user.userId;
        const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

        // Fetch Registered Events
        const eventsRes = await fetch(`${apiBase}/api/register/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (eventsRes.ok) {
          const registrations = await eventsRes.json();
          const regArray = Array.isArray(registrations) ? registrations : [];

          const now = new Date();
          
          let totalSpent = 0;
          let attendedCount = 0;
          let upcomingCount = 0;

          const formattedEvents: EventItem[] = regArray.map((reg: any) => {
            const ev = reg.event;
            const start = new Date(ev.startDatetime);
            const end = new Date(ev.endDatetime);

            let status: EventStatus = "UPCOMING";
            if (now < start) {
              status = "UPCOMING";
              upcomingCount++;
            }
            else if (now >= start && now <= end) status = "ONGOING";
            else status = "COMPLETED";

            totalSpent += Number(ev.amount || 0);

            if (reg.attendance === true) {
              attendedCount++;
            }

            return {
              id: ev.id,
              title: ev.title,
              description: ev.description,
              startDatetime: ev.startDatetime,
              endDatetime: ev.endDatetime,
              amount: Number(ev.amount),
              location: ev.location || "Online",
              status: status,
              imageUrl: ev.imageUrl
            };
          });

          setStats({
            totalRegistered: regArray.length,
            amountSpent: totalSpent,
            eventsAttended: attendedCount,
            upcomingEvents: upcomingCount,
          });

          setRegisteredEvents(formattedEvents);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredEvents =
    filter === "ALL"
      ? registeredEvents
      : registeredEvents.filter((e) => e.status === filter);

  return (
    <section className="w-full h-full pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal activity report and registered events.</p>
      </div>

      {/* --- STATISTICS CARDS --- */}
      {loading ? (
        <div className="text-muted-foreground animate-pulse mb-10 w-full h-24 bg-muted/20 border rounded-xl flex items-center justify-center">Loading your stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-10">
          <EventStatCard
            category="Total Registered"
            count={stats.totalRegistered}
            comparison="All time event registrations"
            color="blue"
            icon={<TicketCheck />}
          />
          <EventStatCard
            category="Amount Spent"
            count={stats.amountSpent}
            comparison="Total invested in events"
            color="green"
            icon={<IndianRupee />}
          />
          <EventStatCard
            category="Events Attended"
            count={stats.eventsAttended}
            comparison="Successful attendances"
            color="yellow"
            icon={<UserCheck />}
          />
          <EventStatCard
            category="Upcoming Events"
            count={stats.upcomingEvents}
            comparison="Awaiting participation"
            color="red"
            icon={<Calendar />}
          />
        </div>
      )}

      {/* --- MY EVENTS LISTING --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold">My Events</h2>
          <p className="text-sm text-muted-foreground">Manage the events you are participating in.</p>
        </div>

        {/* Custom Pill Navigation for Filtering */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg overflow-x-auto w-full md:w-auto">
          {(["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as (EventStatus | "ALL")[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${filter === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {tab === "ALL" ? "All Events" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => (
            <article key={idx} className="flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition duration-200 overflow-hidden group">
              {/* Image Section */}
              <div className="relative h-44 w-full bg-muted overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-xs font-medium text-muted-foreground">
                    No Image Provided
                  </div>
                )}
                {/* Embedded Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur-md ${event.status === "COMPLETED"
                        ? "bg-green-100/90 text-green-800 border-green-200"
                        : event.status === "ONGOING"
                          ? "bg-blue-100/90 text-blue-800 border-blue-200"
                          : event.status === "CANCELLED"
                            ? "bg-red-100/90 text-red-800 border-red-200"
                            : "bg-yellow-100/90 text-yellow-800 border-yellow-200"
                      } border`}
                  >
                    {event.status === "ONGOING" && <Play className="w-3 h-3 mr-1 fill-current" />}
                    {event.status === "COMPLETED" && <Check className="w-3 h-3 mr-1" />}
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">{event.title}</h3>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground mb-4 flex-grow">
                  {event.description || "No description provided."}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    <span className="font-medium text-foreground">
                      {new Date(event.startDatetime).toLocaleDateString(undefined, {
                        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mr-2" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {event.amount === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span className="text-foreground">₹{event.amount}</span>
                    )}
                  </span>
                  <Button size="sm" asChild variant="outline" className="rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <TicketCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No events found</h3>
            <p className="text-sm text-muted-foreground mt-1">You do not have any {filter !== "ALL" ? filter.toLowerCase() : ""} events matching this filter.</p>
            {filter !== "ALL" && (
              <Button variant="outline" className="mt-4" onClick={() => setFilter("ALL")}>
                View All Events
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
