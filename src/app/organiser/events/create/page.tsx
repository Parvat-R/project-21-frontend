import { EventForm } from "@/components/organiser/EventForm";

export default function CreateEventPage() {
  return (
    <main className="mx-auto w-full max-w-6xl">
      <h1 className="mb-2 text-2xl font-semibold">Organiser Event Creation</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Create an event by submitting data to backend `POST /api/event`.
      </p>
      <EventForm />
    </main>
  );
}
