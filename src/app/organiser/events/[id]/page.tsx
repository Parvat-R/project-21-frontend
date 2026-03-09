import { ViewEvent } from "@/components/organiser/view-event";
import { Event } from "@/lib/types";

function toImageSrc(imageData: unknown): string {
  if (!imageData) return "";

  if (typeof imageData === "string") {
    if (imageData.startsWith("data:image/")) return imageData;
    if (imageData.startsWith("http://") || imageData.startsWith("https://") || imageData.startsWith("/")) {
      return imageData;
    }
    return `data:image/jpeg;base64,${imageData}`;
  }

  if (Array.isArray(imageData) && imageData.every((value) => typeof value === "number")) {
    return `data:image/jpeg;base64,${Buffer.from(imageData).toString("base64")}`;
  }

  if (typeof imageData === "object") {
    const bufferStyle = imageData as { type?: string; data?: number[] };
    if (bufferStyle.type === "Buffer" && Array.isArray(bufferStyle.data)) {
      return `data:image/jpeg;base64,${Buffer.from(bufferStyle.data).toString("base64")}`;
    }
  }

  return "";
}

type EventApiResponse = Omit<Event, "imageData" | "amount"> & {
  imageData?: unknown;
  amount: number | string;
};

export default async function OrganiserEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  const eventRes = await fetch(`${apiBase}/api/event/${id}`, { cache: "no-store" });

  if (!eventRes.ok) {
    return <p className="text-sm text-destructive">Unable to load this event.</p>;
  }

  const eventRaw: EventApiResponse = await eventRes.json();

  const event: Event = {
    ...eventRaw,
    amount: Number(eventRaw.amount),
    imageData: toImageSrc(eventRaw.imageData),
  };

  return <ViewEvent event={event} eventId={id} backHref="/organiser/events/internal" />;
}
