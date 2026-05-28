import { createFileRoute, useNavigate, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Plus } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { getBarber, timeSlots, type Barber, type Salon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$barberId")({
  component: Book,
  loader: ({ params }) => {
    const r = getBarber(params.barberId);
    if (!r) throw notFound();
    return r;
  },
});

function Book() {
  const data = Route.useLoaderData() as { salon: Salon; barber: Barber };
  const { barber, salon } = data;
  const nav = useNavigate();

  const [selected, setSelected] = useState<string[]>([barber.services[0].id]);
  const [slot, setSlot] = useState(timeSlots[3]);

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const services = barber.services.filter((s) => selected.includes(s.id));
  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const duration = services.reduce((sum, s) => sum + s.duration, 0);
  const fee = 20;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + fee + tax;

  return (
    <MobileShell>
      <PageHeader title="Book appointment" subtitle={salon.name} back={() => nav({ to: "/salons/$id", params: { id: salon.id } })} />

      <div className="px-4 py-4 pb-40 space-y-5">
        <div className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3">
          <Avatar hue={barber.avatarHue} name={barber.name} size={48} src={barber.photo} />
          <div className="flex-1">
            <p className="font-semibold">{barber.name}</p>
            <p className="text-xs text-muted-foreground">{barber.designation} · {barber.experience}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Confirmed available</span>
        </div>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm">Choose services <span className="text-muted-foreground font-normal">· tap to add multiple</span></h2>
            <span className="text-[11px] text-muted-foreground">{selected.length} selected</span>
          </div>
          <div className="space-y-2">
            {barber.services.map((s) => {
              const on = selected.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggle(s.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 flex items-center gap-3 transition",
                    on ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card"
                  )}>
                  <div className={cn(
                    "h-6 w-6 rounded-md border-2 flex items-center justify-center shrink-0",
                    on ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  )}>
                    {on ? <CheckCircle2 className="h-4 w-4"/> : <Plus className="h-3.5 w-3.5 text-muted-foreground"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.description} · <Clock className="h-3 w-3 inline"/> {s.duration} min</p>
                  </div>
                  <p className="font-semibold">{s.price}৳</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-sm mb-2">Pick a time slot · Today</h2>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((t, i) => {
              const taken = i === 2 || i === 7;
              return (
                <button key={t} disabled={taken} onClick={() => setSlot(t)}
                  className={cn(
                    "h-10 rounded-lg text-xs font-medium border transition",
                    taken ? "bg-muted text-muted-foreground line-through cursor-not-allowed border-border" :
                    slot === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"
                  )}>
                  {t}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Total duration: ~{duration} min · Live queue: 2 ahead</p>
        </section>

        <section className="rounded-2xl bg-card border border-border p-4 space-y-2">
          <h2 className="font-semibold text-sm mb-2">Price summary</h2>
          {services.map((s) => <Row key={s.id} label={s.name} value={`${s.price}৳`} />)}
          {services.length === 0 && <p className="text-xs text-muted-foreground">Select at least one service.</p>}
          <Row label="Booking fee" value={`${fee}৳`} />
          <Row label="VAT (5%)" value={`${tax}৳`} />
          <div className="border-t border-border my-2"/>
          <Row label="Total" value={`${total}৳`} bold />
        </section>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur border-t border-border px-4 py-3 z-30">
        <Link to="/login" search={{ next: `/payment?services=${selected.join(",")}&barber=${barber.id}&slot=${encodeURIComponent(slot)}` }}>
          <Button disabled={services.length === 0} className="liquid-glass w-full h-12 rounded-xl font-semibold disabled:opacity-50">
            Continue · {total}৳
          </Button>
        </Link>
      </div>
    </MobileShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn("flex justify-between text-sm", bold ? "font-semibold text-base" : "text-muted-foreground")}>
      <span>{label}</span><span className={bold ? "text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}