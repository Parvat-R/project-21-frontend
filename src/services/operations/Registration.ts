import { registrationEndpoints } from "../api";

const { REGISTER_FOR_EVENT, GET_USER_REGISTRATIONS } = registrationEndpoints;

/** Register the current user for an event. Returns { acknowledgement, message, registrationId? } */
export async function registerForEvent(
  eventId: string,
  userId: string,
  token: string,
): Promise<{ acknowledgement: boolean; message: string; registrationId?: string }> {
  const res = await fetch(REGISTER_FOR_EVENT(eventId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
    credentials: "include",
  });

  const data = await res.json();
  return data;
}

export interface UserRegistration {
  id: string;          // registrationId
  eventId: string;
  userId: string;
  createdAt?: string;
  feedback?: {
    id: string;
    description: string;
    stars: number;
  } | null;
}

/**
 * Fetch all registrations for a user.
 * Returns an empty array if the user has no registrations (404 is treated as empty).
 */
export async function getUserRegistrations(
  userId: string,
  token: string,
): Promise<UserRegistration[]> {
  const res = await fetch(GET_USER_REGISTRATIONS(userId), {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 404) return [];
  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
