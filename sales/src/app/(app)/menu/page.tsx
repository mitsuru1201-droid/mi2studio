// スマホ用メニュー：ログイン中の利用者情報とログアウト
import { requireProfile } from "@/lib/auth";
import { ROLE_LABELS, canManageMasters } from "@/lib/roles";

export default async function MenuPage() {
  const profile = await requireProfile();
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">メニュー</h1>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">ログイン中</p>
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-sm text-slate-600">役割：{ROLE_LABELS[profile.role]}</p>
      </div>
      {canManageMasters(profile.role) && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
          マスタ管理（業種・エリア・プラン・失注理由・利用者の役割）は次の段階で追加します。
        </div>
      )}
      <form action="/auth/signout" method="post">
        <button className="w-full rounded-lg border border-slate-300 bg-white py-3 font-medium">ログアウト</button>
      </form>
    </section>
  );
}
