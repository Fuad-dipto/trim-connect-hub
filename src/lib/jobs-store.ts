import { useSyncExternalStore } from "react";

export type Position =
  | "Hair Stylist" | "Barber" | "Makeup Artist" | "Nail Technician"
  | "Beautician" | "Receptionist" | "Manager" | "Other";

export type Employment = "Full-Time" | "Part-Time" | "Contract";
export type JobStatus = "active" | "paused" | "closed" | "filled";
export type AppStatus = "new" | "shortlisted" | "interview" | "hired" | "rejected";

export type Job = {
  id: string;
  title: string;
  position: Position;
  employment: Employment;
  salaryMin: number;
  salaryMax: number;
  experience: string;        // e.g. "2+ years"
  experienceYears: number;   // for filtering
  skills: string[];
  description: string;
  location: string;
  vacancies: number;
  deadline: string;          // YYYY-MM-DD
  contact: string;
  benefits: string;
  salonName: string;
  salonVerified: boolean;
  status: JobStatus;
  createdAt: number;
};

export type Application = {
  id: string;
  jobId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  skills: string[];
  expectedSalary: number;
  coverLetter: string;
  cvName?: string;
  portfolio?: string[];      // data URLs
  status: AppStatus;
  createdAt: number;
};

const KEY = "tg.jobs.v1";
const uid = () => Math.random().toString(36).slice(2, 9);

type State = { jobs: Job[]; apps: Application[] };

function seed(): State {
  const now = Date.now();
  const jobs: Job[] = [
    {
      id: uid(), title: "Senior Hair Stylist", position: "Hair Stylist", employment: "Full-Time",
      salaryMin: 25000, salaryMax: 40000, experience: "3+ years", experienceYears: 3,
      skills: ["Color", "Fade", "Styling"],
      description: "Join our premium studio. We're hiring an experienced stylist for our Gulshan 2 branch.",
      location: "Gulshan 2, Dhaka", vacancies: 2, deadline: new Date(now + 14*864e5).toISOString().slice(0,10),
      contact: "hr@luxecuts.bd", benefits: "Tips, training, performance bonus",
      salonName: "Luxe Cuts Studio", salonVerified: true, status: "active", createdAt: now - 3*864e5,
    },
    {
      id: uid(), title: "Makeup Artist (Bridal)", position: "Makeup Artist", employment: "Contract",
      salaryMin: 18000, salaryMax: 30000, experience: "2+ years", experienceYears: 2,
      skills: ["Bridal", "HD Makeup", "Hairstyling"],
      description: "Weekend bridal contract work. High-volume season ahead.",
      location: "Banani, Dhaka", vacancies: 1, deadline: new Date(now + 10*864e5).toISOString().slice(0,10),
      contact: "+880 1712 000 111", benefits: "Travel allowance, weekend bonus",
      salonName: "Glow House", salonVerified: true, status: "active", createdAt: now - 1*864e5,
    },
    {
      id: uid(), title: "Receptionist", position: "Receptionist", employment: "Part-Time",
      salaryMin: 10000, salaryMax: 14000, experience: "Fresher OK", experienceYears: 0,
      skills: ["Communication", "Booking software", "English"],
      description: "Front desk for a busy unisex salon. Shift-based.",
      location: "Dhanmondi, Dhaka", vacancies: 1, deadline: new Date(now + 7*864e5).toISOString().slice(0,10),
      contact: "careers@trimgo.app", benefits: "Meals, transport",
      salonName: "Style Hub", salonVerified: false, status: "active", createdAt: now - 5*864e5,
    },
  ];
  return { jobs, apps: [] };
}

function load(): State {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch { /* ignore */ }
  const s = seed();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}

let state: State = load();
const listeners = new Set<() => void>();
function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }

export function useJobsStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const jobsActions = {
  addJob(j: Omit<Job, "id" | "createdAt" | "status"> & Partial<Pick<Job, "status">>): string {
    const id = uid();
    const job: Job = { id, createdAt: Date.now(), status: j.status ?? "active", ...j };
    state = { ...state, jobs: [job, ...state.jobs] };
    emit();
    return id;
  },
  updateJob(id: string, patch: Partial<Job>) {
    state = { ...state, jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) };
    emit();
  },
  deleteJob(id: string) {
    state = {
      ...state,
      jobs: state.jobs.filter((j) => j.id !== id),
      apps: state.apps.filter((a) => a.jobId !== id),
    };
    emit();
  },
  apply(a: Omit<Application, "id" | "createdAt" | "status">): string {
    const id = uid();
    const app: Application = { id, createdAt: Date.now(), status: "new", ...a };
    state = { ...state, apps: [app, ...state.apps] };
    emit();
    return id;
  },
  setAppStatus(id: string, status: AppStatus) {
    state = { ...state, apps: state.apps.map((a) => (a.id === id ? { ...a, status } : a)) };
    emit();
  },
};

export const POSITIONS: Position[] = [
  "Hair Stylist", "Barber", "Makeup Artist", "Nail Technician",
  "Beautician", "Receptionist", "Manager", "Other",
];
export const EMPLOYMENTS: Employment[] = ["Full-Time", "Part-Time", "Contract"];