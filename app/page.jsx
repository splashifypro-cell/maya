
import MayaWidget from '@/components/MayaWidget';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 text-center space-y-6 max-w-2xl">
        <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-2">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">AI-Powered Platform</span>
        </div>
        
        <h1 className="text-6xl font-black text-white tracking-tight sm:text-7xl">
          Splashify <span className="text-primary">Pro</span>
        </h1>
        
        <p className="text-xl text-slate-400 font-medium leading-relaxed">
          The next generation WhatsApp API platform for businesses.
          Transform your customer interactions with <span className="text-white">Maya AI</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          {[
            { label: 'Automated Support', desc: '24/7 AI assistance' },
            { label: 'Smart Workflows', desc: 'Streamline operations' },
            { label: 'Rich Analytics', desc: 'Data-driven insights' }
          ].map((item, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-white mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Maya floating widget */}
      <MayaWidget />
    </main>
  );
}
