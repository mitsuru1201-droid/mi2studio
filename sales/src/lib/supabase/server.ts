// サーバー側（Server Component / Server Action）で使う Supabase クライアント
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

export function createClient() {
  const { url, anonKey } = supabaseEnv();
  const cookieStore = cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component からは cookie を書けない。セッション更新は middleware が行うので無視してよい
        }
      },
    },
  });
}
