import { Activity, Footprints, Apple, Moon, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ProgressRing } from "@/components/progress-ring";
import { ActivityLog } from "@/components/activity-log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const activities = [
    {
      id: "1",
      type: "Morning Run",
      description: "5.2 km in 32 minutes",
      time: "8:30 AM",
      icon: Activity,
      color: "success" as const,
    },
    {
      id: "2",
      type: "Breakfast",
      description: "Oatmeal with berries - 350 cal",
      time: "9:15 AM",
      icon: Apple,
      color: "nutrition" as const,
    },
    {
      id: "3",
      type: "Sleep",
      description: "7.5 hours - Good quality",
      time: "Last night",
      icon: Moon,
      color: "sleep" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your wellness journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily Steps"
          value="8,543"
          icon={Footprints}
          subtitle="Goal: 10,000"
          trend="up"
          trendValue="12% from yesterday"
          color="success"
        />
        <StatCard
          title="Calories"
          value="1,847"
          icon={Apple}
          subtitle="Goal: 2,000"
          color="nutrition"
        />
        <StatCard
          title="Sleep Hours"
          value="7.5h"
          icon={Moon}
          subtitle="Goal: 8h"
          color="sleep"
        />
        <StatCard
          title="Active Days"
          value="23"
          icon={TrendingUp}
          subtitle="This month"
          color="primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-goals-progress">
          <CardHeader>
            <CardTitle>Today's Goals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <ProgressRing progress={68} size={180}>
              <div className="text-center">
                <div className="text-4xl font-bold">68%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </ProgressRing>
          </CardContent>
        </Card>

        <ActivityLog activities={activities} />
      </div>
    </div>
  );
}
