import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { salons } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/chats")({ component: Chats });

function Chats() {
  const conversations = salons.slice(0, 5).map((s, i) => ({
    salon: s,
    barber: s.barbers[0],
    last: ["Got it! Tap 'Book now' below.", "See you at 12:30 👍", "We have a free slot at 3pm.", "Sure, I can do that color.", "Thanks for visiting!"][i],
    time: ["now", "5m", "1h", "Yesterday", "2d"][i],
    unread: i < 2 ? i + 1 : 0,
  }));

  return (
    <MobileShell>
      <PageHeader title="Messages" subtitle={`${conversations.length} conversations`} />
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search messages" className="pl-9 h-10 rounded-xl"/>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {conversations.map((c) => (
          <li key={c.barber.id}>
            <Link to="/chat/$barberId" params={{ barberId: c.barber.id }} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40">
              <Avatar hue={c.barber.avatarHue} name={c.barber.name} size={48} src={c.barber.photo}/>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{c.barber.name}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                  {c.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center font-semibold">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.salon.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}