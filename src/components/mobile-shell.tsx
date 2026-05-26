import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, MessageCircle, User, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="mx-auto max-w-md min-h-screen bg-background shadow-2xl shadow-primary/5 relative pb-20">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}

function BottomNav() {
  const { location } = useRouterState();
  const items = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/bookings", icon: Calendar, label: "Bookings" },
    { to: "/chats", icon: MessageCircle, label: "Chats" },
    { to: "/owner", icon: Store, label: "Owner" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-border bg-background/95 backdrop-blur z-40">
      <ul className="grid grid-cols-5 px-2 py-2">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== "/home" && location.pathname.startsWith(to));
          return (
            <li key={to}>
              <Link to={to} className={cn(
                "flex flex-col items-center gap-1 py-1.5 rounded-xl text-[10px] font-medium transition",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_currentColor]")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PageHeader({ title, subtitle, right, back }: {
  title: string; subtitle?: string; right?: React.ReactNode; back?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
      {back && (
        <button onClick={back} aria-label="Back" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/70">
          ←
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-base truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}