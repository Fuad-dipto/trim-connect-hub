import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, ShieldCheck, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useCategory } from "@/lib/category";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const nav = useNavigate();
  const [stage, setStage] = useState<"intro" | "locating">("intro");
  const { t } = useT();
  const category = useCategory();

  function allow() {
    setStage("locating");
    setTimeout(() => nav({ to: category ? "/home" : "/categories" }), 1400);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/85 to-accent/80 text-primary-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Brand size="lg" className="text-white [&_span]:text-white [&_.text-primary]:text-white/80" />
        </div>

        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
          {stage === "intro" ? (
            <>
              <div className="mx-auto h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold text-center">{t("Find salons & barbers near you")}</h1>
              <p className="text-sm text-center text-white/80 mt-2">
                {t("We need your location to show real-time nearby shops, prices and wait times.")}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3"><Navigation className="h-5 w-5 shrink-0" /> {t("Auto-detect nearby salons")}</li>
                <li className="flex gap-3"><Sparkles className="h-5 w-5 shrink-0" /> {t("Live crowd & queue updates")}</li>
                <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0" /> {t("Your location stays private")}</li>
              </ul>

              <div className="mt-6 space-y-2">
                <Button onClick={allow} className="w-full h-12 rounded-xl bg-white text-primary hover:bg-white/90 font-semibold">
                  {t("Allow location access")}
                </Button>
                <button onClick={() => nav({ to: category ? "/home" : "/categories" })} className="w-full h-10 text-sm text-white/80 hover:text-white">
                  {t("Not now")}
                </button>
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto relative h-20 w-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-white/30 animate-ping [animation-delay:200ms]" />
                <div className="relative h-full w-full rounded-full bg-white flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="font-semibold">{t("Detecting your location…")}</p>
              <p className="text-sm text-white/80 mt-1">{t("Finding salons near Gulshan 2")}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/70 mt-6">{t("By continuing you agree to TrimGo's Terms & Privacy")}</p>
      </div>
    </div>
  );
}
