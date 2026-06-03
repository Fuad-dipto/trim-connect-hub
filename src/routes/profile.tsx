import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { ChevronRight, Heart, CreditCard, Bell, HelpCircle, LogOut, Store, Moon, Calendar, Settings as SettingsIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const [favCount, setFavCount] = useState(4);
  const { t } = useT();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("tg.favs") ?? "[]");
      setFavCount(favs.length);
    } catch { /* ignore */ }
  }, []);

  const items: { icon: typeof Heart; label: string; toggle?: boolean; onClick?: () => void; active?: boolean }[] = [
    { icon: Calendar, label: t("My Bookings") },
    { icon: CreditCard, label: t("Payment History") },
    { icon: Heart, label: t("Saved Salons") },
    { icon: Bell, label: t("Notifications") },
    { icon: SettingsIcon, label: t("Settings") },
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

        <Link
          to="/owner-portal"
          className="mt-4 block rounded-2xl bg-gradient-to-br from-foreground via-foreground to-foreground/85 text-background p-4 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl"/>
          <div className="relative flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-background/15 backdrop-blur flex items-center justify-center">
              <Store className="h-5 w-5"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm">{t("Owner Portal")}</p>
                <ShieldCheck className="h-3.5 w-3.5 opacity-80"/>
              </div>
              <p className="text-[11px] opacity-80">{t("Manage bookings, staff, services & revenue")}</p>
            </div>
            <ArrowRight className="h-4 w-4"/>
          </div>
        </Link>

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