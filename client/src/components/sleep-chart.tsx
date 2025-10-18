import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SleepData {
  day: string;
  hours: number;
  quality: "Poor" | "Fair" | "Good" | "Excellent";
}

interface SleepChartProps {
  data: SleepData[];
}

export function SleepChart({ data }: SleepChartProps) {
  const maxHours = 10;
  
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent":
        return "bg-chart-1";
      case "Good":
        return "bg-chart-2";
      case "Fair":
        return "bg-chart-3";
      case "Poor":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card data-testid="card-sleep-chart">
      <CardHeader>
        <CardTitle>Sleep Pattern</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.day}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.hours}h</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.quality}
                  </Badge>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getQualityColor(item.quality)}`}
                  style={{ width: `${(item.hours / maxHours) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
