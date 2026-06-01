import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Store, User } from "lucide-react";
import { useRole } from "@/lib/role";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Owner-only floating toggle: switch between Customer View and Owner Dashboard. */
export function RoleToggle() {
  const { role } = useRole();
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { t } = useT();

  if (role !== "owner") return null;

  // Hide on auth/splash screens
  const path = location.pathname;
  if (path === "/" || path.startsWith("/login")) return null;

  const onOwner = path.startsWith("/owner");
  const view: "customer" | "owner" = onOwner ? "owner" : "customer";

  function go(next: "customer" | "owner") {
    if (next === view) return;
    navigate({ to: next === "owner" ? "/owner" : "/home" });
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <div
        role="group"
        aria-label={t("View mode")}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background/85 backdrop-blur px-1 py-1 shadow-lg shadow-black/5"
      >
        <button
          type="button"
          onClick={() => go("customer")}
          aria-pressed={view === "customer"}
          className={cn(
            "flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition",
            view === "customer" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <User className="h-3 w-3" />
          {t("Customer View")}
        </button>
        <button
          type="button"
          onClick={() => go("owner")}
          aria-pressed={view === "owner"}
          className={cn(
            "flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition",
            view === "owner" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Store className="h-3 w-3" />
          {t("Owner Dashboard")}
        </button>
      </div>
    </div>
  );
}