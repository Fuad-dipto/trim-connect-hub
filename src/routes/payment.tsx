import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, QrCode, CheckCircle2 } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { getBarber, paymentMethods, type Barber, type Salon } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Search = { service?: string; barber?: string; slot?: string };

export const Route = createFileRoute("/payment")({
  component: Payment,
  validateSearch: (s: Record<string, unknown>): Search => ({
    service: typeof s.service === "string" ? s.service : undefined,
    barber: typeof s.barber === "string" ? s.barber : undefined,
    slot: typeof s.slot === "string" ? s.slot : undefined,
  }),
});

function Payment() {
  const nav = useNavigate();
  const { service, barber: barberId, slot } = Route.useSearch();

  const found = barberId ? getBarber(barberId) : null;
  const barber: Barber | undefined = found?.barber;
  const salon: Salon | undefined = found?.salon;
  const svc = barber?.services.find((s) => s.id === service) ?? barber?.services[0];

  const [method, setMethod] = useState("bkash");
  const [paying, setPaying] = useState(false);

  const total = (svc?.price ?? 0) + 20;

  function pay() {
    setPaying(true);
    setTimeout(() => nav({ to: "/booking-success", search: { barber: barberId, service, slot, method } }), 1600);
  }

  return (
    <MobileShell>
      <PageHeader title="Checkout" subtitle={`${salon?.name ?? "Salon"} · ${slot ?? ""}`} back={() => history.back()} />

      <div className="px-4 py-4 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 shadow-lg shadow-primary/20">
          <p className="text-xs opacity-80">Amount to pay</p>
          <p className="text-3xl font-bold mt-1">{total}৳</p>
          <div className="mt-3 text-xs flex items-center gap-1 opacity-90">
            <ShieldCheck className="h-3.5 w-3.5"/> Secured by TrimGo Pay · 256-bit encrypted
          </div>
        </div>

        <section>
          <h2 className="font-semibold text-sm mb-2">Choose payment method</h2>
          <div className="space-y-2">
            {paymentMethods.map((p) => (
              <button key={p.id} onClick={() => setMethod(p.id)}
                className={cn(
                  "w-full rounded-xl border p-3 flex items-center justify-between transition",
                  method === p.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card"
                )}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl" style={{ background: p.brand, color: "white" }}>
                    {p.emoji}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.id === "cash" ? "Pay when you arrive" : "Instant transfer"}</p>
                  </div>
                </div>
                <div className={cn("h-5 w-5 rounded-full border-2", method === p.id ? "border-primary bg-primary" : "border-border")}>
                  {method === p.id && <CheckCircle2 className="h-4 w-4 text-primary-foreground"/>}
                </div>
              </button>
            ))}
          </div>
        </section>

        {method !== "cash" && method !== "card" && (
          <section className="rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-3">Scan with your {paymentMethods.find(p => p.id === method)?.name} app</p>
            <div className="mx-auto h-40 w-40 rounded-xl bg-foreground p-3 grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={cn("rounded-[1px]", Math.random() > 0.5 ? "bg-background" : "bg-foreground")}/>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1"><QrCode className="h-3 w-3"/> QR refreshes every 60s</p>
          </section>
        )}

        {method === "card" && (
          <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <input className="w-full h-11 rounded-xl border border-input px-3 text-sm" placeholder="Card number" />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-11 rounded-xl border border-input px-3 text-sm" placeholder="MM / YY" />
              <input className="h-11 rounded-xl border border-input px-3 text-sm" placeholder="CVC" />
            </div>
            <input className="w-full h-11 rounded-xl border border-input px-3 text-sm" placeholder="Cardholder name" />
          </section>
        )}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur border-t border-border px-4 py-3">
        <Button onClick={pay} disabled={paying} className="w-full h-12 rounded-xl font-semibold">
          {paying ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
              Securing your booking…
            </span>
          ) : `Pay ${total}৳`}
        </Button>
      </div>
    </MobileShell>
  );
}