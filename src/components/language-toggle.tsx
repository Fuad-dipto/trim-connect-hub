import { useT, type Lang } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating language switch pinned to the top of every page. */
export function LanguageToggle() {
  const { lang, setLang } = useT();
  const opts: { id: Lang; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "bn", label: "বাংলা" },
  ];
  return (
    <div
      className="fixed top-2 right-2 z-[60] pointer-events-none"
      aria-label="Language switcher"
    >
      <div
        role="group"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background/85 backdrop-blur px-1 py-1 shadow-lg shadow-black/5"
      >
        <Languages className="h-3.5 w-3.5 text-muted-foreground ml-1.5" aria-hidden />
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setLang(o.id)}
            aria-pressed={lang === o.id}
            className={cn(
              "px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition",
              lang === o.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}