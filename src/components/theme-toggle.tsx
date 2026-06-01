import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n";

/** Floating theme switch pinned to the top of every page. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const dark = theme === "dark";
  return (
    <div className="fixed top-2 right-[7.5rem] z-[60] pointer-events-none">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={dark}
        aria-label={t("Toggle theme")}
        className="pointer-events-auto h-7 w-7 rounded-full border border-border bg-background/85 backdrop-blur flex items-center justify-center shadow-lg shadow-black/5 text-foreground hover:bg-secondary transition"
      >
        {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}