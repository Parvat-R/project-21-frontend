import { StaticImageData } from "next/image";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type Visibility = "INTERNAL" | "PUBLIC";

export interface Event {
  id: string;
  creatorId: string;
  slug: string;
  title: string;
  description: string;
  approvalStatus: ApprovalStatus;
  createdOn: string;
  startDatetime: string;
  endDatetime: string;
  image?: string | StaticImageData;
  imageUrl?: string;
  seats: number;
  amount: number;
  visibility: Visibility;
}

export interface RegisteredUser {
  id: string;
  email: string;
  approved: boolean;
  registrationId?: string;
}
