import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventStatCardProps {
  category: string;
  count: number;
  comparison: string;
  color: "yellow" | "blue" | "green" | "red";
  icon: React.ReactNode;
}

const colorMap: Record<EventStatCardProps["color"], string> = {
  yellow: "bg-yellow-100 text-yellow-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
};

export function EventStatCard({
  category,
  count,
  comparison,
  color,
  icon,
}: EventStatCardProps) {
  return (
    <Card className={cn("w-full", colorMap[color])}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{category}</CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm">{comparison}</div>
      </CardContent>
    </Card>
  );
}
