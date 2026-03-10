import {
  Users,
  CalendarCheck,
  MapPin,
  Bell,
  Ticket,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "Easy Event Creation",
    description: "Organizers can create and manage events in minutes.",
    icon: CalendarCheck,
  },
  {
    title: "Online Registration",
    description: "Attendees can register quickly from any device.",
    icon: Ticket,
  },
  {
    title: "Venue Management",
    description: "Manage locations, seating capacity and logistics.",
    icon: MapPin,
  },
  {
    title: "Real-Time Notifications",
    description: "Send confirmation emails and event reminders.",
    icon: Bell,
  },
  {
    title: "Attendee Management",
    description: "Track participants, registrations and attendance.",
    icon: Users,
  },
  {
    title: "Analytics & Reports",
    description: "Generate event insights and performance reports.",
    icon: BarChart3,
  },
  {
    title: "Smart Event Planning",
    description: "Get recommendations and tools to plan better events.",
    icon: Lightbulb,
  },
  {
    title: "Secure Platform",
    description: "Protected registrations and reliable data security.",
    icon: ShieldCheck,
  },
];
