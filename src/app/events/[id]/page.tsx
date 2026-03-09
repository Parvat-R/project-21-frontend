import { ViewEvent } from "@/components/organiser/view-event";
import { Navbar } from "@/app/components/Navbar";
import { mockEvent, mockRegisteredUsers } from "@/lib/mock-data";

export default function EventPage() {
  return (
    <div>
      <Navbar />
      <ViewEvent event={mockEvent} registeredUsers={mockRegisteredUsers} />
    </div>
  );
}
