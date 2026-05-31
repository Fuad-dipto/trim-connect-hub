import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, QrCode, CheckCircle2, ChevronDown } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { getBarber, paymentMethods, type Barber, type Salon } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Search = { services?: string; service?: string; barber?: string; slot?: string };

export const Route = createFileRoute("/payment")({
  component: Payment,
  validateSearch: (s: Record<string, unknown>): Search => ({
    services: typeof s.services === "string" ? s.services : undefined,
    service: typeof s.service === "string" ? s.service : undefined,
    barber: typeof s.barber === "string" ? s.barber : undefined,
    slot: typeof s.slot === "string" ? s.slot : undefined,
  }),
});

function Payment() {
  const nav = useNavigate();
  const { services: servicesParam, service, barber: barberId, slot } = Route.useSearch();
  const { t } = useT();

  const found = barberId ? getBarber(barberId) : null;
  const barber: Barber | undefined = found?.barber;
  const salon: Salon | undefined = found?.salon;
  const ids = servicesParam ? servicesParam.split(",") : service ? [service] : [];
  const selectedServices = (barber?.services ?? []).filter((s) => ids.includes(s.id));
  const services = selectedServices.length > 0 ? selectedServices : barber?.services.slice(0, 1) ?? [];

  const [method, setMethod] = useState("bkash");
  const [paying, setPaying] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);

  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const fee = 20;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + fee + tax;

  function pay() {
    setPaying(true);
    setTimeout(() => nav({ to: "/booking-success", search: { barber: barberId, services: ids.join(","), slot, method } }), 1600);
  }

  return (
    <MobileShell>
      <PageHeader title={t("Checkout")} subtitle={`${salon?.name ?? t("Salon")} · ${slot ?? ""}`} back={() => history.back()} />

      <div className="px-4 py-4 pb-40 space-y-5">
        <div className="liquid-glass rounded-2xl p-4">
          <p className="text-xs opacity-80">{t("Amount to pay")}</p>
          <p className="text-3xl font-bold mt-1">{total}৳</p>
          <div className="mt-3 text-xs flex items-center gap-1 opacity-90">
            <ShieldCheck className="h-3.5 w-3.5"/> {t("Secured by TrimGo Pay · 256-bit encrypted")}
          </div>
        </div>

        {/* Collapsible order + payment summary */}
        <section className="rounded-2xl bg-card border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{t("Order summary")}</p>
              <p className="text-[11px] text-muted-foreground">{services.length} {services.length !== 1 ? t("services") : t("service")} · {t("with")} {barber?.name}</p>
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")}/>
          </button>
          {summaryOpen && (
            <div className="px-4 pb-4 space-y-1.5 border-t border-border pt-3">
              {services.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.name} <span className="text-[10px]">· {s.duration}{t("min").slice(0,1)}</span></span>
                  <span className="font-medium">{s.price}৳</span>
                </div>
              ))}
              <div className="border-t border-border my-2"/>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Subtotal")}</span><span>{subtotal}৳</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Booking fee")}</span><span>{fee}৳</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("VAT (5%)")}</span><span>{tax}৳</span></div>
              <div className="border-t border-border my-2"/>
              <div className="flex justify-between text-base font-bold"><span>{t("Total")}</span><span>{total}৳</span></div>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-sm mb-2">{t("Choose payment method")}</h2>
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
                    <p className="text-[11px] text-muted-foreground">{p.id === "cash" ? t("Pay when you arrive") : t("Instant transfer")}</p>
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
            <p className="text-xs text-muted-foreground mb-3">{t("Scan with your")} {paymentMethods.find(p => p.id === method)?.name} {t("app")}</p>
            <div className="mx-auto h-40 w-40 rounded-xl bg-foreground p-3 grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={cn("rounded-[1px]", Math.random() > 0.5 ? "bg-background" : "bg-foreground")}/>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1"><QrCode className="h-3 w-3"/> {t("QR refreshes every 60s")}</p>
          </section>
        )}

        {method === "card" && (
          <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <input className="w-full h-11 rounded-xl border border-input px-3 text-sm" placeholder={t("Card number")} />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-11 rounded-xl border border-input px-3 text-sm" placeholder="MM / YY" />
              <input className="h-11 rounded-xl border border-input px-3 text-sm" placeholder="CVC" />
            </div>
            <input className="w-full h-11 rounded-xl border border-input px-3 text-sm" placeholder={t("Cardholder name")} />
          </section>
        )}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur border-t border-border px-4 py-3 z-30">
        <Button onClick={pay} disabled={paying} className="liquid-glass w-full h-12 rounded-xl font-semibold">
          {paying ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
              {t("Securing your booking…")}
            </span>
          ) : `${t("Pay")} ${total}৳`}
        </Button>
      </div>
    </MobileShell>
  );
}