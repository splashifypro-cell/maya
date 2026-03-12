'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Lock,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin Settings</h2>
          <p className="text-slate-500">Manage your workspace configuration and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2 font-bold uppercase tracking-widest text-xs">
          {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Settings</>}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar Tabs */}
        <aside className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Global Configuration
                </CardTitle>
                <CardDescription>Basic settings for your Maya instance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue="Splashify Pro Support"
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@splashifypro.in"
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-800">Automatic Lead Collection</p>
                      <p className="text-xs text-slate-500">Mandatory collection of name and WhatsApp.</p>
                    </div>
                    <div className="h-6 w-11 bg-primary rounded-full relative p-1 cursor-pointer">
                      <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-800">Multi-language Support</p>
                      <p className="text-xs text-slate-500">Allow AI to reply in detected browser language.</p>
                    </div>
                    <div className="h-6 w-11 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                      <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Security & Access
                </CardTitle>
                <CardDescription>Control who can access the admin panel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-indigo-900 uppercase tracking-tighter">Two-Factor Authentication</p>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      Secure your admin account by requiring an additional verification code.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 text-[10px] font-bold uppercase bg-white">Enable 2FA</Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Authorized Domains (CORS)</label>
                  <textarea 
                    placeholder="agentmaya.vercel.app, splashifypro.in"
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-mono min-h-[100px]"
                  />
                  <p className="text-[10px] text-slate-400 italic">Separate multiple domains with commas.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Alert Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                <Bell className="h-12 w-12 opacity-20" />
                <p className="text-sm font-medium">Notification settings will be available soon.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
