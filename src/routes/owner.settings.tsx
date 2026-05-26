import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { GradientBlob } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/owner/settings")({ component: Settings });

function Settings() {
  return (
    <OwnerShell title="Salon profile" subtitle="How customers see your shop"
      action={<Button size="sm" className="rounded-lg">Save changes</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-2xl bg-card border border-border overflow-hidden">
          <div className="relative">
            <GradientBlob hue={285} className="h-40 w-full"/>
            <button className="absolute bottom-3 right-3 h-9 px-3 rounded-lg bg-black/50 backdrop-blur text-white text-xs flex items-center gap-1"><Camera className="h-3.5 w-3.5"/>Change cover</button>
          </div>
          <div className="p-5 space-y-4">
            <Field label="Salon name" defaultValue="Luxe Cuts Studio"/>
            <Field label="Tagline" defaultValue="Premium hair studio in Gulshan 2"/>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <textarea rows={3} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" defaultValue="Award-winning hair studio with senior stylists trained in London."/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Address" icon={<MapPin className="h-4 w-4"/>} defaultValue="Road 11, Gulshan 2"/>
              <Field label="Business hours" icon={<Clock className="h-4 w-4"/>} defaultValue="10:00 AM — 10:00 PM"/>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Gallery</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[285,260,310,200].map((h) => <GradientBlob key={h} hue={h} className="h-20 rounded-xl"/>)}
                <button className="h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground"><Camera className="h-5 w-5"/></button>
              </div>
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="font-semibold text-sm">Onboarding</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[["Profile photo",true],["Cover & gallery",true],["Add barbers",true],["Add services",true],["Bank account",false]].map(([l,d]) => (
                <li key={l as string} className="flex items-center gap-2">
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${d ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"}`}>{d ? "✓" : ""}</span>
                  <span className={d ? "text-muted-foreground line-through" : ""}>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-primary to-accent"/>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">4 of 5 complete · Auto-saved</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="font-semibold text-sm">Owner</h3>
            <Field label="Full name" defaultValue="Anwar Hossain"/>
            <div className="mt-3"><Field label="Phone" defaultValue="+880 1712 345 678"/></div>
          </div>
        </aside>
      </div>
    </OwnerShell>
  );
}

function Field({ label, defaultValue, icon }: { label: string; defaultValue?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1 relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <Input defaultValue={defaultValue} className={`h-11 rounded-xl ${icon ? "pl-9" : ""}`}/>
      </div>
    </div>
  );
}