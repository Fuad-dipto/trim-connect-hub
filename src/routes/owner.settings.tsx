import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Phone, Instagram, Facebook, Globe, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { OwnerShell } from "@/components/owner-shell";
import { Avatar } from "@/components/brand";
import { ImageDrop } from "@/components/image-drop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOwnerStore, ownerActions, type SalonProfile } from "@/lib/owner-store";

export const Route = createFileRoute("/owner/settings")({ component: Settings });

function Settings() {
  const profile = useOwnerStore((s) => s.profile);
  const employees = useOwnerStore((s) => s.employees);
  const services = useOwnerStore((s) => s.services);

  const [form, setForm] = useState<SalonProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const set = <K extends keyof SalonProfile>(k: K, v: SalonProfile[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k: keyof SalonProfile["socials"], v: string) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      ownerActions.updateProfile(form);
      setSaving(false);
      setSavedAt(Date.now());
      toast.success("Salon profile saved", { description: "Your customers will see updates instantly." });
    }, 450);
  };

  const steps: [string, boolean][] = [
    ["Profile photo", !!form.profilePhoto],
    ["Cover banner", !!form.coverPhoto],
    ["Add employees", employees.length > 0],
    ["Add services", services.length > 0],
    ["Social links", !!(form.socials.instagram || form.socials.facebook || form.socials.website)],
  ];
  const done = steps.filter(([, d]) => d).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <OwnerShell
      title="Salon profile"
      subtitle="How customers see your shop"
      action={
        <Button size="sm" className="rounded-lg" onClick={save} disabled={saving}>
          {saving ? "Saving…" : savedAt ? <><Check className="h-4 w-4 mr-1"/>Saved</> : "Save changes"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-2xl bg-card border border-border overflow-hidden">
          {/* Cover + profile photo */}
          <div className="relative">
            <ImageDrop
              value={form.coverPhoto}
              onChange={(v) => set("coverPhoto", v)}
              className="h-40 w-full rounded-none border-0"
              label="Drop cover banner"
            />
            <div className="absolute -bottom-10 left-5">
              <ImageDrop
                value={form.profilePhoto}
                onChange={(v) => set("profilePhoto", v)}
                shape="circle"
                className="h-24 w-24 ring-4 ring-card"
                label="Logo"
              />
            </div>
          </div>

          <div className="pt-14 p-5 space-y-4">
            <Field label="Salon name">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)}/>
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)}/>
            </Field>
            <Field label="About">
              <textarea
                value={form.about}
                onChange={(e) => set("about", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Address" icon={<MapPin className="h-4 w-4"/>}>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} className="pl-9"/>
              </Field>
              <Field label="Phone" icon={<Phone className="h-4 w-4"/>}>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="pl-9"/>
              </Field>
              <Field label="Business hours" icon={<Clock className="h-4 w-4"/>}>
                <Input value={form.hours} onChange={(e) => set("hours", e.target.value)} className="pl-9"/>
              </Field>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Social links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field icon={<Instagram className="h-4 w-4"/>}>
                  <Input value={form.socials.instagram} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="Instagram handle" className="pl-9"/>
                </Field>
                <Field icon={<Facebook className="h-4 w-4"/>}>
                  <Input value={form.socials.facebook} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="Facebook page" className="pl-9"/>
                </Field>
                <Field icon={<Globe className="h-4 w-4"/>}>
                  <Input value={form.socials.website} onChange={(e) => setSocial("website", e.target.value)} placeholder="Website" className="pl-9"/>
                </Field>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {/* Preview card */}
          <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <Avatar hue={75} name={form.name} src={form.profilePhoto} size={48}/>
              <div className="min-w-0">
                <p className="font-semibold truncate">{form.name || "Your salon"}</p>
                <p className="text-xs opacity-70 truncate">{form.tagline}</p>
              </div>
            </div>
            <p className="text-xs opacity-80 mt-3 line-clamp-3">{form.about}</p>
            <div className="mt-3 text-[11px] opacity-80 space-y-1">
              <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3"/>{form.address}</p>
              <p className="flex items-center gap-1.5"><Clock className="h-3 w-3"/>{form.hours}</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[10px]">
              <Sparkles className="h-3 w-3 text-accent"/>
              <span className="opacity-80">Live preview</span>
            </div>
          </div>

          {/* Onboarding */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Setup progress</h3>
              <span className="text-xs font-semibold text-accent-foreground bg-accent px-2 py-0.5 rounded-full">{pct}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-foreground to-accent transition-all duration-500" style={{ width: `${pct}%` }}/>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {steps.map(([label, d]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${d ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                    {d ? <Check className="h-3 w-3"/> : ""}
                  </span>
                  <span className={d ? "text-muted-foreground line-through" : ""}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </OwnerShell>
  );
}

function Field({ label, children, icon }: { label?: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div>
      {label && <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>}
      <div className={`relative ${label ? "mt-1.5" : ""}`}>
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">{icon}</span>}
        {children}
      </div>
    </div>
  );
}