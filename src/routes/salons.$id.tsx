import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { MapPin, Star, Clock, Phone, MessageCircle, Users, ChevronRight } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { GradientBlob, Avatar } from "@/components/brand";
import { getSalon, type Barber, type Salon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/salons/$id")({
  component: SalonDetails,
  loader: ({ params }) => {
    const salon = getSalon(params.id);
    if (!salon) throw notFound();
    return { salon };
  },
});

function SalonDetails() {
  const { salon } = Route.useLoaderData() as { salon: Salon };
  const nav = useNavigate();

  return (
    <MobileShell>
      <PageHeader title={salon.name} subtitle={salon.area} back={() => nav({ to: "/home" })} />

      <div className="relative">
        <GradientBlob hue={salon.hue} className="h-52 w-full" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="px-4 -mt-10 relative">
        <div className="grid grid-cols-4 gap-2">
          {salon.gallery.map((h, i) => (
            <GradientBlob key={i} hue={h} className="h-16 rounded-xl border-2 border-background" />
          ))}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{salon.name}</h1>
              <Badge className={cn(salon.isOpen ? "bg-emerald-500 hover:bg-emerald-500" : "bg-muted text-muted-foreground")}>
                {salon.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3"/> {salon.area} · {salon.distance} km away
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold bg-secondary rounded-lg px-2 py-1">
            <Star className="h-4 w-4 fill-accent text-accent"/> {salon.rating}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Badge variant="secondary" className="font-normal"><Clock className="h-3 w-3 mr-1"/> {salon.hours}</Badge>
          <Badge variant="secondary" className="font-normal"><Users className="h-3 w-3 mr-1"/> {salon.crowd === "low" ? "No wait" : salon.crowd === "medium" ? "~10 min" : "~25 min"}</Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{salon.description}</p>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl"><Phone className="h-4 w-4 mr-1"/>Call</Button>
          <Button variant="outline" className="flex-1 rounded-xl"><MapPin className="h-4 w-4 mr-1"/>Directions</Button>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold mb-3">Our team ({salon.barbers.length})</h2>
          <div className="space-y-3">
            {salon.barbers.map((b) => <BarberCard key={b.id} barber={b} salonId={salon.id} />)}
          </div>
        </section>

        <section className="mt-6 mb-6">
          <h2 className="font-semibold mb-3">Popular services</h2>
          <div className="space-y-2">
            {salon.barbers[0].services.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.description} · {s.duration} min</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{s.price}৳</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function BarberCard({ barber, salonId }: { barber: Barber; salonId: string }) {
  const dot = barber.status === "free" ? "bg-emerald-500" : barber.status === "busy" ? "bg-rose-500" : "bg-muted-foreground";
  const label = barber.status === "free" ? "Free now" : barber.status === "busy" ? "With customer" : "Offline";

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar hue={barber.avatarHue} name={barber.name} size={52} />
          <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-card", dot)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{barber.name}</p>
              <p className="text-xs text-muted-foreground">{barber.designation} · {barber.experience}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <Star className="h-3 w-3 fill-accent text-accent"/> {barber.rating}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {barber.skills.map((sk) => (
              <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{sk}</span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={cn("text-xs font-medium flex items-center gap-1",
              barber.status === "free" ? "text-emerald-600" : barber.status === "busy" ? "text-rose-600" : "text-muted-foreground")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", dot)} /> {label}
            </span>
            <div className="flex gap-1.5">
              <Link to="/chat/$barberId" params={{ barberId: barber.id }}
                className="h-8 px-2.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1 hover:bg-secondary/70">
                <MessageCircle className="h-3.5 w-3.5"/> Chat
              </Link>
              <Link to="/book/$barberId" params={{ barberId: barber.id }}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:bg-primary/90 disabled:opacity-50">
                Select <ChevronRight className="h-3.5 w-3.5"/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}