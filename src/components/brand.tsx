import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30", sz)}>
        <Scissors className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <span className={cn("font-bold tracking-tight", text)}>
        Trim<span className="text-primary">Go</span>
      </span>
    </div>
  );
}

export function GradientBlob({ hue, className }: { hue: number; className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, oklch(0.78 0.16 ${hue}) 0%, oklch(0.45 0.22 ${(hue + 40) % 360}) 100%)`,
      }}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-black/20 blur-2xl" />
    </div>
  );
}

export function Avatar({ hue, name, size = 40 }: { hue: number; name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shadow-sm"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, oklch(0.7 0.18 ${hue}), oklch(0.45 0.22 ${(hue + 60) % 360}))`,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}