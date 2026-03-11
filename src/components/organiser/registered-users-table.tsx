"use client";

import { useEffect, useState } from "react";
import { RegisteredUser } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface RegisteredUsersTableProps {
  users: RegisteredUser[];
}

export function RegisteredUsersTable({ users: initialUsers }: RegisteredUsersTableProps) {
  const [users, setUsers] = useState<RegisteredUser[]>(initialUsers);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  async function handleToggleAttendance(userId: string, nextAttendance: boolean) {
    const target = users.find((user) => user.id === userId);
    if (!target?.registrationId) {
      setError("Registration ID missing for this user.");
      return;
    }

    const registrationId = target.registrationId;

    try {
      setError("");
      setUpdatingIds((prev) => ({ ...prev, [registrationId]: true }));

      const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/register/${registrationId}/attendance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendance: nextAttendance }),
      });

      if (!response.ok) {
        setError("Failed to update attendance.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, approved: nextAttendance } : u,
        ),
      );
    } catch {
      setError("Failed to update attendance.");
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [registrationId]: false }));
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">
            Registered Users ({users.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
        {users.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No users registered for this event yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {user.id}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={user.approved ? "default" : "secondary"}
                      >
                        {user.approved ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={user.approved}
                        disabled={Boolean(user.registrationId && updatingIds[user.registrationId]) || !user.registrationId}
                        onCheckedChange={(checked) => handleToggleAttendance(user.id, checked)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
