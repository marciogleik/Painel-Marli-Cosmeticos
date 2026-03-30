import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  full_name: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PROFILE_CACHE_KEY = "user_profile_cache";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newProfile = {
          full_name: data.full_name || "",
          avatar_url: data.avatar_url
        };
        setProfile(newProfile);
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(newProfile));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) await fetchProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          fetchProfile(session.user.id);
          
          if (_event === "SIGNED_IN") {
            supabase
              .from("professionals")
              .update({ last_login_at: new Date().toISOString() })
              .eq("user_id", session.user.id)
              .then(() => {});
          }
        } else {
          setProfile(null);
          localStorage.removeItem(PROFILE_CACHE_KEY);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    localStorage.removeItem(PROFILE_CACHE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
