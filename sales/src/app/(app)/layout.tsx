// ログイン後の共通レイアウト（全画面でログインと有効ユーザーを確認する）
import { requireProfile } from "@/lib/auth";
import { ROLE_LABELS, canManageMasters } from "@/lib/roles";
import { AppNav, type NavItem } from "@/components/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  // 役割によってメニューを出し分ける（マスタ管理は部長・運用管理者のみ）
  const items: NavItem[] = [
    { href: "/deals", label: "案件", icon: "📋" },
    { href: "/customers", label: "顧客", icon: "🏪" },
    { href: "/menu", label: "メニュー", icon: "☰" },
  ];

  return (
    <div className="md:flex">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block md:min-h-screen">
        <p className="mb-4 text-lg font-bold">営業管理</p>
        <AppNav items={items} />
        <div className="mt-8 border-t border-slate-200 pt-4 text-sm">
          <p className="font-medium">{profile.name}</p>
          <p className="text-slate-500">{ROLE_LABELS[profile.role]}</p>
          {canManageMasters(profile.role) && <p className="mt-1 text-xs text-slate-400">マスタ管理：可</p>}
          <form action="/auth/signout" method="post" className="mt-3">
            <button className="text-slate-500 underline">ログアウト</button>
          </form>
        </div>
      </aside>
      {/* スマホは下タブの高さぶん下に余白を取る */}
      <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">{children}</main>
      <div className="md:hidden">
        <AppNav items={items} />
      </div>
    </div>
  );
}
