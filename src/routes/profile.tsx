import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { ChevronRight, Heart, CreditCard, MapPin, Bell, HelpCircle, LogOut, Store, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const [favCount, setFavCount] = useState(4);
  const { t } = useT();
  const { role } = useRole();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("tg.favs") ?? "[]");
      setFavCount(favs.length);
    } catch { /* ignore */ }
  }, []);

  const items: { icon: typeof Heart; label: string; toggle?: boolean; onClick?: () => void; active?: boolean }[] = [
    { icon: Heart, label: t("Favorite salons") },
    { icon: CreditCard, label: t("Payment methods") },
    { icon: MapPin, label: t("Saved addresses") },
    { icon: Bell, label: t("Notifications") },
    { icon: Moon, label: t("Dark mode"), toggle: true, onClick: toggle, active: dark },
    { icon: HelpCircle, label: t("Help & support") },
  ];

  return (
    <MobileShell>
      <PageHeader title={t("Profile")} />
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 flex items-center gap-3">
          <Avatar hue={285} name="Anika R" size={56}/>
          <div className="flex-1">
            <p className="font-bold">Anika Rahman</p>
            <p className="text-xs opacity-90">+880 1712 345 678</p>
          </div>
          <button className="text-xs underline">{t("Edit")}</button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["12", t("Bookings")], [String(favCount), t("Favorites")], ["4.8", t("Rating")]].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-card border border-border p-3 text-center">
              <p className="font-bold text-lg">{v}</p>
              <p className="text-[11px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        {role === "owner" && (
          <Link to="/owner" className="mt-4 block rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
            <Store className="h-5 w-5 text-primary"/>
            <div className="flex-1">
              <p className="font-semibold text-sm">{t("Own a salon?")}</p>
              <p className="text-xs text-muted-foreground">{t("Switch to owner dashboard")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground"/>
          </Link>
        )}

        <ul className="mt-4 rounded-2xl bg-card border border-border overflow-hidden">
          {items.map(({ icon: Icon, label, toggle, onClick, active }) => (
            <li key={label}>
              <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 border-b border-border last:border-0">
                <Icon className="h-4 w-4 text-muted-foreground"/>
                <span className="flex-1 text-sm text-left">{label}</span>
                {toggle ? (
                  <span className={cn("h-5 w-9 rounded-full flex items-center px-0.5 transition-colors", active ? "bg-primary justify-end" : "bg-muted")}>
                    <span className="h-4 w-4 rounded-full bg-card shadow"/>
                  </span>
                ) : <ChevronRight className="h-4 w-4 text-muted-foreground"/>}
              </button>
            </li>
          ))}
        </ul>

        <button className="mt-4 w-full rounded-xl border border-border bg-card py-3 text-sm font-medium text-destructive flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4"/> {t("Sign out")}
        </button>
      </div>
    </MobileShell>
  );
}