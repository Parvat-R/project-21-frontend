"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EventFilterBannerProps {
  value: string;
  onChange: (val: string) => void;
}

export function EventFilterBanner({ value, onChange }: EventFilterBannerProps) {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="bg-gray-100 rounded-md shadow p-4 w-full max-w-2xl flex items-center justify-between">
        <h2 className="text-lg font-semibold">Events</h2>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
