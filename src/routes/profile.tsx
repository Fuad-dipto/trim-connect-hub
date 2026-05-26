import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { ChevronRight, Heart, CreditCard, MapPin, Bell, HelpCircle, LogOut, Store, Moon } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const items = [
    { icon: Heart, label: "Favorite salons" },
    { icon: CreditCard, label: "Payment methods" },
    { icon: MapPin, label: "Saved addresses" },
    { icon: Bell, label: "Notifications" },
    { icon: Moon, label: "Dark mode", toggle: true },
    { icon: HelpCircle, label: "Help & support" },
  ];

  return (
    <MobileShell>
      <PageHeader title="Profile" />
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 flex items-center gap-3">
          <Avatar hue={285} name="Anika R" size={56}/>
          <div className="flex-1">
            <p className="font-bold">Anika Rahman</p>
            <p className="text-xs opacity-90">+880 1712 345 678</p>
          </div>
          <button className="text-xs underline">Edit</button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["12", "Bookings"], ["4", "Favorites"], ["4.8", "Rating"]].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-card border border-border p-3 text-center">
              <p className="font-bold text-lg">{v}</p>
              <p className="text-[11px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <Link to="/owner" className="mt-4 block rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
          <Store className="h-5 w-5 text-primary"/>
          <div className="flex-1">
            <p className="font-semibold text-sm">Own a salon?</p>
            <p className="text-xs text-muted-foreground">Switch to owner dashboard</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground"/>
        </Link>

        <ul className="mt-4 rounded-2xl bg-card border border-border overflow-hidden">
          {items.map(({ icon: Icon, label, toggle }) => (
            <li key={label}>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 border-b border-border last:border-0">
                <Icon className="h-4 w-4 text-muted-foreground"/>
                <span className="flex-1 text-sm text-left">{label}</span>
                {toggle ? (
                  <span className="h-5 w-9 rounded-full bg-muted flex items-center px-0.5">
                    <span className="h-4 w-4 rounded-full bg-card shadow"/>
                  </span>
                ) : <ChevronRight className="h-4 w-4 text-muted-foreground"/>}
              </button>
            </li>
          ))}
        </ul>

        <button className="mt-4 w-full rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4"/> Sign out
        </button>
      </div>
    </MobileShell>
  );
}