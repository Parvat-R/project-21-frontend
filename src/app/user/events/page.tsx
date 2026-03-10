import { ViewEvent } from "@/components/user-event/view-event";
import { mockEvent } from "@/lib/mock-data";

export default function EventPage() {
  return (
    <div>
      <ViewEvent event={mockEvent} isRegistered={true} />
    </div>
  );
}
