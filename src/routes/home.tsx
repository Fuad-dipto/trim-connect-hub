import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal, Star, Users, Bell, Map, Home as HomeIcon, Image as ImageIcon, X } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { salons, type Salon } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { CATEGORY_META, setCategory, useCategory } from "@/lib/category";
import { useNavigate } from "@tanstack/react-router";
import type { Category } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({ component: Home });

const quickFilters = [
  { id: "all", label: "All", range: [100, 2000] as [number, number] },
  { id: "low", label: "Low Cost", sub: "100–500৳", range: [100, 500] as [number, number] },
  { id: "med", label: "Medium", sub: "500–1000৳", range: [500, 1000] as [number, number] },
  { id: "prem", label: "Premium", sub: "1000–2000৳", range: [1000, 2000] as [number, number] },
];

const sortOptions = [
  { id: "nearest", label: "Nearest" },
  { id: "rating", label: "Top rated" },
  { id: "low", label: "Lowest price" },
  { id: "high", label: "Highest price" },
  { id: "pop", label: "Most popular" },
];

function Home() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("nearest");
  const [view, setView] = useState<"list" | "map">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState("all");
  const [draftSort, setDraftSort] = useState("nearest");
  const { t } = useT();
  const category = useCategory();
  const nav = useNavigate();

  useEffect(() => {
    if (!category) nav({ to: "/categories", replace: true });
  }, [category, nav]);

  const activeMeta = category ? CATEGORY_META.find((c) => c.id === category) : null;

  const filtered = useMemo(() => {
    const f = quickFilters.find((x) => x.id === filter)!;
    const [lo, hi] = f.range;
    let r = salons.filter((s) =>
      (!category || s.category === category) &&
      s.priceMin <= hi && s.priceMax >= lo &&
      (q.trim() === "" || (s.name + s.area).toLowerCase().includes(q.toLowerCase()))
    );
    r = [...r].sort((a, b) => {
      if (sort === "nearest") return a.distance - b.distance;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "low") return a.priceMin - b.priceMin;
      if (sort === "high") return b.priceMax - a.priceMax;
      return b.reviewCount - a.reviewCount;
    });
    return r;
  }, [q, filter, sort, category]);

  function openFilters() {
    setDraftFilter(filter);
    setDraftSort(sort);
    setFilterOpen(true);
  }
  function applyFilters() {
    setFilter(draftFilter);
    setSort(draftSort);
    setFilterOpen(false);
  }

  const activeFilterLabel = quickFilters.find((f) => f.id === filter)?.label ?? "All";
  const activeSortLabel = sortOptions.find((o) => o.id === sort)?.label ?? "Nearest";

  return (
    <MobileShell>
      <header className="px-4 pt-5 pb-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-b-3xl shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs flex items-center gap-1 opacity-90"><MapPin className="h-3 w-3"/> {t("Current location")}</p>
            <p className="font-semibold text-sm">Gulshan 2, Dhaka</p>
          </div>
          <button aria-label="Notifications" className="relative h-10 w-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t("Search salons, barbers, services")}
            className="pl-9 h-11 rounded-xl bg-white text-foreground border-0 placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">{t("Who are we serving?")}</h2>
          <button onClick={() => setView(view === "list" ? "map" : "list")} className="text-xs flex items-center gap-1 text-primary font-medium">
            <Map className="h-3.5 w-3.5"/> {view === "list" ? t("Map view") : t("List view")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_META.map((c) => {
            const Icon = c.icon;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id as Category)}
                className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden border text-left transition-all",
                  active ? "border-primary shadow-lg shadow-primary/30 -translate-y-0.5" : "border-border hover:border-primary/40",
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br", c.gradient, active ? "opacity-100" : "opacity-90")} />
                <div className="relative h-full w-full p-2.5 flex flex-col justify-between text-white">
                  <div className="h-8 w-8 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold leading-tight">{t(c.label)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={openFilters}
            className="flex-1 flex items-center justify-between gap-2 h-11 px-4 rounded-xl bg-card border border-border hover:border-primary/40 transition text-left"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              {t("Filters")}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {t(activeFilterLabel)} · {t(activeSortLabel)}
            </span>
          </button>
        </div>
      </div>

      {view === "map" ? <MapView salons={filtered} t={t} /> : (
        <section className="px-4 mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{activeMeta ? t(activeMeta.label) : t("Nearby salons")}</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} {t("found")}</span>
          </div>
          {filtered.map((s) => <SalonCard key={s.id} salon={s} t={t} />)}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              {t("No providers match these filters yet.")}
            </div>
          )}
        </section>
      )}

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="top"
          className="rounded-b-3xl border-b max-h-[85vh] overflow-y-auto p-0 [&>button]:hidden"
        >
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border">
            <SheetTitle className="text-base">{t("Filters")}</SheetTitle>
            <button
              onClick={() => setFilterOpen(false)}
              aria-label="Close"
              className="h-9 w-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">{t("Price range")}</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDraftFilter(f.id)}
                    className={cn(
                      "px-3 py-3 rounded-xl border text-left transition",
                      draftFilter === f.id
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30"
                        : "bg-card border-border hover:border-primary/40",
                    )}
                  >
                    <div className="text-sm font-medium">{t(f.label)}</div>
                    {f.sub && <div className="opacity-70 text-[11px] mt-0.5">{f.sub}</div>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">{t("Sort by")}</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setDraftSort(o.id)}
                    className={cn(
                      "px-3 py-2 rounded-full text-xs border transition",
                      draftSort === o.id
                        ? "bg-foreground text-background border-foreground"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {t(o.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background border-t border-border px-5 py-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { setDraftFilter("all"); setDraftSort("nearest"); }}
            >
              {t("Reset")}
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              {t("Apply filters")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </MobileShell>
  );
}

function SalonCard({ salon, t }: { salon: Salon; t: (s: string) => string }) {
  return (
    <Link to="/salons/$id" params={{ id: salon.id }} className="block group">
      <div className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition">
        <div className="relative h-32">
          <img src={salon.cover} alt={salon.name} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className={cn("text-[10px]", salon.isOpen ? "bg-emerald-500 hover:bg-emerald-500" : "bg-muted text-muted-foreground hover:bg-muted")}>
              {salon.isOpen ? t("Open now") : t("Closed")}
            </Badge>
            {salon.category === "home" ? (
              <Badge variant="secondary" className="text-[10px] bg-white/90 text-foreground">
                <HomeIcon className="h-3 w-3 mr-1"/> {t("Visits home")}
              </Badge>
            ) : (salon.category === "bridal" || salon.category === "wedding") ? (
              <Badge variant="secondary" className="text-[10px] bg-white/90 text-foreground">
                <ImageIcon className="h-3 w-3 mr-1"/> {t("Portfolio")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] bg-white/90 text-foreground">
                <Users className="h-3 w-3 mr-1"/> {salon.crowd === "low" ? t("No wait") : salon.crowd === "medium" ? t("Few in queue") : t("Busy queue")}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur text-white text-[11px] px-2 py-0.5 rounded-full">
            {salon.category === "home" ? t("On-demand") : `${salon.distance} km`}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{salon.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{salon.area}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold shrink-0">
              <Star className="h-3.5 w-3.5 fill-accent text-accent"/> {salon.rating}
              <span className="text-muted-foreground font-normal">({salon.reviewCount})</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {t("From")} <b className="text-foreground">{salon.priceMin}৳</b>
              {salon.travelCharge ? <> · {t("travel")} {salon.travelCharge}৳</> : <> · {t("up to")} {salon.priceMax}৳</>}
            </span>
            <span className="text-xs font-semibold text-primary">{t("Book →")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MapView({ salons, t }: { salons: Salon[]; t: (s: string) => string }) {
  return (
    <div className="mx-4 mt-5 rounded-2xl overflow-hidden border border-border relative h-[420px] bg-secondary">
      <div className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(oklch(0.92 0.012 280) 1px, transparent 1px), linear-gradient(90deg, oklch(0.92 0.012 280) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/30" />
      </div>
      {salons.slice(0, 8).map((s, i) => {
        const angle = (i / Math.max(salons.length, 1)) * Math.PI * 2;
        const r = 30 + (s.distance / 6) * 50;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return (
          <Link key={s.id} to="/salons/$id" params={{ id: s.id }}
            className="absolute -translate-x-1/2 -translate-y-full z-20"
            style={{ left: `${x}%`, top: `${y}%` }}>
            <div className="rounded-full bg-card border border-border shadow-lg px-2 py-1 text-[10px] font-semibold whitespace-nowrap flex items-center gap-1">
              <Avatar hue={s.hue} name={s.name} size={18} /> {s.priceMin}৳
            </div>
            <div className="h-2 w-2 rounded-full bg-primary mx-auto -mt-0.5" />
          </Link>
        );
      })}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1 rounded-full text-[11px] shadow">
        {t("Showing")} {salons.length} {t("salons near you")}
      </div>
    </div>
  );
}