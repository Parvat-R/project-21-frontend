import { Event } from "@/lib/types";
import img from "@/assests/2.jpeg";

export const events: Event[] = [
  {
    id: "1",
    slug: "wedding-planning",
    title: "Wedding Planning & Management",
    description: "Complete wedding planning services.",
    startDatetime: "2026-08-10T18:00:00",
    endDatetime: "2026-08-10T22:00:00",
    seats: 200,
    amount: 4999,
    image: img,
    visibility: "PUBLIC",
    approvalStatus: "APPROVED",
    creatorId: "",
    createdOn: ""
  },
  {
    id: "2",
    slug: "reception-night",
    title: "Reception Events",
    description: "Grand reception event planning.",
    startDatetime: "2026-08-15T19:00:00",
    endDatetime: "2026-08-15T23:00:00",
    seats: 150,
    amount: 3999,
    image: img,
    visibility: "PUBLIC",
    approvalStatus: "APPROVED",
    creatorId: "",
    createdOn: ""
  },
  {
    id: "3",
    slug: "engagement-ceremony",
    title: "Engagement Ceremony",
    description: "Elegant engagement ceremony setup.",
    startDatetime: "2026-08-20T17:00:00",
    endDatetime: "2026-08-20T21:00:00",
    seats: 100,
    amount: 2999,
    image: img,
    visibility: "PUBLIC",
    approvalStatus: "APPROVED",
    creatorId: "",
    createdOn: ""
  },
];
