import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowLeft, ArrowRight, Store, MapPin, Image as ImageIcon, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageDrop } from "@/components/image-drop";
import { cn } from "@/lib/utils";
import { ownerAccountActions } from "@/lib/owner-account";

export const Route = createFileRoute("/owner-register")({ component: OwnerRegister });

type Form = {
  fullName: string; email: string; phone: string; password: string;
  salonName: string; description: string; category: string;
  logo?: string; cover?: string; gallery: string[];
  address: string; mapLocation: string; hours: string;
};

const CATEGORIES = ["Unisex Salon", "Men's Barber", "Women's Salon", "Beauty Parlor", "Spa & Wellness", "Nail Studio"];
const STEPS = [
  { id: 1, label: "Owner", icon: ShieldCheck },
  { id: 2, label: "Salon", icon: Store },
  { id: 3, label: "Media", icon: ImageIcon },
  { id: 4, label: "Location", icon: MapPin },
  { id: 5, label: "Review", icon: FileText },
];

function OwnerRegister() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>({
    fullName: "", email: "", phone: "", password: "",
    salonName: "", description: "", category: CATEGORIES[0],
    gallery: [],
    address: "", mapLocation: "", hours: "10:00 AM — 10:00 PM",
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 1) return f.fullName && f.email && f.phone && f.password.length >= 4;
    if (step === 2) return f.salonName && f.description && f.category;
    if (step === 3) return true;
    if (step === 4) return f.address && f.hours;
    return true;
  };

  const submit = () => {
    ownerAccountActions.register(f);
    toast.success("Salon registered!", { description: "Welcome to your Owner Dashboard." });
    nav({ to: "/owner" });
  };

  return (
    <MobileShell>
      <PageHeader title="Register Salon" back={() => (step > 1 ? setStep(step - 1) : history.back())} />
      <div className="px-5 py-4 space-y-5">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition",
                  done ? "bg-primary text-primary-foreground" : active ? "bg-foreground text-background ring-4 ring-foreground/15" : "bg-secondary text-muted-foreground",
                )}>
                  {done ? <Check className="h-4 w-4"/> : <s.icon className="h-4 w-4"/>}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-0.5 flex-1 mx-1", done ? "bg-primary" : "bg-secondary")}/>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center -mt-2">Step {step} of {STEPS.length} · {STEPS[step-1].label}</p>

        <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
          {step === 1 && (
            <>
              <H title="Owner Information" sub="We'll use this to set up your owner login."/>
              <Labeled label="Full Name"><Input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Anwar Hossain"/></Labeled>
              <Labeled label="Email"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="owner@example.com"/></Labeled>
              <Labeled label="Phone Number"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+880 17XX XXX XXX"/></Labeled>
              <Labeled label="Password"><Input type="password" value={f.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 4 characters"/></Labeled>
            </>
          )}

          {step === 2 && (
            <>
              <H title="Salon Information" sub="Tell customers what makes your salon special."/>
              <Labeled label="Salon Name"><Input value={f.salonName} onChange={(e) => set("salonName", e.target.value)} placeholder="Luxe Cuts Studio"/></Labeled>
              <Labeled label="Description">
                <textarea
                  rows={3}
                  value={f.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Short pitch about your salon…"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </Labeled>
              <Labeled label="Category">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => set("category", c)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                        f.category === c ? "bg-foreground text-background border-foreground" : "bg-secondary text-muted-foreground border-transparent hover:text-foreground",
                      )}
                    >{c}</button>
                  ))}
                </div>
              </Labeled>
            </>
          )}

          {step === 3 && (
            <>
              <H title="Photos" sub="High quality images attract more bookings."/>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Salon Logo</p>
                <ImageDrop value={f.logo} onChange={(v) => set("logo", v)} shape="circle" className="h-24 w-24" label="Logo"/>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Cover Image</p>
                <ImageDrop value={f.cover} onChange={(v) => set("cover", v)} className="h-36 w-full" label="Drop cover banner"/>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Gallery</p>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <ImageDrop
                      key={i}
                      value={f.gallery[i]}
                      onChange={(v) => {
                        const next = [...f.gallery];
                        if (v) next[i] = v; else next.splice(i, 1);
                        set("gallery", next.filter(Boolean));
                      }}
                      className="aspect-square w-full"
                      label="Add"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <H title="Location & Hours" sub="Help customers find you."/>
              <Labeled label="Address"><Input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Road 11, Gulshan 2, Dhaka"/></Labeled>
              <Labeled label="Map Location (coords or link)"><Input value={f.mapLocation} onChange={(e) => set("mapLocation", e.target.value)} placeholder="23.7925, 90.4078"/></Labeled>
              <Labeled label="Business Hours"><Input value={f.hours} onChange={(e) => set("hours", e.target.value)} placeholder="10:00 AM — 10:00 PM"/></Labeled>
              <div className="rounded-xl bg-secondary/50 h-32 flex items-center justify-center text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1"/> Map preview
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <H title="Review & Submit" sub="Confirm your details before we activate your account."/>
              <ReviewRow label="Owner" value={`${f.fullName} · ${f.email}`}/>
              <ReviewRow label="Phone" value={f.phone}/>
              <ReviewRow label="Salon" value={`${f.salonName} (${f.category})`}/>
              <ReviewRow label="Description" value={f.description}/>
              <ReviewRow label="Address" value={f.address}/>
              <ReviewRow label="Hours" value={f.hours}/>
              <ReviewRow label="Photos" value={`Logo: ${f.logo ? "✓" : "—"} · Cover: ${f.cover ? "✓" : "—"} · Gallery: ${f.gallery.length}`}/>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline" className="rounded-xl"
            onClick={() => (step > 1 ? setStep(step - 1) : history.back())}
          >
            <ArrowLeft className="h-4 w-4 mr-1"/> Back
          </Button>
          {step < 5 ? (
            <Button className="rounded-xl flex-1 max-w-[60%] h-11" disabled={!canNext()} onClick={() => setStep(step + 1)}>
              Continue <ArrowRight className="h-4 w-4 ml-1"/>
            </Button>
          ) : (
            <Button className="rounded-xl flex-1 max-w-[60%] h-11" onClick={submit}>
              <Check className="h-4 w-4 mr-1"/> Submit & Activate
            </Button>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function H({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-base font-bold">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-right break-words max-w-[70%]">{value || "—"}</span>
    </div>
  );
}