"use client";

import { useState } from "react";
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

  function handleToggleApproval(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, approved: !u.approved } : u
      )
    );
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
                  <TableHead className="text-center">Approval</TableHead>
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
                        {user.approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={user.approved}
                        onCheckedChange={() => handleToggleApproval(user.id)}
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
