import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Calendar, MapPin, X, Navigation } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { getBarber, paymentMethods, type Barber, type Salon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

type Search = { barber?: string; service?: string; services?: string; slot?: string; method?: string };

export const Route = createFileRoute("/booking-success")({
  component: Success,
  validateSearch: (s: Record<string, unknown>): Search => ({
    barber: typeof s.barber === "string" ? s.barber : undefined,
    service: typeof s.service === "string" ? s.service : undefined,
    services: typeof s.services === "string" ? s.services : undefined,
    slot: typeof s.slot === "string" ? s.slot : undefined,
    method: typeof s.method === "string" ? s.method : undefined,
  }),
});

function Success() {
  const { barber: barberId, service, services: servicesParam, slot, method } = Route.useSearch();
  const { t } = useT();
  const found = barberId ? getBarber(barberId) : null;
  const barber: Barber | undefined = found?.barber;
  const salon: Salon | undefined = found?.salon;
  const ids = servicesParam ? servicesParam.split(",") : service ? [service] : [];
  const svcs = (barber?.services ?? []).filter((s) => ids.includes(s.id));
  const list = svcs.length > 0 ? svcs : barber?.services.slice(0, 1) ?? [];
  const subtotal = list.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = subtotal + 20 + Math.round(subtotal * 0.05);
  const pm = paymentMethods.find((p) => p.id === method);
  const bookingId = "TG-" + Math.floor(10000 + Math.random() * 89999);

  return (
    <MobileShell>
      <div className="px-5 pt-10 pb-6 text-center">
        <div className="mx-auto relative h-24 w-24 mb-4">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="relative h-full w-full rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5}/>
          </div>
        </div>
        <h1 className="text-2xl font-bold">{t("Seat Reserved!")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("Your booking is confirmed. We can't wait to see you.")}</p>
      </div>

      <div className="px-4">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">{t("Booking ID")}</p>
              <p className="font-bold text-lg">{bookingId}</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/20">{t("CONFIRMED")}</span>
          </div>

          <div className="p-4 space-y-4">
            {barber && (
              <div className="flex items-center gap-3">
                <Avatar hue={barber.avatarHue} name={barber.name} size={48} src={barber.photo} />
                <div>
                  <p className="font-semibold">{barber.name}</p>
                  <p className="text-xs text-muted-foreground">{barber.designation} · {salon?.name}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Info icon={<Calendar className="h-4 w-4"/>} label={t("Today")} value={slot ?? "—"} />
              <Info icon={<MapPin className="h-4 w-4"/>} label={t("Location")} value={salon?.area ?? "—"} />
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">{list.map((s) => s.name).join(", ")}</p>
                <p className="text-xs text-muted-foreground">{t("Paid via")} {pm?.name ?? "—"}</p>
              </div>
              <p className="font-bold text-lg">{totalAmount}৳</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-secondary/60 border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">{t("Your queue position")}</p>
          <p className="text-3xl font-bold mt-1">#2</p>
          <p className="text-xs text-muted-foreground mt-1">{t("Estimated wait")}: ~18 {t("minutes")}</p>
          <div className="mt-3 h-2 rounded-full bg-background overflow-hidden">
            <div className="h-full w-1/3 bg-primary"/>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-xl h-12"><X className="h-4 w-4 mr-1"/>{t("Cancel")}</Button>
          <Button className="rounded-xl h-12"><Navigation className="h-4 w-4 mr-1"/>{t("Navigate")}</Button>
        </div>

        <Link to="/home" className="block text-center text-sm text-muted-foreground mt-5 mb-4">{t("Back to home")}</Link>
      </div>
    </MobileShell>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">{icon}{label}</p>
      <p className="font-semibold text-sm mt-1">{value}</p>
    </div>
  );
}