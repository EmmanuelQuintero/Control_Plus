import { Users, Activity, TrendingUp, Bell } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { UserListTable } from "@/components/user-list-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            setUsersCount(data.usersCount);
          } else {
            toast({ title: 'Error', description: data.message || 'No se pudieron cargar las estadísticas', variant: 'destructive' });
          }
        }
      } catch (e) {
        if (!cancelled) {
          toast({ title: 'Error', description: 'Error al conectar con el servidor', variant: 'destructive' });
        }
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    };
    loadStats();
    return () => { cancelled = true; };
  }, [toast]);
  const users = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      lastActive: "2 hours ago",
      status: "active" as const,
      steps: 8543,
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      lastActive: "1 day ago",
      status: "inactive" as const,
      steps: 3421,
    },
    {
      id: "3",
      name: "Carol White",
      email: "carol@example.com",
      lastActive: "30 min ago",
      status: "active" as const,
      steps: 12034,
    },
    {
      id: "4",
      name: "David Brown",
      email: "david@example.com",
      lastActive: "5 hours ago",
      status: "active" as const,
      steps: 7231,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage user activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Users"
          value={loadingStats ? '…' : (usersCount ?? 0).toString()}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Active Users"
          value="856"
          icon={Activity}
          subtitle="Last 7 days"
          color="success"
        />
        <StatCard
          title="Inactive Users"
          value="378"
          icon={TrendingUp}
          subtitle="Need engagement"
          color="nutrition"
        />
        <StatCard
          title="Notifications Sent"
          value="142"
          icon={Bell}
          subtitle="This week"
          color="sleep"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <UserListTable />
      </div>

      <Card data-testid="card-engagement-stats">
        <CardHeader>
          <CardTitle>User Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart visualization placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
