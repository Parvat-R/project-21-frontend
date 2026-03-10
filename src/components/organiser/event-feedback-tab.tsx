"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareOff } from "lucide-react";

type FeedbackUser = {
  id: string;
  name: string;
  email: string;
};

type FeedbackItem = {
  id: string;
  description: string;
  stars: number;
  registration: {
    user?: FeedbackUser;
  };
};

export function EventFeedbackTab({ eventId }: { eventId: string }) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;

    const fetchFeedback = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
          "http://localhost:3000";
        const res = await fetch(`${apiBase}/api/feedback/event/${eventId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError("Failed to load feedback.");
          return;
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setFeedbacks(json.data);
        } else {
          setFeedbacks([]);
        }
      } catch {
        setError("Unable to reach the server to fetch feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [eventId]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground p-4">Loading feedback...</p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive p-4">{error}</p>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-muted/20">
        <MessageSquareOff className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-foreground">No feedback yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Attendees haven&apos;t left any feedback for this event.
        </p>
      </div>
    );
  }

  const averageStars =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.stars, 0) / feedbacks.length).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{averageStars}</span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <span className="text-xl font-semibold">{feedbacks.length}</span>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid gap-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">
                  {fb.registration?.user?.name || "Anonymous User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fb.registration?.user?.email || "No email"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < fb.stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            {fb.description && (
              <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">
                {fb.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
