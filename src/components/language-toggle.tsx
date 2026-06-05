import { useT } from "@/lib/i18n";

/** Floating language switch pinned to the top of every page. */
export function LanguageToggle() {
  const { lang, setLang } = useT();
  const next = lang === "en" ? "bn" : "en";
  const label = lang === "en" ? "EN" : "BN";
  return (
    <div className="fixed top-2 right-2 z-[60] pointer-events-none" aria-label="Language switcher">
      <button
        type="button"
        onClick={() => setLang(next)}
        aria-label={`Switch language to ${next.toUpperCase()}`}
        className="pointer-events-auto h-10 w-10 rounded-full border border-border bg-background/85 backdrop-blur flex items-center justify-center shadow-lg shadow-black/5 text-foreground hover:bg-secondary transition text-[11px] font-bold tracking-wide"
      >
        {label}
      </button>
    </div>
  );
}