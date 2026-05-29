import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, MessageCircle, Navigation, CalendarClock, X, RotateCcw, Star, Receipt } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { salons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({ component: Bookings });

type Booking = {
  salon: typeof salons[number];
  barber: typeof salons[number]["barbers"][number];
  time: string;
  svc: string;
  id: string;
  status: string;
  serviceIds: string[];
  method: string;
};

function Bookings() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelled, setCancelled] = useState<string[]>([]);

  const upcoming: Booking[] = [
    { salon: salons[0], barber: salons[0].barbers[0], time: "Today · 12:30 PM", svc: "Classic Haircut + Beard Trim", id: "TG-88241", status: "Confirmed", serviceIds: ["s1", "s2"], method: "bkash" },
    { salon: salons[4], barber: salons[4].barbers[0], time: "Tomorrow · 4:00 PM", svc: "Fade & Beard", id: "TG-88311", status: "Confirmed", serviceIds: ["s1", "s2"], method: "nagad" },
  ].filter((b) => !cancelled.includes(b.id));

  const past: Booking[] = [
    { salon: salons[1], barber: salons[1].barbers[0], time: "May 22 · 11:00 AM", svc: "Royal Shave", id: "TG-87102", status: "Completed", serviceIds: ["s6"], method: "card" },
    { salon: salons[2], barber: salons[2].barbers[0], time: "May 15 · 9:30 AM", svc: "Kids Cut", id: "TG-86411", status: "Completed", serviceIds: ["s5"], method: "cash" },
  ];

  return (
    <MobileShell>
      <PageHeader title="My bookings" subtitle="Manage your appointments" />
      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 rounded-xl bg-secondary p-1 text-sm font-medium">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "h-9 rounded-lg capitalize transition",
                tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground",
              )}
            >
              {t} ({t === "upcoming" ? upcoming.length : past.length})
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        {(tab === "upcoming" ? upcoming : past).map((b) => (
          <BCard
            key={b.id}
            booking={b}
            isPast={tab === "past"}
            onCancel={() => { setCancelled((c) => [...c, b.id]); toast.success("Booking cancelled. Refund issued."); }}
          />
        ))}
        {tab === "upcoming" && upcoming.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
            <Link to="/home"><Button className="mt-3 liquid-glass">Book a salon</Button></Link>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function BCard({ booking, isPast, onCancel }: { booking: Booking; isPast: boolean; onCancel: () => void }) {
  const { salon, barber, time, svc, id, status, serviceIds, method } = booking;
  const slot = time.split("·")[1]?.trim() ?? time;
  const receiptSearch = { barber: barber.id, services: serviceIds.join(","), slot, method };
  return (
    <div className="rounded-2xl bg-card border border-border p-3.5 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar hue={barber.avatarHue} name={barber.name} size={48} src={barber.photo} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">{svc}</p>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full",
              isPast ? "bg-secondary text-muted-foreground" : "bg-emerald-500/15 text-emerald-600",
            )}>{status}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{barber.name} · {salon.name}</p>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{time}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{salon.area}</span>
            <span className="ml-auto">#{id}</span>
          </div>
        </div>
      </div>

      {!isPast ? (
        <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-border">
          <Link to="/booking-success" search={receiptSearch} className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-secondary/60 text-[10px] font-medium">
            <Receipt className="h-4 w-4 text-primary"/>Receipt
          </Link>
          <Link to="/chat/$barberId" params={{ barberId: barber.id }} className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-secondary/60 text-[10px] font-medium">
            <MessageCircle className="h-4 w-4 text-primary"/>Chat
          </Link>
          <button
            onClick={() => toast.info("Reschedule flow opening soon.")}
            className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-secondary/60 text-[10px] font-medium"
          >
            <CalendarClock className="h-4 w-4 text-primary"/>Reschedule
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${salon.lat},${salon.lng}`}
            target="_blank" rel="noreferrer"
            className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-secondary/60 text-[10px] font-medium"
          >
            <Navigation className="h-4 w-4 text-primary"/>Directions
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-destructive/10 text-[10px] font-medium text-destructive">
                <X className="h-4 w-4"/>Cancel
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel booking {id}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your appointment with {barber.name} at {salon.name} on {time} will be cancelled. Booking fee will be refunded.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep booking</AlertDialogCancel>
                <AlertDialogAction onClick={onCancel} className="bg-destructive hover:bg-destructive/90">Cancel booking</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-border">
          <Link to="/booking-success" search={receiptSearch} className="flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-secondary/60 text-xs font-medium">
            <Receipt className="h-4 w-4 text-primary"/>Receipt
          </Link>
          <button onClick={() => toast.success("Thanks for rating!")} className="flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-secondary/60 text-xs font-medium">
            <Star className="h-4 w-4 text-accent"/>Rate
          </button>
          <Link to="/book/$barberId" params={{ barberId: barber.id }} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5"/>Book again
          </Link>
        </div>
      )}
    </div>
  );
}