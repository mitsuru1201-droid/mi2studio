"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "ログイン中…" : "ログイン"}
    </button>
  );
}

export function LoginForm({ notice }: { notice?: string }) {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      {notice && <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">{notice}</p>}
      {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <label className="block">
        <span className="text-sm font-medium">メールアドレス</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">パスワード</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
