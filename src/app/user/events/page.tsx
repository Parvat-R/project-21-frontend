import { ViewEvent } from "@/components/user-event/view-event";
import { Navbar } from "@/components/common/Navbar";
import { mockEvent } from "@/lib/mock-data";

export default function EventPage() {
  return (
    <div>
      <Navbar />
      <ViewEvent event={mockEvent} />
    </div>
  );
}
