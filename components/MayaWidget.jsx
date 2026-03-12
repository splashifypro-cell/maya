
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, X, Minus, MessageCircle, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('maya_session');
  if (!sid) {
    sid = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('maya_session', sid);
  }
  return sid;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline break-all">$1</a>')
    .replace(/\n/g, '<br/>');
}

export default function MayaWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const sessionId = useRef('');

  useEffect(() => { 
    sessionId.current = getSessionId(); 
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, loading]);

  const openWidget = useCallback(() => {
    setOpen(true);
    setShowTooltip(false);
    if (!everOpened) {
      setEverOpened(true);
      setMessages([{
        role: 'assistant',
        content: "Hey 👋 Welcome to Splashify Pro!\n\nI'm Maya, your AI assistant. I can help you with **pricing**, **onboarding**, **booking a demo**, or **technical support**.\n\nTo best assist you, could I please get your name, email address, and WhatsApp number?",
        id: Date.now(),
      }]);
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [everOpened]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now() }]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = '36px';
    }
    setLoading(true);
    abortRef.current = new AbortController();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, message: text }),
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, id: Date.now() }]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.', id: Date.now() }]);
      }
    } finally { setLoading(false); abortRef.current = null; }
  }, [input, loading]);

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans antialiased">
      {/* Tooltip */}
      {!open && (showTooltip || everOpened) && (
        <div 
          onClick={openWidget} 
          className="flex items-center gap-3 bg-background border rounded-xl p-3 cursor-pointer shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 min-w-[240px]"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src="/maya-avatar.png" alt="Maya" />
            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Maya</span>
            <span className="text-[10px] text-primary font-medium uppercase tracking-wider">Splashify Pro Support</span>
          </div>
          <X className="h-3 w-3 ml-auto text-muted-foreground" />
        </div>
      )}

      {/* Chat Panel */}
      {open && (
        <Card className="w-[380px] h-[600px] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-200 origin-bottom-right">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex-row items-center gap-3 space-y-0">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src="/maya-avatar.png" alt="Maya" />
              <AvatarFallback className="bg-white/20 text-white"><Bot className="h-6 w-6" /></AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base font-bold">Maya</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                {loading ? (
                  <div className="flex gap-1">
                    <span className="h-1 w-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1 w-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1 w-1 bg-white/80 rounded-full animate-bounce" />
                    <span className="text-[10px] ml-1 font-medium text-white/90">Thinking...</span>
                  </div>
                ) : (
                  <>
                    <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium text-white/90">Online</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {loading && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => abortRef.current?.abort()}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setOpen(false)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 bg-slate-50/50 min-h-0 relative">
            <ScrollArea ref={scrollAreaRef} className="h-full w-full p-4">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                    <Avatar className="h-8 w-8 mt-1 shrink-0">
                      {msg.role === 'user' ? (
                        <AvatarFallback className="bg-slate-200 text-slate-600"><User className="h-4 w-4" /></AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src="/maya-avatar.png" alt="Maya" />
                          <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white border rounded-tl-none"
                    )}>
                      <div dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-2 max-w-[85%] mr-auto">
                    <Avatar className="h-8 w-8 mt-1 shrink-0">
                      <AvatarImage src="/maya-avatar.png" alt="Maya" />
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-2xl bg-white border rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 bg-white border-t flex flex-col gap-2">
            <div className="w-full flex items-end gap-2 group">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary resize-none min-h-[36px] max-h-[120px] outline-none"
              />
              <Button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()} 
                size="icon" 
                className={cn(
                  "h-8 w-8 shrink-0 rounded-lg transition-all duration-200",
                  input.trim() ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-400"
                )}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-1 px-1">
              <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Powered by Sarvam AI</span>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* FAB */}
      <Button 
        onClick={open ? () => setOpen(false) : openWidget} 
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300 transform",
          open ? "rotate-90 scale-90" : "hover:scale-110 active:scale-95"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
