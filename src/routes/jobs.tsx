import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Briefcase, MapPin, BadgeCheck, CalendarDays, Users, Filter,
} from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useJobsStore, POSITIONS, type Position } from "@/lib/jobs-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

function JobsPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const jobs = useJobsStore((s) => s.jobs).filter((j) => j.status === "active");

  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [pos, setPos] = useState<Position | "all">("all");
  const [minSal, setMinSal] = useState<number>(0);
  const [expLvl, setExpLvl] = useState<"any" | "0" | "1" | "3" | "5">("any");
  const [showFilters, setShowFilters] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))),
    [jobs],
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const minE = expLvl === "any" ? -1 : Number(expLvl);
    return jobs.filter((j) => {
      if (ql && !(`${j.title} ${j.salonName} ${j.skills.join(" ")} ${j.position}`.toLowerCase().includes(ql))) return false;
      if (loc && j.location !== loc) return false;
      if (pos !== "all" && j.position !== pos) return false;
      if (minSal && j.salaryMax < minSal) return false;
      if (minE >= 0 && j.experienceYears < minE) return false;
      return true;
    });
  }, [jobs, q, loc, pos, minSal, expLvl]);

  return (
    <MobileShell>
      <PageHeader title={t("Find Jobs")} subtitle={`${filtered.length} ${t("openings")}`} />
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("Search title, salon, skill…")}
            className="pl-9 h-11 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-full"
          >
            <Filter className="h-3.5 w-3.5 mr-1" /> {t("Filters")}
          </Button>
          {(loc || pos !== "all" || minSal > 0 || expLvl !== "any") && (
            <button
              className="text-xs text-muted-foreground underline"
              onClick={() => { setLoc(""); setPos("all"); setMinSal(0); setExpLvl("any"); }}
            >
              {t("Clear")}
            </button>
          )}
        </div>

        {showFilters && (
          <div className="rounded-2xl border border-border bg-card p-3 grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] uppercase text-muted-foreground font-semibold">{t("Location")}</label>
              <Select value={loc || "all"} onValueChange={(v) => setLoc(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder={t("Any location")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Any location")}</SelectItem>
                  {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-semibold">{t("Position")}</label>
              <Select value={pos} onValueChange={(v) => setPos(v as Position | "all")}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All positions")}</SelectItem>
                  {POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-semibold">{t("Experience")}</label>
              <Select value={expLvl} onValueChange={(v) => setExpLvl(v as typeof expLvl)}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("Any level")}</SelectItem>
                  <SelectItem value="0">{t("Fresher")}</SelectItem>
                  <SelectItem value="1">1+ {t("yrs")}</SelectItem>
                  <SelectItem value="3">3+ {t("yrs")}</SelectItem>
                  <SelectItem value="5">5+ {t("yrs")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase text-muted-foreground font-semibold">{t("Min salary (৳)")}</label>
              <Input type="number" className="h-9 mt-1" value={minSal || ""} onChange={(e) => setMinSal(Number(e.target.value) || 0)} placeholder="0" />
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="mt-3 font-semibold">{t("No jobs match")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("Try clearing some filters.")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((j) => (
              <li key={j.id}>
                <Link
                  to="/jobs/$id"
                  params={{ id: j.id }}
                  className="block rounded-2xl border border-border bg-card p-4 hover:border-foreground/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{j.title}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          j.employment === "Full-Time" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : j.employment === "Part-Time" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                          : "bg-violet-500/15 text-violet-600 dark:text-violet-400",
                        )}>{j.employment}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">{j.salonName}</p>
                        {j.salonVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" aria-label="Verified" />}
                      </div>
                      <p className="text-sm font-semibold mt-1.5">{j.salaryMin.toLocaleString()}–{j.salaryMax.toLocaleString()}৳<span className="text-xs text-muted-foreground font-normal"> / {t("month")}</span></p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {j.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {j.vacancies}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3"/> {j.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" className="rounded-full" onClick={(e) => { e.preventDefault(); navigate({ to: "/jobs/$id", params: { id: j.id } }); }}>
                      {t("View & apply")}
                    </Button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}