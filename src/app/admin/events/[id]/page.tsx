// app/events/[id]/page.tsx
import { notFound } from "next/navigation";
import img from "@/assests/event.png";
import type { StaticImageData } from "next/image";

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
];

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = dummyEvents.find((e) => e.id === id);

  if (!event) return notFound();

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <img
        src={event.image}
        alt={event.title}
        className="rounded-md mb-4 w-full max-w-2xl"
      />
      <p className="mb-2">{event.description}</p>
      <p>
        <strong>Date:</strong> {event.date} at {event.time}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Attendees:</strong> {event.attendees}
      </p>
      <p>
        <strong>Rating:</strong> {event.rating}
      </p>
      <p>
        <strong>Status:</strong> {event.status}
      </p>
    </div>
  );
}
