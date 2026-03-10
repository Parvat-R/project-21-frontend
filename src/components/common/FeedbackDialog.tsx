"use client"

import { StarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

interface FeedbackDialogProps {
  registrationId: string;
  eventId?: string;
  onSuccess?: () => void;
}

export const FeedbackDialog = ({ registrationId, onSuccess }: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          registrationId,
          description: feedback,
          stars: rating,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        onSuccess?.();
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
          setRating(0);
          setFeedback("");
        }, 1500);
      } else {
        setError(data.message ?? "Failed to submit feedback.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear your thoughts on this event.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <p className="py-6 text-center text-sm font-medium text-green-600">
            ✓ Thank you! Your feedback has been submitted.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      className="transition-transform hover:scale-110"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      type="button"
                    >
                      <StarIcon
                        className={cn(
                          "h-8 w-8 transition-colors",
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Your feedback</Label>
                <Textarea
                  className="min-h-[120px]"
                  id="feedback"
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={rating === 0 || loading}
                type="button"
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackDialog;
