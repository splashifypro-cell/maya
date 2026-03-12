export default function AdminConversations() {
  return (
    <div className="flex h-[calc(100vh-160px)] gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Left List Pane */}
      <aside className="w-[320px] bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <header className="p-4 border-b bg-slate-50/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Inbox</h3>
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">12</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full text-xs px-3 py-2 bg-white border rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={cn(
              "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group",
              i === 1 ? "bg-slate-50 border-l-4 border-primary" : ""
            )}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-slate-200 border flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate">Visitor #{5420 + i}</span>
                  <span className="text-xs text-slate-500 truncate w-40 italic">Waiting for response...</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-slate-400">12:45 PM</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-tighter">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Chat Window Pane */}
      <main className="flex-1 bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        {/* Chat Header */}
        <header className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200 border" />
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-900 leading-tight">Visitor #5421</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-500 font-medium tracking-tight">Active now • Mumbai, India</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border">
              View Profile
            </button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors shadow-md shadow-emerald-200 border border-emerald-600">
              Resolve
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col items-center justify-center py-4">
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              March 12, 2026
            </span>
          </div>

          <div className="flex gap-4 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-slate-200 border flex-shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="p-4 rounded-2xl bg-white border rounded-tl-none shadow-sm text-sm leading-relaxed text-slate-800">
                Hi there! I'm interested in the **Growth Plan**. Can you tell me more about the features?
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1">12:40 PM</span>
            </div>
          </div>

          <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
            <div className="h-8 w-8 rounded-full bg-primary border flex-shrink-0 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white fill-white" />
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <div className="p-4 rounded-2xl bg-primary text-primary-foreground rounded-tr-none shadow-md text-sm leading-relaxed">
                Hello! Absolutely. The **Growth Plan** is perfect for scaling businesses. It includes:
                <br/>• 24/7 AI Assistance
                <br/>• Smart Workflows
                <br/>• Rich Analytics
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1 text-right">12:42 PM • Sent by Agent</span>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <footer className="p-4 bg-white border-t">
          <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-100 focus-within:border-primary transition-all">
            <textarea 
              placeholder="Type your reply here..." 
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm min-h-[44px] max-h-[120px] py-1 text-slate-800"
              rows={1}
            />
            <div className="flex items-center gap-2 pb-1 flex-shrink-0">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <Palette className="h-5 w-5" />
              </button>
              <button className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
                Send <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 mt-3">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Enter to send • Shift + Enter for new line</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Palette, ArrowUp, MessageSquare } from 'lucide-react';
