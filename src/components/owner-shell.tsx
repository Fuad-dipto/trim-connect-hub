import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Scissors, CalendarDays, Settings, Bell,
  Search, Moon, Sun, LogOut, UserCircle2, ChevronDown,
} from "lucide-react";
import { Brand, Avatar } from "@/components/brand";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavItem = { to: string; icon: typeof LayoutDashboard; label: string; exact?: boolean };
const nav: NavItem[] = [
  { to: "/owner", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/owner/barbers", icon: Users, label: "Employees" },
  { to: "/owner/services", icon: Scissors, label: "Services" },
  { to: "/owner/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/owner/settings", icon: Settings, label: "Salon profile" },
];

export function OwnerShell({ title, subtitle, action, children }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  const { location } = useRouterState();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-7xl flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col gap-1 p-4 border-r border-border bg-card min-h-screen sticky top-0">
          <div className="px-2 py-3"><Brand /></div>
          <div className="px-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Salon owner</span>
          </div>
          <nav className="flex-1 space-y-1">
            {nav.map((n) => {
              const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to as any} className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition",
                  active
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                  <n.icon className="h-4 w-4"/> {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 rounded-xl border border-border bg-gradient-to-br from-secondary/80 to-accent/10 p-3 flex items-center gap-2">
            <Avatar hue={75} name="Anwar Hossain" size={36}/>
            <div className="text-xs min-w-0 flex-1">
              <p className="font-semibold truncate">Anwar Hossain</p>
              <p className="text-muted-foreground truncate">Owner · Luxe Cuts</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 md:px-8 py-3 flex items-center justify-between gap-3">
            <div className="md:hidden"><Brand size="sm"/></div>
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input
                  placeholder="Search employees, services, bookings…"
                  className="h-10 w-full rounded-xl bg-secondary/70 border border-transparent focus:border-accent focus:bg-background outline-none pl-9 pr-3 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {action}
              <button
                onClick={() => setDark((d) => !d)}
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/70"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
              </button>
              <button className="relative h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/70">
                <Bell className="h-4 w-4"/>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse"/>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full hover:bg-secondary p-1 pr-2">
                  <Avatar hue={75} name="Anwar Hossain" size={28}/>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-semibold">Anwar Hossain</p>
                    <p className="text-xs text-muted-foreground font-normal">owner@luxecuts.bd</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link to="/owner/settings"><UserCircle2 className="h-4 w-4 mr-2"/>Salon profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/owner/settings"><Settings className="h-4 w-4 mr-2"/>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link to="/"><LogOut className="h-4 w-4 mr-2"/>Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="px-4 md:px-8 pt-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>

          <div className="md:hidden border-b border-border bg-card/80 overflow-x-auto mt-3">
            <div className="flex gap-1 p-2 min-w-max">
              {nav.map((n) => {
                const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
                return (
                  <Link key={n.to} to={n.to as any} className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap",
                    active ? "bg-foreground text-background font-semibold" : "text-muted-foreground"
                  )}>
                    <n.icon className="h-3.5 w-3.5"/> {n.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 md:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}