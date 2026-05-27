import { useSyncExternalStore } from "react";

export type EmployeeStatus = "free" | "busy" | "offline";

export type Employee = {
  id: string;
  name: string;
  phone: string;
  address: string;
  role: string;
  experience: string;
  skills: string[];
  serviceIds: string[];
  status: EmployeeStatus;
  rating: number;
  /** data URL or hue fallback */
  photo?: string;
  hue: number;
};

export type OwnerService = {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
};

export type SalonProfile = {
  name: string;
  tagline: string;
  about: string;
  address: string;
  phone: string;
  hours: string;
  coverPhoto?: string;
  profilePhoto?: string;
  socials: { instagram: string; facebook: string; website: string };
};

type State = {
  profile: SalonProfile;
  employees: Employee[];
  services: OwnerService[];
};

const uid = () => Math.random().toString(36).slice(2, 9);

let state: State = {
  profile: {
    name: "Luxe Cuts Studio",
    tagline: "Premium hair studio in Gulshan 2",
    about:
      "Award-winning hair studio with senior stylists trained in London. Walk-ins welcome. Refreshments served.",
    address: "Road 11, Gulshan 2, Dhaka",
    phone: "+880 1712 345 678",
    hours: "10:00 AM — 10:00 PM",
    socials: {
      instagram: "luxecuts.bd",
      facebook: "luxecutsstudio",
      website: "luxecuts.co",
    },
  },
  services: [
    { id: "s1", name: "Classic Haircut", description: "Wash, cut and style", category: "Hair", duration: 30, price: 350 },
    { id: "s2", name: "Beard Trim & Shape", description: "Hot towel + precise trim", category: "Beard", duration: 20, price: 200 },
    { id: "s3", name: "Hair Color", description: "Premium color treatment", category: "Color", duration: 75, price: 1500 },
    { id: "s4", name: "Facial Glow", description: "Deep cleansing facial", category: "Skin", duration: 45, price: 900 },
    { id: "s5", name: "Royal Shave", description: "Straight razor experience", category: "Beard", duration: 30, price: 450 },
    { id: "s6", name: "Kids Cut", description: "Gentle cut for kids", category: "Hair", duration: 20, price: 180 },
  ],
  employees: [
    { id: "e1", name: "Rohim Ahmed", phone: "+880 1711 111 111", address: "Banani, Dhaka", role: "Senior Stylist", experience: "8 yrs", skills: ["Fade", "Color", "Beard"], serviceIds: ["s1","s2","s3"], status: "free", rating: 4.9, hue: 35 },
    { id: "e2", name: "Karim Hossain", phone: "+880 1722 222 222", address: "Mirpur, Dhaka", role: "Master Barber", experience: "12 yrs", skills: ["Classic", "Shave"], serviceIds: ["s1","s5"], status: "busy", rating: 4.8, hue: 65 },
    { id: "e3", name: "Sharif Islam", phone: "+880 1733 333 333", address: "Uttara, Dhaka", role: "Stylist", experience: "4 yrs", skills: ["Modern", "Kids"], serviceIds: ["s1","s6"], status: "free", rating: 4.7, hue: 45 },
    { id: "e4", name: "Niloy Khan", phone: "+880 1744 444 444", address: "Dhanmondi, Dhaka", role: "Color Specialist", experience: "6 yrs", skills: ["Color", "Highlights"], serviceIds: ["s3","s4"], status: "free", rating: 4.9, hue: 25 },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

export function useOwnerStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const ownerActions = {
  updateProfile(patch: Partial<SalonProfile>) {
    state = { ...state, profile: { ...state.profile, ...patch, socials: { ...state.profile.socials, ...(patch.socials || {}) } } };
    emit();
  },
  addEmployee(e: Omit<Employee, "id" | "rating" | "hue"> & Partial<Pick<Employee, "rating" | "hue">>) {
    const emp: Employee = { id: uid(), rating: 5.0, hue: Math.floor(Math.random() * 360), ...e };
    state = { ...state, employees: [emp, ...state.employees] };
    emit();
  },
  updateEmployee(id: string, patch: Partial<Employee>) {
    state = { ...state, employees: state.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) };
    emit();
  },
  deleteEmployee(id: string) {
    state = { ...state, employees: state.employees.filter((e) => e.id !== id) };
    emit();
  },
  addService(s: Omit<OwnerService, "id">) {
    state = { ...state, services: [{ id: uid(), ...s }, ...state.services] };
    emit();
  },
  updateService(id: string, patch: Partial<OwnerService>) {
    state = { ...state, services: state.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) };
    emit();
  },
  deleteService(id: string) {
    state = {
      ...state,
      services: state.services.filter((s) => s.id !== id),
      employees: state.employees.map((e) => ({ ...e, serviceIds: e.serviceIds.filter((sid) => sid !== id) })),
    };
    emit();
  },
};