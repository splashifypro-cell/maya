import { 
  Users, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total Conversations', value: '1,284', icon: MessageSquare, trend: '+12.5%' },
  { label: 'Active Visitors', value: '42', icon: Users, trend: '+4.2%' },
  { label: 'Avg. Response Time', value: '1m 45s', icon: Clock, trend: '-15%' },
  { label: 'CSAT Score', value: '4.8/5', icon: TrendingUp, trend: '+2%' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className={cn(
                "text-xs font-medium mt-1",
                stat.trend.startsWith('+') ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.trend} <span className="text-slate-400 font-normal">from last week</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Real-time Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Activity className="h-8 w-8 animate-pulse" />
              <p className="text-sm">Live chart integration coming soon...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent className="border-t p-0">
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">User #{1000 + i}</span>
                      <span className="text-xs text-slate-500 truncate w-32">How do I upgrade...</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-400">2m ago</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tighter">
                      Open
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Re-importing cn since it's used in the template
import { cn } from '@/lib/utils';
