import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { MapPin, Star, Clock, Phone, MessageCircle, Users, ChevronRight, Navigation, ChevronDown, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { getSalon, type Barber, type Salon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/salons/$id")({
  component: SalonDetails,
  loader: ({ params }) => {
    const salon = getSalon(params.id);
    if (!salon) throw notFound();
    return { salon };
  },
});

function SalonDetails() {
  const { salon } = Route.useLoaderData() as { salon: Salon };
  const nav = useNavigate();
  const [hoursOpen, setHoursOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const { t } = useT();

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("tg.favs") ?? "[]");
      setFav(favs.includes(salon.id));
    } catch { /* ignore */ }
  }, [salon.id]);

  function toggleFav() {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("tg.favs") ?? "[]");
      const next = favs.includes(salon.id) ? favs.filter((s) => s !== salon.id) : [...favs, salon.id];
      localStorage.setItem("tg.favs", JSON.stringify(next));
      setFav(next.includes(salon.id));
      toast.success(next.includes(salon.id) ? t("Added to favorites") : t("Removed from favorites"));
    } catch { /* ignore */ }
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
  const avgRating = salon.rating;
  const bbox = `${salon.lng - 0.005},${salon.lat - 0.003},${salon.lng + 0.005},${salon.lat + 0.003}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${salon.lat},${salon.lng}`;

  return (
    <MobileShell>
      <PageHeader title={salon.name} subtitle={salon.area} back={() => nav({ to: "/home" })} />

      <div className="relative">
        <img src={salon.cover} alt={salon.name} className="h-52 w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => { navigator.share?.({ title: salon.name, url: location.href }).catch(() => {}); toast.success(t("Share link ready")); }}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center"
            aria-label={t("Share")}
          >
            <Share2 className="h-4 w-4"/>
          </button>
          <button
            onClick={toggleFav}
            className={cn(
              "h-10 w-10 rounded-full backdrop-blur border border-border flex items-center justify-center transition",
              fav ? "bg-rose-500 text-white border-rose-500" : "bg-background/80",
            )}
            aria-label={t("Favorite")}
            aria-pressed={fav}
          >
            <Heart className={cn("h-4 w-4", fav && "fill-current")}/>
          </button>
        </div>
      </div>

      <div className="px-4 -mt-10 relative">
        <div className="grid grid-cols-4 gap-2">
          {(salon.photos ?? []).map((p, i) => (
            <img key={i} src={p} alt="" className="h-16 w-full object-cover rounded-xl border-2 border-background" />
          ))}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{salon.name}</h1>
              <Badge className={cn(salon.isOpen ? "bg-emerald-500 hover:bg-emerald-500" : "bg-muted text-muted-foreground")}>
                {salon.isOpen ? t("Open") : t("Closed")}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3"/> {salon.area} · {salon.distance} {t("km away")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold bg-secondary rounded-lg px-2 py-1">
            <Star className="h-4 w-4 fill-accent text-accent"/> {salon.rating}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Badge variant="secondary" className="font-normal"><Clock className="h-3 w-3 mr-1"/> {t("Today")} {salon.hours}</Badge>
          <Badge variant="secondary" className="font-normal"><Users className="h-3 w-3 mr-1"/> {salon.crowd === "low" ? "No wait" : salon.crowd === "medium" ? "~10 min" : "~25 min"}</Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{salon.description}</p>

        <div className="mt-4 flex gap-2">
          <a href={`tel:${salon.phone}`} className="flex-1">
            <Button variant="outline" className="w-full rounded-xl"><Phone className="h-4 w-4 mr-1"/>{t("Call")}</Button>
          </a>
          <a href={`https://www.openstreetmap.org/?mlat=${salon.lat}&mlon=${salon.lng}#map=18/${salon.lat}/${salon.lng}`} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl"><Navigation className="h-4 w-4 mr-1"/>{t("Directions")}</Button>
          </a>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold mb-3">{t("Our team")} ({salon.barbers.length})</h2>
          <div className="space-y-3">
            {salon.barbers.map((b) => <BarberCard key={b.id} barber={b} salonId={salon.id} t={t} />)}
          </div>
        </section>

        {/* Map */}
        <section className="mt-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4"/>{t("Location")}</h2>
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <iframe
              title={t("Salon location")}
              src={mapSrc}
              className="w-full h-48 border-0"
              loading="lazy"
            />
            <div className="p-3 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary"/>
              <p className="text-xs text-muted-foreground flex-1">{salon.address}</p>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${salon.lat},${salon.lng}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary">{t("Open")}</a>
            </div>
          </div>
        </section>

        {/* Opening hours */}
        <section className="mt-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              type="button"
              onClick={() => setHoursOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm"
              aria-expanded={hoursOpen}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4"/> {t("Opening hours")}
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={cn(salon.isOpen ? "text-emerald-600" : "text-destructive", "font-medium")}>
                  {salon.isOpen ? t("Open now") : t("Closed")}
                </span>
                · {t("Today")} {salon.hours}
                <ChevronDown className={cn("h-4 w-4 transition-transform", hoursOpen && "rotate-180")}/>
              </span>
            </button>
            {hoursOpen && (
              <div className="divide-y divide-border border-t border-border">
                {salon.weeklyHours.map((h) => (
                  <div key={h.day} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", h.day === today && "bg-primary/5")}>
                    <span className={cn("font-medium", h.day === today && "text-primary")}>{h.day}{h.day === today && ` · ${t("Today")}`}</span>
                    <span className={cn(h.closed ? "text-destructive" : "text-muted-foreground")}>{h.open}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold mb-3">{t("Popular services")}</h2>
          <div className="space-y-2">
            {salon.barbers[0].services.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.description} · {s.duration} min</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{s.price}৳</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t("Reviews")} ({salon.reviewCount})</h2>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-accent text-accent"/> {avgRating}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory scrollbar-none">
            {salon.reviews.map((r) => (
              <div key={r.id} className="snap-start shrink-0 w-[78%] rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{r.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3 w-3", i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/40")}/>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-4">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function BarberCard({ barber, salonId, t }: { barber: Barber; salonId: string; t: (s: string) => string }) {
  void salonId;
  const dot = barber.status === "free" ? "bg-emerald-500" : barber.status === "busy" ? "bg-rose-500" : "bg-muted-foreground";
  const label = barber.status === "free" ? t("Free now") : barber.status === "busy" ? t("With customer") : t("Offline");

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar hue={barber.avatarHue} name={barber.name} size={52} src={barber.photo} />
          <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-card", dot)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{barber.name}</p>
              <p className="text-xs text-muted-foreground">{barber.designation} · {barber.experience}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <Star className="h-3 w-3 fill-accent text-accent"/> {barber.rating}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {barber.skills.map((sk) => (
              <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{sk}</span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={cn("text-xs font-medium flex items-center gap-1",
              barber.status === "free" ? "text-emerald-600" : barber.status === "busy" ? "text-rose-600" : "text-muted-foreground")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", dot)} /> {label}
            </span>
            <div className="flex gap-1.5">
              <Link to="/chat/$barberId" params={{ barberId: barber.id }}
                className="h-8 px-2.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1 hover:bg-secondary/70">
                <MessageCircle className="h-3.5 w-3.5"/> {t("Chat")}
              </Link>
              <Link to="/book/$barberId" params={{ barberId: barber.id }}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:bg-primary/90 disabled:opacity-50">
                {t("Select")} <ChevronRight className="h-3.5 w-3.5"/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}