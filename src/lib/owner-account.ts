import { useSyncExternalStore } from "react";

export type OwnerAccount = {
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string; // demo only — plain string
  salonName: string;
  description: string;
  category: string;
  logo?: string;
  cover?: string;
  gallery: string[];
  address: string;
  mapLocation: string;
  hours: string;
  registeredAt: number;
};

type State = { account: OwnerAccount | null; session: boolean };

const ACCOUNT_KEY = "tg.ownerAccount";
const SESSION_KEY = "tg.ownerSession";

function load(): State {
  if (typeof window === "undefined") return { account: null, session: false };
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    const account = raw ? (JSON.parse(raw) as OwnerAccount) : null;
    const session = localStorage.getItem(SESSION_KEY) === "1";
    return { account, session: account ? session : false };
  } catch {
    return { account: null, session: false };
  }
}

let state: State = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function useOwnerAccount<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const ownerAccountActions = {
  register(a: Omit<OwnerAccount, "registeredAt">) {
    const account: OwnerAccount = { ...a, registeredAt: Date.now() };
    state = { account, session: true };
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
      localStorage.setItem(SESSION_KEY, "1");
    } catch { /* ignore */ }
    emit();
  },
  login(email: string, password: string): boolean {
    if (!state.account) return false;
    if (state.account.email.toLowerCase() !== email.toLowerCase()) return false;
    if (state.account.passwordHash !== password) return false;
    state = { ...state, session: true };
    try { localStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
    emit();
    return true;
  },
  logout() {
    state = { ...state, session: false };
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    emit();
  },
};