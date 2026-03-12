'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const statsData = await res.json();
      setData(statsData);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Conversations', value: data?.stats?.totalConversations || '0', icon: MessageSquare, color: 'text-primary' },
    { label: 'Active Visitors', value: data?.stats?.activeVisitors || '0', icon: Activity, color: 'text-emerald-500' },
    { label: 'Open Chats', value: data?.stats?.openConversations || '0', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Resolved Chats', value: data?.stats?.resolvedConversations || '0', icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Real-time statistics from your Maya AI assistant.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {loading ? '...' : stat.value}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Updated just now
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Live Team Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50">
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div className="relative">
                <Users className="h-12 w-12 text-slate-200" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  {data?.stats?.onlineTeam || 0} / {data?.stats?.totalTeam || 0} Agents Online
                </p>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Your support team is currently handling active conversations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="border-t p-0">
            <div className="divide-y max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">Loading activity...</div>
              ) : !data?.recentConversations?.length ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">No recent activity</div>
              ) : data.recentConversations.map((conv) => (
                <div key={conv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-xs text-primary">
                      {conv.name[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-800 truncate">{conv.name}</span>
                      <span className="text-[10px] text-slate-500 truncate w-32">{conv.lastMessage}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] text-slate-400 font-medium">
                      {new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter",
                      conv.status === 'open' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {conv.status}
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
