import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, Star, Search, Phone, MapPin, Pencil, Trash2,
  ChevronDown, Briefcase, Filter,
} from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/owner-shell";
import { Avatar } from "@/components/brand";
import { ImageDrop } from "@/components/image-drop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useOwnerStore, ownerActions, type Employee, type EmployeeStatus } from "@/lib/owner-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner/barbers")({ component: Employees });

const statusStyles: Record<EmployeeStatus, string> = {
  free: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  busy: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  offline: "bg-muted text-muted-foreground",
};

function Employees() {
  const employees = useOwnerStore((s) => s.employees);
  const services = useOwnerStore((s) => s.services);
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = query.toLowerCase().trim();
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.skills.some((s) => s.toLowerCase().includes(q));
      const matchSvc = serviceFilter === "all" || e.serviceIds.includes(serviceFilter);
      return matchQ && matchSvc;
    });
  }, [employees, query, serviceFilter]);

  return (
    <OwnerShell
      title="Employees"
      subtitle={`${employees.length} on your team · ${employees.filter((e) => e.status === "free").length} available right now`}
      action={
        <Button size="sm" className="rounded-lg" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4 mr-1"/>Add employee
        </Button>
      }
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, role, skill…" className="h-11 pl-9 rounded-xl"/>
        </div>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="h-11 rounded-xl sm:w-56">
            <Filter className="h-4 w-4 mr-1 text-muted-foreground"/>
            <SelectValue placeholder="Filter by service"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onAdd={() => setAdding(true)}/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((e) => (
            <EmployeeCard
              key={e.id}
              emp={e}
              services={services}
              expanded={expanded === e.id}
              onToggle={() => setExpanded(expanded === e.id ? null : e.id)}
              onEdit={() => setEditing(e)}
              onDelete={() => setDeleteId(e.id)}
            />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setAdding(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-foreground text-background shadow-xl shadow-foreground/30 flex items-center justify-center active:scale-95 transition"
        aria-label="Add employee"
      >
        <Plus className="h-6 w-6"/>
      </button>

      <EmployeeForm
        open={adding || !!editing}
        employee={editing ?? undefined}
        onClose={() => { setAdding(false); setEditing(null); }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the employee from your salon. Existing bookings will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  ownerActions.deleteEmployee(deleteId);
                  toast.success("Employee removed");
                }
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </OwnerShell>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center mb-3">
        <Briefcase className="h-6 w-6 text-accent"/>
      </div>
      <h3 className="font-semibold">No employees match</h3>
      <p className="text-sm text-muted-foreground mt-1">Try a different search or add a new team member.</p>
      <Button onClick={onAdd} size="sm" className="mt-4 rounded-lg"><Plus className="h-4 w-4 mr-1"/>Add employee</Button>
    </div>
  );
}

function EmployeeCard({
  emp, services, expanded, onToggle, onEdit, onDelete,
}: {
  emp: Employee;
  services: { id: string; name: string }[];
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const empServices = services.filter((s) => emp.serviceIds.includes(s.id));

  return (
    <div className="rounded-2xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <Avatar hue={emp.hue} name={emp.name} src={emp.photo} size={56}/>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="font-semibold truncate">{emp.name}</p>
              <p className="text-xs text-muted-foreground truncate">{emp.role} · {emp.experience}</p>
            </div>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize shrink-0", statusStyles[emp.status])}>
              {emp.status}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent"/> {emp.rating.toFixed(1)}</span>
            <span>{empServices.length} services</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {emp.skills.slice(0, 4).map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
        ))}
      </div>

      <div className="mt-3 flex gap-1 rounded-lg bg-secondary p-1">
        {(["free", "busy", "offline"] as EmployeeStatus[]).map((st) => (
          <button
            key={st}
            onClick={() => {
              ownerActions.updateEmployee(emp.id, { status: st });
              toast.success(`${emp.name.split(" ")[0]} is now ${st}`);
            }}
            className={cn(
              "flex-1 text-[11px] py-1.5 rounded-md font-medium capitalize transition",
              emp.status === st
                ? st === "free" ? "bg-emerald-500 text-white shadow-sm"
                  : st === "busy" ? "bg-rose-500 text-white shadow-sm"
                  : "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {st}
          </button>
        ))}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs animate-fade-in">
          <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground"/> {emp.phone}</p>
          <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground"/> {emp.address}</p>
          {empServices.length > 0 && (
            <div className="pt-1">
              <p className="text-muted-foreground mb-1">Services</p>
              <div className="flex flex-wrap gap-1">
                {empServices.map((s) => (
                  <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground border border-accent/30">{s.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1">
        <button
          onClick={onToggle}
          className="flex-1 h-8 rounded-lg bg-secondary text-xs font-medium flex items-center justify-center gap-1 hover:bg-secondary/70"
        >
          {expanded ? "Less" : "More"}
          <ChevronDown className={cn("h-3.5 w-3.5 transition", expanded && "rotate-180")}/>
        </button>
        <button
          onClick={onEdit}
          className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-foreground hover:text-background transition"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5"/>
        </button>
        <button
          onClick={onDelete}
          className="h-8 w-8 rounded-lg bg-secondary text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5"/>
        </button>
      </div>
    </div>
  );
}

function EmployeeForm({
  open, onClose, employee,
}: {
  open: boolean;
  onClose: () => void;
  employee?: Employee;
}) {
  const services = useOwnerStore((s) => s.services);
  const isEdit = !!employee;

  const [form, setForm] = useState<Omit<Employee, "id" | "rating" | "hue">>(() => ({
    name: employee?.name ?? "",
    phone: employee?.phone ?? "",
    address: employee?.address ?? "",
    role: employee?.role ?? "Stylist",
    experience: employee?.experience ?? "1 yr",
    skills: employee?.skills ?? [],
    serviceIds: employee?.serviceIds ?? [],
    status: employee?.status ?? "free",
    photo: employee?.photo,
  }));
  const [skillsInput, setSkillsInput] = useState((employee?.skills ?? []).join(", "));

  // sync when opening different employee
  const key = employee?.id ?? (open ? "new" : "closed");
  useMemo(() => {
    setForm({
      name: employee?.name ?? "",
      phone: employee?.phone ?? "",
      address: employee?.address ?? "",
      role: employee?.role ?? "Stylist",
      experience: employee?.experience ?? "1 yr",
      skills: employee?.skills ?? [],
      serviceIds: employee?.serviceIds ?? [],
      status: employee?.status ?? "free",
      photo: employee?.photo,
    });
    setSkillsInput((employee?.skills ?? []).join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const submit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, skills };
    if (isEdit && employee) {
      ownerActions.updateEmployee(employee.id, payload);
      toast.success("Employee updated");
    } else {
      ownerActions.addEmployee(payload);
      toast.success("Employee added");
    }
    onClose();
  };

  const toggleService = (id: string) => {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add new employee"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update profile, services, and availability." : "Add a new team member to your salon."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ImageDrop
              value={form.photo}
              onChange={(photo) => setForm((f) => ({ ...f, photo }))}
              shape="circle"
              className="h-24 w-24 shrink-0"
              label="Photo"
            />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Profile photo</p>
              <p>Drag & drop or click to upload. Square images look best.</p>
            </div>
          </div>

          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rohim Ahmed"/>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+880…"/></Field>
            <Field label="Role"><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Senior Stylist"/></Field>
          </div>

          <Field label="Address"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Area, City"/></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Experience"><Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="3 yrs"/></Field>
            <Field label="Availability">
              <Select value={form.status} onValueChange={(v: EmployeeStatus) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Skills (comma separated)">
            <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Fade, Color, Beard"/>
          </Field>

          <Field label="Assigned services">
            <div className="flex flex-wrap gap-1.5">
              {services.map((s) => {
                const on = form.serviceIds.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full border transition",
                      on ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground",
                    )}
                  >
                    {s.name}
                  </button>
                );
              })}
              {services.length === 0 && <p className="text-xs text-muted-foreground">No services yet — add some first.</p>}
            </div>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} className="rounded-lg">{isEdit ? "Save changes" : "Add employee"}</Button>
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