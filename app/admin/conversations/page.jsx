'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  ArrowUp, 
  Palette, 
  MapPin, 
  Globe,
  Clock,
  User,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/admin/conversations');
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].sessionId);
      }
    } catch (err) {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const selectedChat = conversations.find(c => c.sessionId === selectedId);

  return (
    <div className="flex h-[calc(100vh-160px)] gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Left List Pane */}
      <aside className="w-[320px] bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <header className="p-4 border-b bg-slate-50/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Inbox</h3>
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">Loading inbox...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">No conversations yet</div>
          ) : conversations.map((chat) => (
            <div 
              key={chat.sessionId} 
              onClick={() => setSelectedId(chat.sessionId)}
              className={cn(
                "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group relative",
                selectedId === chat.sessionId ? "bg-slate-50 border-l-4 border-primary" : ""
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-slate-100 border flex-shrink-0 flex items-center justify-center font-bold text-primary">
                  {chat.visitor?.name?.[0] || '?'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {chat.visitor?.name || `Visitor #${chat.sessionId.slice(-4)}`}
                  </span>
                  <span className="text-xs text-slate-500 truncate w-40">
                    {chat.messages[chat.messages.length - 1]?.content || 'New conversation'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[9px] text-slate-400 font-medium">
                  {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter",
                  chat.status === 'open' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}>
                  {chat.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Chat Window Pane */}
      <main className="flex-1 bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
            <MessageSquare className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium tracking-tight">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-xl text-primary">
                  {selectedChat.visitor?.name?.[0] || '?'}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {selectedChat.visitor?.name || 'Anonymous Visitor'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                      <Globe className="h-3 w-3" /> {selectedChat.metadata?.country || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider border-l pl-3">
                      <Clock className="h-3 w-3" /> Active {new Date(selectedChat.lastActive).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border">
                  User Details
                </button>
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors shadow-md shadow-emerald-200 border border-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto space-y-6">
              {selectedChat.messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "" : "ml-auto flex-row-reverse"
                )}>
                  <div className={cn(
                    "h-8 w-8 rounded-full border flex-shrink-0 flex items-center justify-center shadow-sm",
                    msg.role === 'user' ? "bg-white" : "bg-primary"
                  )}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-slate-400" /> : <MessageSquare className="h-4 w-4 text-white fill-white" />}
                  </div>
                  <div className={cn(
                    "flex flex-col gap-1.5",
                    msg.role === 'user' ? "" : "items-end"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-white border rounded-tl-none text-slate-800" 
                        : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.role !== 'user' && " • Agent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <footer className="p-4 bg-white border-t">
              <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-100 focus-within:border-primary transition-all shadow-inner">
                <textarea 
                  placeholder="Type your reply here..." 
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm min-h-[44px] max-h-[120px] py-1 text-slate-800"
                  rows={1}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="flex items-center gap-2 pb-1 flex-shrink-0">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <Palette className="h-5 w-5" />
                  </button>
                  <button 
                    disabled={!reply.trim()}
                    className="px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group disabled:opacity-50 disabled:shadow-none"
                  >
                    Send <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Enter to send • Shift + Enter for new line</span>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
