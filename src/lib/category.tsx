import { useSyncExternalStore } from "react";
import type { Category } from "@/lib/mock-data";
import { Scissors, Sparkles, Home, Heart, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_META: {
  id: Category;
  label: string;
  tagline: string;
  services: string[];
  icon: LucideIcon;
  gradient: string;
}[] = [
  {
    id: "male",
    label: "Male Grooming",
    tagline: "Salons, barbers & grooming for men",
    services: ["Haircut", "Beard Trim", "Facial", "Hair Spa", "Hair Color", "Grooming Packages"],
    icon: Scissors,
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
  },
  {
    id: "female",
    label: "Female Beauty & Parlour",
    tagline: "Beauty parlours & ladies-only salons",
    services: ["Hair Cut", "Styling", "Facial", "Skin Care", "Makeup", "Nails", "Spa"],
    icon: Sparkles,
    gradient: "from-pink-500 via-fuchsia-500 to-rose-600",
  },
  {
    id: "home",
    label: "Home Services",
    tagline: "Professionals visit your home",
    services: ["Home Massage", "Home Salon", "Home Haircut", "Home Facial", "Home Grooming"],
    icon: Home,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    id: "bridal",
    label: "Bridal Services",
    tagline: "Bridal makeup, mehendi & wedding looks",
    services: ["Bridal Makeup", "Mehendi Artist", "Hair Styling", "Bridal Dressing", "Wedding Packages"],
    icon: Heart,
    gradient: "from-rose-500 via-pink-600 to-red-600",
  },
  {
    id: "wedding",
    label: "Wedding & Event",
    tagline: "Photographers, videographers & event teams",
    services: ["Photographer", "Videographer", "Cinematic Coverage", "Event Decor"],
    icon: Camera,
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
  },
];

const KEY = "tg.category";

function read(): Category | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY) as Category | null;
    return v && CATEGORY_META.some((c) => c.id === v) ? v : null;
  } catch {
    return null;
  }
}

let current: Category | null = read();
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const getSnap = () => current;

export function useCategory(): Category | null {
  return useSyncExternalStore(subscribe, getSnap, getSnap);
}

export function setCategory(c: Category | null) {
  current = c;
  try {
    if (c) localStorage.setItem(KEY, c);
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function getCategoryMeta(c: Category) {
  return CATEGORY_META.find((m) => m.id === c)!;
}