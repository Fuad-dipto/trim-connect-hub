import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Store, TrendingUp, Users, Scissors, Briefcase, Calendar,
  ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOwnerAccount, ownerAccountActions } from "@/lib/owner-account";

export const Route = createFileRoute("/owner-portal")({ component: OwnerPortal });

function OwnerPortal() {
  const account = useOwnerAccount((s) => s.account);
  const session = useOwnerAccount((s) => s.session);
  const nav = useNavigate();

  useEffect(() => {
    if (account && session) nav({ to: "/owner" });
  }, [account, session, nav]);

  return (
    <MobileShell>
      <PageHeader title="Owner Portal" back={() => history.back()} />
      <div className="px-5 py-4">
        {!account ? <BecomeOwner /> : <OwnerLogin email={account.email} />}
      </div>
    </MobileShell>
  );
}

function BecomeOwner() {
  const benefits = [
    { icon: Calendar, label: "Manage Bookings", desc: "Accept, reschedule and assign with one tap." },
    { icon: Users, label: "Manage Staff", desc: "Add barbers, set availability and skills." },
    { icon: Scissors, label: "Manage Services", desc: "Build your menu with prices & durations." },
    { icon: TrendingUp, label: "Track Revenue", desc: "Live earnings, charts and peak hours." },
    { icon: Briefcase, label: "Hire Employees", desc: "Post jobs and review applications." },
  ];
  return (
    <div className="space-y-5">
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
          <ShieldCheck className="h-4 w-4" /> Verified Business Account
        </div>
        <h2 className="mt-3 text-2xl font-bold leading-tight">Become a Salon Owner</h2>
        <p className="mt-1 text-sm opacity-90">Run your salon end-to-end on TrimGo — bookings, team, services & revenue in one place.</p>
        <div className="mt-5 flex gap-2">
          <Button asChild className="rounded-xl bg-background text-foreground hover:bg-background/90 font-semibold">
            <Link to="/owner-register">Register Salon <ArrowRight className="h-4 w-4 ml-1"/></Link>
          </Button>
          <Button variant="ghost" className="rounded-xl text-primary-foreground hover:bg-white/10">Learn More</Button>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What you get</p>
        <ul className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          {benefits.map((b) => (
            <li key={b.label} className="flex items-start gap-3 p-4">
              <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <b.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
        <Store className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground flex-1">Already registered as an owner? Sign in once your account is set up.</p>
      </section>
    </div>
  );
}

function OwnerLogin({ email: defaultEmail }: { email: string }) {
  const nav = useNavigate();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const ok = ownerAccountActions.login(email, password);
      setSubmitting(false);
      if (!ok) {
        toast.error("Invalid credentials", { description: "Check your email and password." });
        return;
      }
      toast.success("Welcome back!");
      nav({ to: "/owner" });
    }, 400);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
          <ShieldCheck className="h-4 w-4" /> Secure Owner Login
        </div>
        <h2 className="mt-3 text-2xl font-bold">Owner Portal</h2>
        <p className="mt-1 text-sm opacity-80">Sign in to manage your salon, team, bookings and revenue.</p>
      </section>

      <form onSubmit={submit} className="rounded-2xl bg-card border border-border p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@example.com" className="h-11 pl-9 rounded-xl"/>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 pl-9 pr-9 rounded-xl"/>
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-input"/>
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <button type="button" className="text-primary font-semibold">Forgot password?</button>
        </div>

        <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-semibold">
          {submitting ? "Signing in…" : "Login to Owner Portal"}
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border"/>or<div className="h-px flex-1 bg-border"/>
        </div>

        <button type="button" className="w-full h-12 rounded-xl border border-border bg-background flex items-center justify-center gap-2 font-medium hover:bg-secondary/50">
          <GoogleIcon/> Continue with Google
        </button>
      </form>

      <p className={cn("text-center text-xs text-muted-foreground")}>
        Not your account?{" "}
        <Link to="/owner-register" className="text-primary font-semibold">Register a new salon</Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}