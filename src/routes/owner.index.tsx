import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Users, Calendar, DollarSign, Star, Plus, Scissors } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { Avatar } from "@/components/brand";
import { ownerStats, recentBookings, earningsTrend } from "@/lib/mock-data";
import { useOwnerStore } from "@/lib/owner-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/")({ component: Dashboard });

function Dashboard() {
  const employees = useOwnerStore((s) => s.employees);
  const services = useOwnerStore((s) => s.services);
  const profile = useOwnerStore((s) => s.profile);
  const activeCount = employees.filter((e) => e.status !== "offline").length;

  return (
    <OwnerShell
      title="Good morning, Anwar"
      subtitle={`Here's what's happening at ${profile.name} today`}
      action={
        <Button size="sm" className="rounded-lg" asChild>
          <Link to="/owner/barbers"><Plus className="h-4 w-4 mr-1"/>Quick add</Link>
        </Button>
      }
    >
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={<DollarSign className="h-4 w-4"/>} label="Today's earnings" value={`${ownerStats.todayEarnings.toLocaleString()}৳`} trend="+12.4%" tone="primary"/>
        <KPI icon={<Calendar className="h-4 w-4"/>} label="Today's bookings" value={ownerStats.todayBookings} trend="+5"/>
        <KPI icon={<Users className="h-4 w-4"/>} label="Active employees" value={`${activeCount} / ${employees.length}`} trend={`${services.length} services`}/>
        <KPI icon={<Star className="h-4 w-4"/>} label="Avg rating" value={ownerStats.rating} trend="+0.1 this wk"/>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Earnings chart */}
        <section className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Weekly earnings</h2>
              <p className="text-xs text-muted-foreground">Total this week: <span className="font-semibold text-foreground">{earningsTrend.reduce((a,b)=>a+b.value,0).toLocaleString()}৳</span></p>
            </div>
            <span className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="h-3 w-3"/>+18% vs last week</span>
          </div>
          <Chart/>
        </section>

        {/* Queue */}
        <section className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Live queue</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>Live</span>
          </div>
          <p className="text-3xl font-bold">{ownerStats.queueNow}<span className="text-sm text-muted-foreground font-normal"> in queue</span></p>
          <ul className="mt-3 space-y-2">
            {employees.slice(0, 5).map((b, i) => (
              <li key={b.id} className="flex items-center gap-2">
                <Avatar hue={b.hue} name={b.name} src={b.photo} size={28}/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {b.status === "busy" ? "With customer · 12 min left" : b.status === "free" ? (i === 0 ? "Next in 3 min" : "Free") : "Offline"}
                  </p>
                </div>
                <span className={cn("h-2 w-2 rounded-full", b.status === "free" ? "bg-emerald-500" : b.status === "busy" ? "bg-rose-500" : "bg-muted-foreground")}/>
              </li>
            ))}
          </ul>
          <Link to="/owner/barbers" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline">
            Manage team <Users className="h-3 w-3"/>
          </Link>
        </section>
      </div>

      {/* Quick stats row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/owner/barbers" className="rounded-2xl bg-card border border-border p-5 hover:border-foreground transition group">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center"><Users className="h-5 w-5"/></div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground">Manage →</span>
          </div>
          <p className="text-2xl font-bold mt-3">{employees.length} employees</p>
          <p className="text-xs text-muted-foreground">{activeCount} on duty · {employees.filter(e => e.status === "free").length} ready now</p>
        </Link>
        <Link to="/owner/services" className="rounded-2xl bg-card border border-border p-5 hover:border-foreground transition group">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center"><Scissors className="h-5 w-5"/></div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground">Manage →</span>
          </div>
          <p className="text-2xl font-bold mt-3">{services.length} services</p>
          <p className="text-xs text-muted-foreground">
            {services.length > 0
              ? `From ${Math.min(...services.map(s => s.price))}৳ to ${Math.max(...services.map(s => s.price))}৳`
              : "Add services to start earning"}
          </p>
        </Link>
      </div>

      {/* Recent bookings */}
      <section className="mt-6 rounded-2xl bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-semibold">Recent bookings</h2>
          <Link to="/owner/bookings" className="text-xs text-primary font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-xs text-muted-foreground uppercase border-y border-border bg-secondary/30">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Barber</th><th className="text-left p-3">Service</th><th className="text-left p-3">Time</th><th className="text-right p-3">Amount</th><th className="text-left p-3">Status</th></tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 font-mono text-xs">{b.id}</td>
                  <td className="p-3">{b.customer}</td>
                  <td className="p-3 text-muted-foreground">{b.barber}</td>
                  <td className="p-3">{b.service}</td>
                  <td className="p-3">{b.time}</td>
                  <td className="p-3 text-right font-semibold">{b.amount}৳</td>
                  <td className="p-3"><StatusPill status={b.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </OwnerShell>
  );
}

function KPI({ icon, label, value, trend, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; trend?: string; tone?: "primary" }) {
  return (
    <div className={cn("rounded-2xl p-4 border transition hover:-translate-y-0.5 hover:shadow-lg",
      tone === "primary"
        ? "bg-gradient-to-br from-foreground via-foreground to-foreground/80 text-background border-transparent"
        : "bg-card border-border")}>
      <div className="flex items-center justify-between">
        <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tone === "primary" ? "bg-accent text-accent-foreground" : "bg-secondary")}>{icon}</span>
        {trend && <span className={cn("text-[10px] font-medium", tone === "primary" ? "opacity-90" : "text-emerald-600 dark:text-emerald-400")}>{trend}</span>}
      </div>
      <p className={cn("text-xs mt-3", tone === "primary" ? "opacity-90" : "text-muted-foreground")}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "confirmed" | "in-chair" | "pending" }) {
  const map = {
    confirmed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    "in-chair": "bg-accent/20 text-accent-foreground",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  };
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", map[status])}>{status}</span>;
}

function Chart() {
  const max = Math.max(...earningsTrend.map((d) => d.value));
  return (
    <div className="mt-5 h-44 flex items-end gap-2">
      {earningsTrend.map((d, i) => {
        const h = (d.value / max) * 100;
        const isPeak = d.value === max;
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="w-full flex-1 flex items-end">
              <div className={cn("w-full rounded-t-lg transition-all duration-500", isPeak ? "bg-gradient-to-t from-foreground to-accent" : "bg-secondary group-hover:bg-foreground/30")}
                style={{ height: `${h}%`, minHeight: 4 }} title={`${d.value}৳`}/>
            </div>
            <span className={cn("text-[10px]", isPeak ? "font-semibold text-foreground" : "text-muted-foreground")}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}