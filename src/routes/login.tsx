import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/mobile-shell";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Search = { next?: string };

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (s: Record<string, unknown>): Search => ({ next: typeof s.next === "string" ? s.next : undefined }),
});

function LoginPage() {
  const nav = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [show, setShow] = useState(false);
  const { t } = useT();

  function go() {
    if (next) window.location.assign(next);
    else nav({ to: "/home" });
  }

  return (
    <MobileShell>
      <PageHeader title={t("Sign in")} back={() => history.back()} />
      <div className="px-5 py-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Brand size="lg"/></div>
          <h1 className="text-xl font-bold">{mode === "login" ? t("Welcome back") : t("Create your account")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("Required to confirm and pay for your booking")}</p>
        </div>

        <button onClick={go} className="w-full h-12 rounded-xl border border-border bg-card flex items-center justify-center gap-3 font-medium hover:bg-secondary/50 transition">
          <GoogleIcon /> {t("Continue with Google")}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border"/>{t("or")}<div className="h-px flex-1 bg-border"/>
        </div>

        <div className="space-y-3">
          {mode === "signup" && (
            <Field label={t("Full name")} placeholder={t("Your name")} />
          )}
          <Field label={t("Email")} placeholder="you@example.com" icon={<Mail className="h-4 w-4"/>} type="email" />
          <div>
            <label className="text-xs font-medium text-muted-foreground">{t("Password")}</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input type={show ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9 h-11 rounded-xl"/>
              <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
            </div>
          </div>
        </div>

        <Button onClick={go} className="w-full h-12 mt-4 rounded-xl font-semibold">
          {mode === "login" ? t("Sign in & continue") : t("Create account & continue")}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {mode === "login" ? t("New here? ") : t("Already have an account? ")}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold">
            {mode === "login" ? t("Create account") : t("Sign in")}
          </button>
        </p>
      </div>
    </MobileShell>
  );
}

function Field({ label, placeholder, icon, type = "text" }: { label: string; placeholder: string; icon?: React.ReactNode; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1 relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <Input type={type} placeholder={placeholder} className={cn("h-11 rounded-xl", icon && "pl-9")}/>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}