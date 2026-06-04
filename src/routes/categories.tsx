import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, MapPin } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { CATEGORY_META, setCategory } from "@/lib/category";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/mock-data";

export const Route = createFileRoute("/categories")({ component: Categories });

function Categories() {
  const nav = useNavigate();
  const { t } = useT();

  function pick(id: Category) {
    setCategory(id);
    nav({ to: "/home" });
  }

  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-b-3xl">
        <p className="text-xs flex items-center gap-1 opacity-90">
          <MapPin className="h-3 w-3" /> {t("Current location")} · Gulshan 2, Dhaka
        </p>
        <h1 className="text-2xl font-bold mt-2">{t("Choose Your Service Category")}</h1>
        <p className="text-sm opacity-90 mt-1">{t("We'll personalize your marketplace.")}</p>
      </header>

      <div className="px-4 py-5 space-y-3">
        {CATEGORY_META.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              className={cn(
                "group relative w-full text-left rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", c.gradient)} />
              <div className="relative p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-80 group-hover:translate-x-1 transition-transform" />
                </div>
                <h2 className="mt-4 text-lg font-bold">{t(c.label)}</h2>
                <p className="text-xs opacity-90 mt-0.5">{t(c.tagline)}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.slice(0, 4).map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                      {t(s)}
                    </span>
                  ))}
                  {c.services.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">+{c.services.length - 4}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        <p className="text-center text-xs text-muted-foreground pt-2">
          {t("You can switch category any time from the home header.")}
        </p>
      </div>
    </MobileShell>
  );
}