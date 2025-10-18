import { useState } from "react";
import { Moon, Clock, TrendingUp, Lightbulb } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { SleepChart } from "@/components/sleep-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Sleep() {
  const [hours, setHours] = useState("");

  const handleLogSleep = () => {
    console.log("Logging sleep:", { hours });
    setHours("");
  };

  const sleepData = [
    { day: "Mon", hours: 7.5, quality: "Good" as const },
    { day: "Tue", hours: 6.2, quality: "Fair" as const },
    { day: "Wed", hours: 8.1, quality: "Excellent" as const },
    { day: "Thu", hours: 7.8, quality: "Good" as const },
    { day: "Fri", hours: 5.5, quality: "Poor" as const },
    { day: "Sat", hours: 9.2, quality: "Excellent" as const },
    { day: "Sun", hours: 8.5, quality: "Good" as const },
  ];

  const sleepTips = [
    "Maintain a consistent sleep schedule",
    "Create a relaxing bedtime routine",
    "Keep your bedroom cool and dark",
    "Limit screen time before bed",
    "Avoid caffeine in the evening",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sleep Tracking</h1>
        <p className="text-muted-foreground">Monitor your sleep patterns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Last Night"
          value="7.5h"
          icon={Moon}
          subtitle="Good quality"
          color="sleep"
        />
        <StatCard
          title="Average Sleep"
          value="7.5h"
          icon={Clock}
          subtitle="This week"
          color="primary"
        />
        <StatCard
          title="Sleep Score"
          value="85"
          icon={TrendingUp}
          subtitle="Out of 100"
          color="success"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card data-testid="card-log-sleep">
            <CardHeader>
              <CardTitle>Log Sleep</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Sleep Duration (hours)</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="Enter hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  data-testid="input-sleep-hours"
                />
              </div>
              <Button onClick={handleLogSleep} className="w-full" data-testid="button-log-sleep">
                Log Sleep
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-sleep-tips">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-chart-3" />
                <CardTitle>Sleep Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sleepTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <SleepChart data={sleepData} />
      </div>
    </div>
  );
}
