'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  Palette,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Conversations', icon: MessageSquare, href: '/admin/conversations' },
  { label: 'Team', icon: Users, href: '/admin/team' },
  { label: 'Widget Settings', icon: Palette, href: '/admin/widget' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show sidebar/header on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Maya Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-primary"
              )}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-slate-600 hover:text-destructive"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-semibold text-lg text-slate-800">
            {navItems.find(item => item.href === pathname)?.label || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-right">
              <span className="text-sm font-medium">{session?.user?.name || 'Admin User'}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                {session?.user?.role || 'Super Admin'}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-primary shadow-sm">
              {session?.user?.name?.[0] || 'A'}
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
