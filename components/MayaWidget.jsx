
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, X, Minus, MessageCircle, Bot, User } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
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
  }, [messages, loading, uploading]);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 1500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 6500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PNG, JPG, PDF, and TIFF are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setStatusMessage('Initialising job...');
    setMessages(prev => [...prev, { role: 'user', content: `📎 Uploading file: ${file.name}`, id: Date.now() }]);

    try {
      const initRes = await fetch('/api/sarvam/initialise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'en-IN', output_format: 'md' }),
      });
      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.details || initData.error || 'Failed to initialise job');
      const { job_id } = initData;

      setStatusMessage('Getting upload link...');
      const uploadLinkRes = await fetch('/api/sarvam/get-upload-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id, filename: file.name }),
      });
      const uploadLinkData = await uploadLinkRes.json();
      if (!uploadLinkRes.ok) throw new Error(uploadLinkData.details || uploadLinkData.error || 'Failed to get upload link');
      
      const uploadUrl = uploadLinkData.upload_urls?.[file.name]?.url;
      if (!uploadUrl) throw new Error('Failed to get upload link');

      setStatusMessage('Uploading file...');
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => (xhr.status === 200 || xhr.status === 201) ? resolve() : reject(new Error('Upload failed'));
        xhr.onerror = () => reject(new Error('Upload error'));
      });
      xhr.send(file);
      await uploadPromise;

      setStatusMessage('Starting processing...');
      const startRes = await fetch('/api/sarvam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id }),
      });
      if (!startRes.ok) {
        const startData = await startRes.json();
        throw new Error(startData.details || startData.error || 'Failed to start job');
      }

      setStatusMessage('Processing document...');
      let statusData;
      let attempts = 0;
      const maxAttempts = 60; 
      while (attempts < maxAttempts) {
        const statusRes = await fetch(`/api/sarvam/status?job_id=${job_id}`);
        statusData = await statusRes.json();
        if (statusData.job_state === 'Completed' || statusData.job_state === 'PartiallyCompleted') break;
        if (statusData.job_state === 'Failed') throw new Error('Processing failed');
        attempts++;
        await new Promise(r => setTimeout(r, 2000));
      }

      if (attempts === maxAttempts) throw new Error('Processing timeout');

      setStatusMessage('Downloading result...');
      const downloadRes = await fetch(`/api/sarvam/download-links?job_id=${job_id}`);
      const downloadData = await downloadRes.json();
      if (!downloadRes.ok) throw new Error(downloadData.details || downloadData.error || 'Failed to get download links');
      
      const firstFile = Object.keys(downloadData.download_urls)[0];
      const downloadUrl = downloadData.download_urls[firstFile]?.url;

      if (!downloadUrl) throw new Error('Failed to get download link');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Document processing complete! You can download the extracted text here: [Download Results](${downloadUrl})\n\n*(Powered by Sarvam)*`,
        id: Date.now()
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error processing document: ${err.message}`, id: Date.now() }]);
    } finally {
      setUploading(false);
      setStatusMessage('');
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

          <CardContent className="flex-1 p-0 bg-slate-50/50">
            <ScrollArea ref={scrollAreaRef} className="h-full p-4">
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

                {uploading && (
                  <div className="flex gap-2 max-w-[85%] mr-auto">
                    <Avatar className="h-8 w-8 mt-1 shrink-0">
                      <AvatarImage src="/maya-avatar.png" alt="Maya" />
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <Card className="w-full max-w-[240px] p-3 border shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-primary uppercase">{statusMessage}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1.5" />
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 bg-white border-t flex flex-col gap-2">
            <div 
              className="w-full flex items-end gap-2 group"
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files && files.length > 0) handleFileUpload({ target: { files } });
              }}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".png,.jpg,.jpeg,.pdf,.tiff" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || loading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
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
                disabled={loading || uploading || !input.trim()} 
                size="icon" 
                className="h-9 w-9 shrink-0 rounded-full shadow-md"
              >
                <Send className="h-4 w-4" />
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
