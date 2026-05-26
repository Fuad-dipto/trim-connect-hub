import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { Button } from "@/components/ui/button";
import { recentBookings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/bookings")({ component: Bookings });

function Bookings() {
  const map = { confirmed: "bg-emerald-100 text-emerald-700", "in-chair": "bg-primary/10 text-primary", pending: "bg-amber-100 text-amber-700" } as const;
  return (
    <OwnerShell title="Bookings" subtitle="Accept, reschedule or cancel appointments">
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-secondary/30">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Barber</th><th className="text-left p-3">Service</th><th className="text-left p-3">Time</th><th className="text-right p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 font-mono text-xs">{b.id}</td>
                  <td className="p-3 font-medium">{b.customer}</td>
                  <td className="p-3 text-muted-foreground">{b.barber}</td>
                  <td className="p-3">{b.service}</td>
                  <td className="p-3">{b.time}</td>
                  <td className="p-3 text-right font-semibold">{b.amount}৳</td>
                  <td className="p-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", map[b.status])}>{b.status}</span></td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Reschedule</Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive">Cancel</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OwnerShell>
  );
}