import { LoginForm } from "./LoginForm";

export default function LoginPage({ searchParams }: { searchParams: { reason?: string } }) {
  const notice =
    searchParams.reason === "inactive"
      ? "このアカウントは現在利用できません。部長または運用管理者に確認してください。"
      : undefined;
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-1 text-xl font-bold">営業管理</h1>
        <p className="mb-6 text-sm text-slate-500">AI × SNS販売支援</p>
        <LoginForm notice={notice} />
        <p className="mt-6 text-xs text-slate-400">
          アカウントの発行・パスワード再設定は部長または運用管理者に依頼してください。
        </p>
      </div>
    </main>
  );
}
