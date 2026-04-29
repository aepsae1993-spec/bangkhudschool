"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    sb.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace("/admin/login");
        setUser(null);
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return { user, loading, signOut };
}
