import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "customer" | "owner";
const KEY = "tg.role";

type Ctx = { role: Role; setRole: (r: Role) => void };
const RoleCtx = createContext<Ctx>({ role: "customer", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("customer");
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "owner" || v === "customer") setRoleState(v);
    } catch { /* ignore */ }
  }, []);
  function setRole(r: Role) {
    setRoleState(r);
    try { localStorage.setItem(KEY, r); } catch { /* ignore */ }
  }
  return <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  return useContext(RoleCtx);
}