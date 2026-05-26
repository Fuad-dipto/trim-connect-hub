import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Users, Calendar, DollarSign, Star, Plus } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { Avatar } from "@/components/brand";
import { ownerStats, recentBookings, earningsTrend, salons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/")({ component: Dashboard });

function Dashboard() {
  return (
    <OwnerShell
      title="Good morning, Anwar"
      subtitle="Here's what's happening at Luxe Cuts Studio today"
      action={<Button size="sm" className="rounded-lg"><Plus className="h-4 w-4 mr-1"/>New booking</Button>}
    >
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={<DollarSign className="h-4 w-4"/>} label="Today's earnings" value={`${ownerStats.todayEarnings.toLocaleString()}৳`} trend="+12.4%" tone="primary"/>
        <KPI icon={<Calendar className="h-4 w-4"/>} label="Today's bookings" value={ownerStats.todayBookings} trend="+5"/>
        <KPI icon={<Users className="h-4 w-4"/>} label="Active barbers" value={`${ownerStats.activeBarbers} / 4`} trend="All on duty"/>
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
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Live</span>
          </div>
          <p className="text-3xl font-bold">{ownerStats.queueNow}<span className="text-sm text-muted-foreground font-normal"> in queue</span></p>
          <ul className="mt-3 space-y-2">
            {salons[0].barbers.map((b, i) => (
              <li key={b.id} className="flex items-center gap-2">
                <Avatar hue={b.avatarHue} name={b.name} size={28}/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{i === 1 ? "With customer · 12 min left" : i === 0 ? "Next in 3 min" : "Free"}</p>
                </div>
                <span className={cn("h-2 w-2 rounded-full", b.status === "free" ? "bg-emerald-500" : b.status === "busy" ? "bg-rose-500" : "bg-muted-foreground")}/>
              </li>
            ))}
          </ul>
        </section>
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
    <div className={cn("rounded-2xl p-4 border", tone === "primary" ? "bg-gradient-to-br from-primary to-accent text-primary-foreground border-transparent" : "bg-card border-border")}>
      <div className="flex items-center justify-between">
        <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tone === "primary" ? "bg-white/20" : "bg-secondary")}>{icon}</span>
        {trend && <span className={cn("text-[10px]", tone === "primary" ? "opacity-90" : "text-emerald-600 font-medium")}>{trend}</span>}
      </div>
      <p className={cn("text-xs mt-3", tone === "primary" ? "opacity-90" : "text-muted-foreground")}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "confirmed" | "in-chair" | "pending" }) {
  const map = {
    confirmed: "bg-emerald-100 text-emerald-700",
    "in-chair": "bg-primary/10 text-primary",
    pending: "bg-amber-100 text-amber-700",
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
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex-1 flex items-end">
              <div className={cn("w-full rounded-t-lg transition", isPeak ? "bg-gradient-to-t from-primary to-accent" : "bg-secondary group-hover:bg-primary/30")}
                style={{ height: `${h}%`, minHeight: 4 }} title={`${d.value}৳`}/>
            </div>
            <span className={cn("text-[10px]", isPeak ? "font-semibold text-foreground" : "text-muted-foreground")}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}