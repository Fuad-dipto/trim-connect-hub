import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal, Star, Users, Bell, Map, Home as HomeIcon, Image as ImageIcon, X, Moon, Sun, ChevronDown, Locate, Check } from "lucide-react";
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
import { useTheme } from "@/lib/theme";
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

const DHAKA_AREAS = [
  "Gulshan 1, Dhaka",
  "Gulshan 2, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Mirpur, Dhaka",
  "Uttara, Dhaka",
  "Bashundhara R/A, Dhaka",
  "Mohammadpur, Dhaka",
  "Motijheel, Dhaka",
  "Old Dhaka",
];

const INSTITUTIONS = [
  { id: "i1", name: "Gents Care Studio", segment: "Male Grooming", category: "male" as Category, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=60" },
  { id: "i2", name: "Lavender Lounge", segment: "Female Beauty", category: "female" as Category, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=60" },
  { id: "i3", name: "HomeGlow", segment: "Home Service", category: "home" as Category, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=60" },
  { id: "i4", name: "Bridal Bliss", segment: "Bridal", category: "bridal" as Category, image: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=200&auto=format&fit=crop&q=60" },
  { id: "i5", name: "Wedding Lens BD", segment: "Wedding", category: "wedding" as Category, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&auto=format&fit=crop&q=60" },
  { id: "i6", name: "Family Care Hub", segment: "Family", category: "home" as Category, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=60" },
];

function HeaderActions() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang } = useT();
  const dark = theme === "dark";
  const nextLang = lang === "en" ? "bn" : "en";
  const langLabel = lang === "en" ? "EN" : "BN";
  return (
    <div className="flex items-center gap-1.5">
      <button aria-label="Notifications" className="relative h-8 w-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={dark}
        aria-label="Toggle theme"
        className="h-8 w-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
      >
        {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => setLang(nextLang)}
        aria-label={`Switch language to ${nextLang.toUpperCase()}`}
        className="h-8 w-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition text-[10px] font-bold tracking-wide"
      >
        {langLabel}
      </button>
    </div>
  );
}
function Home() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("nearest");
  const [view, setView] = useState<"list" | "map">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState("all");
  const [draftSort, setDraftSort] = useState("nearest");
  const [location, setLocation] = useState("Gulshan 2, Dhaka");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locating, setLocating] = useState(false);
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

  function useCurrentLocation() {
    setLocating(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Current location · Dhaka");
          setLocating(false);
          setLocationOpen(false);
        },
        () => {
          setLocation("Current location · Dhaka");
          setLocating(false);
          setLocationOpen(false);
        },
        { timeout: 5000 },
      );
    } else {
      setLocation("Current location · Dhaka");
      setLocating(false);
      setLocationOpen(false);
    }
  }

  return (
    <MobileShell>
      <header className="px-4 pt-5 pb-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-b-3xl shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="text-left rounded-xl px-2 -mx-2 py-1 hover:bg-white/10 active:bg-white/15 transition"
          >
            <p className="text-[11px] flex items-center gap-1 opacity-90"><MapPin className="h-3 w-3"/> {t("Current location")}</p>
            <p className="font-semibold text-sm flex items-center gap-1">
              {location} <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </p>
          </button>
          <HeaderActions />
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
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-semibold text-sm">{t("Who are we serving?")}</h2>
          <button onClick={() => setView(view === "list" ? "map" : "list")} className="text-xs flex items-center gap-1 text-primary font-medium">
            <Map className="h-3.5 w-3.5"/> {view === "list" ? t("Map view") : t("List view")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_META.map((c) => {
            const Icon = c.icon;
            const active = category === c.id;
            const img = CATEGORY_IMAGES[c.id];
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id as Category)}
                className={cn(
                  "group relative aspect-[4/5] rounded-2xl overflow-hidden border text-left transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20",
                  active ? "border-primary shadow-lg shadow-primary/30 -translate-y-0.5" : "border-border hover:border-primary/50",
                )}
              >
                {img && (
                  <img
                    src={img}
                    alt={c.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br mix-blend-multiply transition-opacity duration-300",
                  c.gradient,
                  active ? "opacity-80" : "opacity-70 group-hover:opacity-60",
                )} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="relative h-full w-full p-2 flex flex-col justify-between text-white">
                  <div className="h-7 w-7 rounded-lg bg-white/25 backdrop-blur flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-semibold leading-tight drop-shadow">{t(c.label)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={openFilters}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-card border border-border hover:border-primary/50 hover:text-primary transition text-xs font-medium"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t("Filters")}
            <span className="text-[10px] text-muted-foreground ml-0.5">· {t(activeFilterLabel)} · {t(activeSortLabel)}</span>
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
          side="bottom"
          className="rounded-t-3xl border-t max-h-[85vh] overflow-y-auto p-0 [&>button]:hidden"
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

      <Sheet open={locationOpen} onOpenChange={setLocationOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t max-h-[80vh] overflow-y-auto p-0 [&>button]:hidden"
        >
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border">
            <SheetTitle className="text-base">{t("Choose location")}</SheetTitle>
            <button
              onClick={() => setLocationOpen(false)}
              aria-label="Close"
              className="h-9 w-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-5 space-y-4">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition text-left disabled:opacity-60"
            >
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Locate className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{locating ? t("Locating…") : t("Use current location")}</p>
                <p className="text-[11px] text-muted-foreground">{t("We'll detect your position via GPS")}</p>
              </div>
            </button>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("Select manually")}</h3>
              <div className="space-y-1">
                {DHAKA_AREAS.map((a) => {
                  const selected = a === location;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setLocation(a); setLocationOpen(false); }}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition text-left",
                        selected ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 opacity-70" /> {a}
                      </span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
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