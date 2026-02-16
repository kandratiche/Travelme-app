import React, { createContext, useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user ?? null;
        if (sessionUser) {
          const profile = await fetchUserProfile(sessionUser.id);
          setUser(profile);
        }
      } catch (err) {
        console.warn('Failed to get session (Supabase may not be configured):', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    let listener: { subscription: { unsubscribe: () => void } } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
          } else {
            setUser(null);
          }
        }
      );
      listener = data;
    } catch (err) {
      console.warn('Failed to subscribe to auth changes:', err);
    }

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
