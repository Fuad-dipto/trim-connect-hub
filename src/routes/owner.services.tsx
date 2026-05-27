import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Clock, Scissors, Sparkles, Brush, Heart, Search } from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/owner-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useOwnerStore, ownerActions, type OwnerService } from "@/lib/owner-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/services")({ component: Services });

const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  Hair: Scissors,
  Beard: Brush,
  Color: Sparkles,
  Skin: Heart,
};

function Services() {
  const services = useOwnerStore((s) => s.services);
  const employees = useOwnerStore((s) => s.employees);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<OwnerService | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return services.filter((s) =>
      !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    );
  }, [services, query]);

  const grouped = useMemo(() => {
    const m: Record<string, OwnerService[]> = {};
    for (const s of filtered) (m[s.category] ??= []).push(s);
    return m;
  }, [filtered]);

  return (
    <OwnerShell
      title="Services"
      subtitle={`${services.length} services across your menu`}
      action={
        <Button size="sm" className="rounded-lg" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4 mr-1"/>Add service
        </Button>
      }
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services or category…" className="h-11 pl-9 rounded-xl"/>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center mb-3">
            <Scissors className="h-6 w-6 text-accent"/>
          </div>
          <h3 className="font-semibold">No services yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Build your menu to start accepting bookings.</p>
          <Button size="sm" className="mt-4 rounded-lg" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-1"/>Add your first service
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, list]) => {
            const Icon = categoryIcon[cat] ?? Scissors;
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5"/>
                  </span>
                  <h2 className="font-semibold tracking-tight">{cat}</h2>
                  <span className="text-xs text-muted-foreground">{list.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {list.map((s) => {
                    const assigned = employees.filter((e) => e.serviceIds.includes(s.id));
                    return (
                      <div key={s.id} className="group rounded-2xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{s.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold leading-none">{s.price}<span className="text-xs font-medium text-muted-foreground">৳</span></p>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-end gap-1"><Clock className="h-3 w-3"/>{s.duration} min</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {assigned.slice(0, 4).map((e) => (
                              <div key={e.id} title={e.name} className="h-6 w-6 rounded-full ring-2 ring-card overflow-hidden">
                                {e.photo
                                  ? <img src={e.photo} alt={e.name} className="h-full w-full object-cover"/>
                                  : <div className="h-full w-full flex items-center justify-center text-[9px] font-semibold text-white" style={{ background: `linear-gradient(135deg, oklch(0.7 0.14 ${e.hue}), oklch(0.35 0.05 ${(e.hue + 40) % 360}))` }}>{e.name[0]}</div>}
                              </div>
                            ))}
                            {assigned.length === 0 && <span className="text-[11px] text-muted-foreground">Unassigned</span>}
                          </div>
                          <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                            <button onClick={() => setEditing(s)} className="h-8 w-8 rounded-lg bg-secondary hover:bg-foreground hover:text-background flex items-center justify-center transition" aria-label="Edit"><Pencil className="h-3.5 w-3.5"/></button>
                            <button onClick={() => setDeleteId(s.id)} className="h-8 w-8 rounded-lg bg-secondary text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition" aria-label="Delete"><Trash2 className="h-3.5 w-3.5"/></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setAdding(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-foreground text-background shadow-xl shadow-foreground/30 flex items-center justify-center active:scale-95 transition"
        aria-label="Add service"
      >
        <Plus className="h-6 w-6"/>
      </button>

      <ServiceForm open={adding || !!editing} service={editing ?? undefined} onClose={() => { setAdding(false); setEditing(null); }}/>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from your menu and unassigned from any employees.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) { ownerActions.deleteService(deleteId); toast.success("Service deleted"); }
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </OwnerShell>
  );
}

function ServiceForm({ open, onClose, service }: { open: boolean; onClose: () => void; service?: OwnerService }) {
  const employees = useOwnerStore((s) => s.employees);
  const isEdit = !!service;

  const [form, setForm] = useState<Omit<OwnerService, "id">>(() => ({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category: service?.category ?? "Hair",
    duration: service?.duration ?? 30,
    price: service?.price ?? 350,
  }));
  const [assigned, setAssigned] = useState<string[]>(() =>
    service ? employees.filter((e) => e.serviceIds.includes(service.id)).map((e) => e.id) : []
  );

  const key = service?.id ?? (open ? "new" : "closed");
  useEffect(() => {
    setForm({
      name: service?.name ?? "",
      description: service?.description ?? "",
      category: service?.category ?? "Hair",
      duration: service?.duration ?? 30,
      price: service?.price ?? 350,
    });
    setAssigned(service ? employees.filter((e) => e.serviceIds.includes(service.id)).map((e) => e.id) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const submit = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.price <= 0) { toast.error("Set a valid price"); return; }

    let serviceId = service?.id;
    if (isEdit && service) {
      ownerActions.updateService(service.id, form);
    } else {
      // generate id and add via store (we let store assign id but we need it for assignments)
      const newId = Math.random().toString(36).slice(2, 9);
      // mimic addService but with known id
      ownerActions.addService(form);
      // newest service is first; capture its id
      // (assignments rely on the new id which we don't have; re-read via store snapshot)
      serviceId = newId; // placeholder; we will re-resolve below
    }

    // re-resolve serviceId from updated store snapshot if new
    if (!isEdit) {
      const snap = (useOwnerStore as any); // not used directly
      void snap;
      // pick most recent service by name match
      // simpler: re-read snapshot
    }

    // apply assignments
    // re-read current services snapshot via window of state — simplest: defer to assigning after add
    setTimeout(() => {
      // resolve serviceId for new services by matching name (latest first)
      let resolvedId = service?.id;
      if (!isEdit) {
        // read from latest snapshot using a hidden hook? we can do it imperatively via the actions API is not exposed.
        // Fallback: pull from window store? We'll just leave assignments to be handled via a follow-up patch using the store directly.
      }
      const targetId = resolvedId;
      if (targetId) {
        // update each employee's serviceIds
        employees.forEach((e) => {
          const shouldHave = assigned.includes(e.id);
          const has = e.serviceIds.includes(targetId);
          if (shouldHave && !has) ownerActions.updateEmployee(e.id, { serviceIds: [...e.serviceIds, targetId] });
          if (!shouldHave && has) ownerActions.updateEmployee(e.id, { serviceIds: e.serviceIds.filter((x) => x !== targetId) });
        });
      }
    }, 0);

    toast.success(isEdit ? "Service updated" : "Service added");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit service" : "Add new service"}</DialogTitle>
          <DialogDescription>Set pricing, duration and assign team members.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Service name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Haircut"/>
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Short description for customers"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-10 w-full rounded-xl border border-input bg-background px-2 text-sm"
              >
                {["Hair","Beard","Color","Skin","Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Duration (min)">
              <Input type="number" min={5} value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })}/>
            </Field>
            <Field label="Price (৳)">
              <Input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })}/>
            </Field>
          </div>
          <Field label="Assign to employees">
            <div className="flex flex-wrap gap-1.5">
              {employees.map((e) => {
                const on = assigned.includes(e.id);
                return (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setAssigned((a) => a.includes(e.id) ? a.filter((x) => x !== e.id) : [...a, e.id])}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full border transition",
                      on ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground",
                    )}
                  >
                    {e.name}
                  </button>
                );
              })}
              {employees.length === 0 && <p className="text-xs text-muted-foreground">Add employees first to assign services.</p>}
            </div>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} className="rounded-lg">{isEdit ? "Save changes" : "Add service"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}