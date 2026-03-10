"use client";
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  Users,
  IndianRupee,
  Eye,
  ShieldCheck,
  Hash,
  UserCircle,
  Link as LinkIcon,
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function approvalVariant(status: string) {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    default:
      return "secondary";
  }
}

function visibilityVariant(visibility: string) {
  return visibility === "PUBLIC" ? "default" : "outline";
}

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">

        <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg bg-muted">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={approvalVariant(event.approvalStatus)}>
              {event.approvalStatus}
            </Badge>
            <Badge variant={visibilityVariant(event.visibility)}>
              {event.visibility === "PUBLIC" ? (
                <Eye className="mr-1 h-3 w-3" />
              ) : null}
              {event.visibility}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        <Separator />


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem
            icon={<Hash className="h-4 w-4" />}
            label="Event ID"
            value={event.id}
          />

          <DetailItem
            icon={<LinkIcon className="h-4 w-4" />}
            label="Slug"
            value={event.slug}
          />
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Created On"
            value={formatDate(event.createdOn)}
          />
          <DetailItem
            icon={<Clock className="h-4 w-4" />}
            label="Start"
            value={formatDateTime(event.startDatetime)}
          />
          <DetailItem
            icon={<Clock className="h-4 w-4" />}
            label="End"
            value={formatDateTime(event.endDatetime)}
          />
          <DetailItem
            icon={<Users className="h-4 w-4" />}
            label="Seats"
            value={String(event.seats)}
          />
          <DetailItem
            icon={<IndianRupee className="h-4 w-4" />}
            label="Amount"
            value={`₹${event.amount.toLocaleString("en-IN")}`}
          />
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Approval Status"
            value={event.approvalStatus}
          />
          <DetailItem
            icon={<Eye className="h-4 w-4" />}
            label="Visibility"
            value={event.visibility}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
