import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { OwnerShell } from "@/components/owner-shell";
import { Button } from "@/components/ui/button";
import { salons } from "@/lib/mock-data";

export const Route = createFileRoute("/owner/services")({ component: Services });

function Services() {
  const services = salons[0].barbers[0].services;
  return (
    <OwnerShell title="Services" subtitle="Manage your service menu and pricing"
      action={<Button size="sm" className="rounded-lg"><Plus className="h-4 w-4 mr-1"/>Add service</Button>}>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-4 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3"/> {s.duration} min</p>
            </div>
            <p className="font-bold text-lg shrink-0">{s.price}৳</p>
            <div className="flex gap-1 shrink-0">
              <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center"><Edit className="h-3.5 w-3.5"/></button>
              <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-destructive"><Trash2 className="h-3.5 w-3.5"/></button>
            </div>
          </div>
        ))}
      </div>
    </OwnerShell>
  );
}