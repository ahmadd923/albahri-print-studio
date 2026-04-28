import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; full_name: string | null; phone: string | null; email: string | null };
const ADMIN_EMAIL = "bahriabed16@gmail.com";

const isAdminEmail = (email?: string | null) => email?.trim().toLowerCase() === ADMIN_EMAIL;

interface AuthState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ensureProfileAndRole = async (currentUser: User) => {
    const email = currentUser.email ?? "";
    const metadata = currentUser.user_metadata as { full_name?: string; phone?: string } | null;
    await supabase.from("profiles").upsert({
      id: currentUser.id,
      email,
      full_name: metadata?.full_name ?? "",
      phone: metadata?.phone ?? "",
    }, { onConflict: "id", ignoreDuplicates: true });

    if (isAdminEmail(email)) {
      await supabase.from("user_roles").upsert({ user_id: currentUser.id, role: "admin" }, { onConflict: "user_id,role" });
    }
  };

  const loadExtras = async (currentUser: User) => {
    await ensureProfileAndRole(currentUser);
    const uid = currentUser.id;
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, email").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile(prof ?? null);
    setIsAdmin(isAdminEmail(currentUser.email) || !!roles?.some((r) => r.role === "admin"));
  };

  const refreshProfile = async () => {
    if (user) await loadExtras(user);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setLoading(true);
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // Defer to avoid deadlocks inside the listener
        setTimeout(() => loadExtras(s.user).finally(() => setLoading(false)), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadExtras(s.user).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ loading, user, session, profile, isAdmin, refreshProfile, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}