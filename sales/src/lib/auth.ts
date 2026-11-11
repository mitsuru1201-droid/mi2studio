// ログイン中の利用者（プロフィール付き）を取得する
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/roles";

export async function requireProfile(): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, is_active")
    .eq("id", user.id)
    .single<Profile>();

  // 無効化された利用者（RLSで読めない）や、プロフィール未作成はログアウトさせる
  if (!profile || !profile.is_active) redirect("/auth/signout?reason=inactive");
  return profile;
}
