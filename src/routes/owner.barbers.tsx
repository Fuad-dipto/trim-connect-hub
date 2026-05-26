import { createFileRoute } from "@tanstack/react-router";
import { Plus, MoreVertical, Star } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { Avatar } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { salons } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/barbers")({ component: Barbers });

function Barbers() {
  const barbers = salons[0].barbers;
  return (
    <OwnerShell title="Barbers" subtitle="Manage your team and live status"
      action={<Button size="sm" className="rounded-lg"><Plus className="h-4 w-4 mr-1"/>Add barber</Button>}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {barbers.map((b) => (
          <div key={b.id} className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-start gap-3">
              <Avatar hue={b.avatarHue} name={b.name} size={56}/>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.designation} · {b.experience}</p>
                  </div>
                  <button className="text-muted-foreground"><MoreVertical className="h-4 w-4"/></button>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-accent text-accent"/> {b.rating}
                  <span className="text-muted-foreground">· {b.services.length} services</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {b.skills.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary">{s}</span>)}
            </div>
            <div className="mt-3 flex gap-1 rounded-lg bg-secondary p-1">
              {(["free","busy","offline"] as const).map((st) => (
                <button key={st} className={cn("flex-1 text-[11px] py-1.5 rounded-md font-medium capitalize",
                  b.status === st ? (st === "free" ? "bg-emerald-500 text-white" : st === "busy" ? "bg-rose-500 text-white" : "bg-muted-foreground text-white") : "text-muted-foreground"
                )}>{st}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OwnerShell>
  );
}