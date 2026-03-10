import { Event, RegisteredUser } from "@/lib/types";

export const mockEvent: Event = {
  id: "evt-001",
  creatorId: "usr-101",
  slug: "tech-summit-2026",
  title: "Tech Summit 2026",
  description:
    "A premier technology conference bringing together industry leaders, developers, and innovators to discuss the latest trends in AI, cloud computing, and software engineering. Join us for keynotes, workshops, and networking sessions.",
  approvalStatus: "APPROVED",
  createdOn: "2026-02-15T10:00:00Z",
  startDatetime: "2026-04-10T09:00:00Z",
  endDatetime: "2026-04-12T18:00:00Z",
  imageUrl: "/placeholder-event.jpg",
  seats: 500,
  amount: 1500,
  visibility: "PUBLIC",
};

export const mockRegisteredUsers: RegisteredUser[] = [
  { id: "usr-201", email: "alice@example.com", approved: true },
  { id: "usr-202", email: "bob@example.com", approved: false },
  { id: "usr-203", email: "charlie@example.com", approved: true },
  { id: "usr-204", email: "diana@example.com", approved: false },
  { id: "usr-205", email: "eve@example.com", approved: true },
  { id: "usr-206", email: "frank@example.com", approved: false },
  { id: "usr-207", email: "grace@example.com", approved: true },
];
