import { useState } from "react";
import { Footprints, Flame, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Exercise() {
  const [steps, setSteps] = useState("");
  const [duration, setDuration] = useState("");

  const handleLogActivity = () => {
    console.log("Logging activity:", { steps, duration });
    setSteps("");
    setDuration("");
  };

  const recentActivities = [
    { date: "Today", steps: 8543, duration: "45 min", calories: 320 },
    { date: "Yesterday", steps: 12034, duration: "62 min", calories: 450 },
    { date: "2 days ago", steps: 7821, duration: "38 min", calories: 290 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise Tracking</h1>
        <p className="text-muted-foreground">Monitor your daily physical activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Today's Steps"
          value="8,543"
          icon={Footprints}
          subtitle="Goal: 10,000"
          trend="up"
          trendValue="12%"
          color="success"
        />
        <StatCard
          title="Calories Burned"
          value="320"
          icon={Flame}
          subtitle="From exercise"
          color="nutrition"
        />
        <StatCard
          title="Active Time"
          value="45 min"
          icon={Clock}
          subtitle="Today"
          color="primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-log-activity">
          <CardHeader>
            <CardTitle>Log Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="steps">Steps</Label>
              <Input
                id="steps"
                type="number"
                placeholder="Enter steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                data-testid="input-steps"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                data-testid="input-duration"
              />
            </div>
            <Button onClick={handleLogActivity} className="w-full" data-testid="button-log-activity">
              Log Activity
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-activity-history">
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{activity.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.steps.toLocaleString()} steps · {activity.duration}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    <Flame className="h-3 w-3 mr-1" />
                    {activity.calories} cal
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
