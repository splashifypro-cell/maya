'use client';

import { useState } from 'react';
import { 
  Palette, 
  Code, 
  Eye, 
  Copy, 
  Check, 
  Layout, 
  MessageSquare,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminWidget() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    primaryColor: '#2563eb',
    botName: 'Maya',
    welcomeMessage: "Hey 👋 Welcome to Splashify Pro!\n\nI'm Maya, your AI assistant. I can help you with pricing, onboarding, booking a demo, or technical support.",
    position: 'right',
    showOnMobile: true
  });

  const embedCode = `<!-- Maya AI Chat Widget -->\n<script src="https://agentmaya.vercel.app/widget.js" defer></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // In a real app, this would save to MongoDB
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Widget Customization</h2>
          <p className="text-slate-500">Configure how Maya appears and behaves on your website.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 font-bold uppercase tracking-widest text-xs">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar Tabs */}
        <aside className="w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('appearance')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
              activeTab === 'appearance' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Palette className="h-4 w-4" /> Appearance
          </button>
          <button 
            onClick={() => setActiveTab('installation')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
              activeTab === 'installation' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Code className="h-4 w-4" /> Installation
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-6">
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Layout className="h-4 w-4" /> Design Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Brand Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="h-10 w-20 p-1 rounded border cursor-pointer bg-white"
                      />
                      <span className="text-sm font-mono text-slate-600">{settings.primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Assistant Name</label>
                    <input 
                      type="text" 
                      value={settings.botName}
                      onChange={(e) => setSettings({...settings, botName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Welcome Message</label>
                    <textarea 
                      rows={4}
                      value={settings.welcomeMessage}
                      onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 bg-slate-100 rounded-b-xl flex items-center justify-center relative min-h-[400px]">
                  <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(white,transparent)] pointer-events-none" />
                  
                  {/* Mock Widget Preview */}
                  <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 scale-75 origin-bottom-right opacity-80 pointer-events-none">
                    <div className="bg-white border rounded-xl p-4 shadow-2xl w-[300px] flex flex-col gap-3">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center" style={{ backgroundColor: settings.primaryColor }}>
                          <MessageSquare className="h-4 w-4 text-white fill-white" />
                        </div>
                        <span className="font-bold text-sm">{settings.botName}</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-xs leading-relaxed text-slate-600">
                        {settings.welcomeMessage}
                      </div>
                    </div>
                    <div className="h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-white" style={{ backgroundColor: settings.primaryColor }}>
                      <MessageSquare className="h-7 w-7 fill-white" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter italic">Preview only • Interactive on website</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'installation' && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Code className="h-4 w-4" /> Embed Code
                </CardTitle>
                <CardDescription>Copy and paste this code into your website's HTML before the closing &lt;/body&gt; tag.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative group">
                  <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                    <code>{embedCode}</code>
                  </pre>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 gap-2 font-bold uppercase tracking-tighter text-[10px]"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Code className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-900 uppercase tracking-tighter">Pro Tip</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      You can test your installation immediately by visiting your <a href="/maya-widget-test.html" target="_blank" className="underline font-bold">test environment page</a>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
