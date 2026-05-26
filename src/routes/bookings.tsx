import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { salons } from "@/lib/mock-data";

export const Route = createFileRoute("/bookings")({ component: Bookings });

function Bookings() {
  const upcoming = [
    { salon: salons[0], barber: salons[0].barbers[0], time: "Today · 12:30 PM", svc: "Classic Haircut", id: "TG-88241", status: "Confirmed" },
    { salon: salons[4], barber: salons[4].barbers[0], time: "Tomorrow · 4:00 PM", svc: "Fade & Beard", id: "TG-88311", status: "Confirmed" },
  ];
  const past = [
    { salon: salons[1], barber: salons[1].barbers[0], time: "May 22 · 11:00 AM", svc: "Royal Shave", id: "TG-87102", status: "Completed" },
    { salon: salons[2], barber: salons[2].barbers[0], time: "May 15 · 9:30 AM", svc: "Kids Cut", id: "TG-86411", status: "Completed" },
  ];

  return (
    <MobileShell>
      <PageHeader title="My bookings" subtitle="Upcoming & history" />
      <div className="px-4 py-4 space-y-6">
        <section>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.map((b) => <BCard key={b.id} {...b} accent="primary" />)}
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Past</h2>
          <div className="space-y-2">
            {past.map((b) => <BCard key={b.id} {...b} accent="muted" />)}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

type CardProps = { salon: typeof salons[number]; barber: typeof salons[number]["barbers"][number]; time: string; svc: string; id: string; status: string; accent: "primary" | "muted" };

function BCard({ salon, barber, time, svc, status, accent }: CardProps) {
  return (
    <Link to="/salons/$id" params={{ id: salon.id }} className="block">
      <div className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3">
        <Avatar hue={barber.avatarHue} name={barber.name} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">{svc}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{status}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{barber.name} · {salon.name}</p>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{time}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{salon.area}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}