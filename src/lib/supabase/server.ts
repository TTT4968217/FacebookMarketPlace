import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export function getSupabaseServer(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (init?.method === "POST" && !headers.has("Prefer")) {
          headers.set("Prefer", "return=minimal");
        }
        return fetch(input, { ...init, headers });
      },
    },
  });
}
