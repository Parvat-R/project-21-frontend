"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Play, Check, Ticket, CreditCard, Clock } from "lucide-react";
import { EventStatCard } from "@/components/admin/EventStatCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type EventItem = {
  id: string;
  title: string;
  description: string;
  visibility: "INTERNAL" | "PUBLIC";
  creatorId: string;
  startDatetime: string;
  endDatetime: string;
  amount: number;
  seats: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
};

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

function getEventLifecycleStatus(event: Pick<EventItem, "startDatetime" | "endDatetime">): EventStatus {
  const now = new Date();
  const start = new Date(event.startDatetime);
  const end = new Date(event.endDatetime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "CANCELLED";
  }

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ONGOING";
  return "COMPLETED";
}

export default function UserDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<EventStatus | "ALL">("ALL");

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
        // Fetching all approved events for now since we can't change backend API.
        // We will locally mock which events the user is registered to for demonstration.
        const response = await fetch(
          `${apiBase}/api/event?approvalStatus=APPROVED&includeImage=true&take=50`,
          { cache: "no-store" }
        );
        const result = await response.json();

        if (!response.ok) {
          setError(result?.error ?? "Failed to fetch events.");
          return;
        }

        const fetchedEvents = Array.isArray(result) ? result : [];
        
        // MOCK: We simulate the user being registered to 60% of the fetched events randomly 
        // or just take the first few to populate "My Events" reliably without backend changes.
        const myRegisteredEvents = fetchedEvents.filter((_, idx) => idx % 2 === 0);
        
        setEvents(myRegisteredEvents);
      } catch {
        setError("Unable to load your registered events.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === "ALL") return events;
    return events.filter((event) => getEventLifecycleStatus(event) === activeTab);
  }, [activeTab, events]);

  const stats = useMemo(() => {
    const counts: Record<EventStatus, number> = {
      UPCOMING: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    
    let totalSpent = 0;

    for (const event of events) {
      const status = getEventLifecycleStatus(event);
      counts[status] += 1;
      
      // Calculate total payments/spend
      if (typeof event.amount !== 'undefined') {
        totalSpent += Number(event.amount);
      }
    }

    return { counts, totalSpent, totalRegistered: events.length };
  }, [events]);

  return (
    <section className="w-full h-full pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
        <p className="text-muted-foreground mt-1">Manage and track all the events you have registered for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
        <EventStatCard
          category="Total Registered"
          count={stats.totalRegistered}
          comparison="All your events"
          color="blue"
          icon={<Ticket className="w-5 h-5" />}
        />
        <EventStatCard
          category="Upcoming"
          count={stats.counts.UPCOMING}
          comparison="Awaiting start"
          color="yellow"
          icon={<Calendar className="w-5 h-5" />}
        />
        <EventStatCard
          category="Completed"
          count={stats.counts.COMPLETED}
          comparison="Past events"
          color="green"
          icon={<Check className="w-5 h-5" />}
        />
        <EventStatCard
          category="Total Spent"
          count={stats.totalSpent}
          comparison="₹ total on registrations"
          color="yellow"
          icon={<CreditCard className="w-5 h-5" />}
        />
      </div>

      <div className="flex space-x-2 rounded-lg bg-muted/50 p-1 mt-8 mb-6 max-w-fit">
         {[ 
            { id: "ALL", label: "All Events", icon: Ticket },
            { id: "UPCOMING", label: "Upcoming", icon: Calendar }, 
            { id: "ONGOING", label: "Ongoing", icon: Play }, 
            { id: "COMPLETED", label: "Completed", icon: Check }
         ].map((tab) => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-background shadow text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
             >
                <Icon className="w-4 h-4" />
                {tab.label}
             </button>
           )
         })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
           <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
           <p className="text-muted-foreground">Loading your events...</p>
        </div>
      ) : null}
      
      {error ? (
        <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const status = getEventLifecycleStatus(event);
              
              const statusColors = {
                  UPCOMING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  ONGOING: 'bg-blue-100 text-blue-800 border-blue-200',
                  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
                  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
              };

              return (
                <article key={event.id} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full">
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/60 text-muted-foreground">
                        <ImageIcon className="w-10 h-10 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                       <span className={`px-2.5 py-1 rounded-full border text-xs font-bold shadow-sm backdrop-blur-md ${statusColors[status]}`}>
                          {status}
                       </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{event.title}</h2>
                    </div>

                    <p className="mb-5 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-grow">
                      {event.description || "No description provided."}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-border/60">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(event.startDatetime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Registration</span>
                           <span className="text-sm font-bold text-foreground">
                             {event.amount === 0 ? "FREE" : `₹${event.amount}`}
                           </span>
                        </div>
                        <Button size="sm" asChild className="rounded-lg shadow-sm">
                          <Link href={`/events/${event.id}`}>View Ticket</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
             <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed rounded-xl bg-muted/10">
                 <Ticket className="w-12 h-12 text-muted-foreground/30 mb-4" />
                 <h3 className="text-lg font-medium text-foreground">No events found</h3>
                 <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                    {activeTab === "ALL" 
                      ? "You haven't registered for any events yet. Explore public events to get started!"
                      : `You don't have any ${activeTab.toLowerCase()} events right now.`}
                 </p>
                 <Button variant="outline" className="mt-6" asChild>
                    <Link href="/">Explore Events</Link>
                 </Button>
             </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

// Fallback icon component if image is missing
function ImageIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
