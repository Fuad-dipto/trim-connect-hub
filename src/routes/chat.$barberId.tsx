import { createFileRoute, useNavigate, notFound, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Phone, Video, Smile, Paperclip, CheckCheck, Calendar } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Avatar } from "@/components/brand";
import { getBarber, type Barber, type Salon } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$barberId")({
  component: ChatPage,
  loader: ({ params }) => {
    const r = getBarber(params.barberId);
    if (!r) throw notFound();
    return r;
  },
});

type Msg = { id: string; from: "me" | "them"; text: string; time: string; read?: boolean };

function ChatPage() {
  const data = Route.useLoaderData() as { salon: Salon; barber: Barber };
  const { barber, salon } = data;
  const nav = useNavigate();

  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", from: "them", text: `Hello! Thanks for reaching out to ${salon.name} 👋`, time: "10:42", read: true },
    { id: "2", from: "them", text: `I'm ${barber.name}. How can I help you today?`, time: "10:42", read: true },
    { id: "3", from: "me", text: "Hi! Are you available for a haircut around 12:30 today?", time: "10:43", read: true },
    { id: "4", from: "them", text: "Yes, 12:30 works! It'll take about 30 minutes. Want me to hold the slot?", time: "10:44", read: true },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs, typing]);

  function send() {
    if (!text.trim()) return;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs((m) => [...m, { id: String(Date.now()), from: "me", text: text.trim(), time: t, read: false }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, {
        id: String(Date.now() + 1), from: "them",
        text: "Got it! Tap 'Book now' below to lock in the slot.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true,
      }]);
    }, 1600);
  }

  return (
    <MobileShell>
      <PageHeader
        back={() => nav({ to: "/salons/$id", params: { id: salon.id } })}
        title={barber.name}
        subtitle={barber.status === "free" ? "Online · typically replies in minutes" : "Online"}
        right={
          <div className="flex gap-1">
            <button className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center"><Phone className="h-4 w-4"/></button>
            <button className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center"><Video className="h-4 w-4"/></button>
          </div>
        }
      />

      <div className="px-4 py-3 border-b border-border bg-secondary/40 flex items-center gap-3">
        <Avatar hue={barber.avatarHue} name={barber.name} size={36} src={barber.photo} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Chatting with</p>
          <p className="text-sm font-semibold truncate">{barber.designation} at {salon.name}</p>
        </div>
        <Link to="/book/$barberId" params={{ barberId: barber.id }}
          className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5"/> Book
        </Link>
      </div>

      <div ref={ref} className="px-4 py-4 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)", minHeight: 360 }}>
        <DayLabel label="Today" />
        {msgs.map((m) => <Bubble key={m.id} msg={m} barber={barber} />)}
        {typing && <TypingBubble barber={barber} />}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur border-t border-border px-3 py-2">
        <div className="flex items-end gap-2">
          <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"><Paperclip className="h-4 w-4"/></button>
          <div className="flex-1 bg-secondary rounded-2xl flex items-end px-3 py-2">
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm resize-none max-h-24"
            />
            <Smile className="h-5 w-5 text-muted-foreground" />
          </div>
          <button onClick={send} className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50" disabled={!text.trim()}>
            <Send className="h-4 w-4"/>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function DayLabel({ label }: { label: string }) {
  return <div className="text-center"><span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{label}</span></div>;
}

function Bubble({ msg, barber }: { msg: Msg; barber: Barber }) {
  const me = msg.from === "me";
  return (
    <div className={cn("flex gap-2 items-end", me && "justify-end")}>
      {!me && <Avatar hue={barber.avatarHue} name={barber.name} size={26} src={barber.photo} />}
      <div className={cn(
        "max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
        me ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"
      )}>
        <p>{msg.text}</p>
        <div className={cn("flex items-center gap-1 text-[10px] mt-0.5", me ? "text-primary-foreground/70 justify-end" : "text-muted-foreground")}>
          {msg.time} {me && <CheckCheck className={cn("h-3 w-3", msg.read ? "" : "opacity-60")}/>}
        </div>
      </div>
    </div>
  );
}

function TypingBubble({ barber }: { barber: Barber }) {
  return (
    <div className="flex gap-2 items-end">
      <Avatar hue={barber.avatarHue} name={barber.name} size={26} src={barber.photo} />
      <div className="bg-secondary px-3 py-3 rounded-2xl rounded-bl-md flex gap-1">
        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" />
        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:240ms]" />
      </div>
    </div>
  );
}