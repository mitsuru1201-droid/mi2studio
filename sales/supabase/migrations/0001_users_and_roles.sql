-- =====================================================================
-- 0001 利用者と役割
-- Supabase の SQL Editor に貼り付けて実行する（上から順に1回だけ）
-- =====================================================================

-- 役割：部長／運用管理者（充）／営業／制作
create type public.user_role as enum ('manager', 'admin', 'sales', 'production');

-- 利用者プロフィール（Supabase認証のユーザーと1対1）
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  role        public.user_role not null default 'sales',
  -- 退職・休止者は false にする（データは残し、ログインだけ止める）
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is '利用者（役割つき）';

-- 更新日時を自動で入れる共通関数（以降のテーブルでも使う）
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 認証ユーザーが作られたら、プロフィールを自動作成する
-- 役割は安全側の「営業」で作り、部長・充が後から変更する
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 権限判定の関数（以降のテーブルの RLS でも使う）
-- security definer：profiles の RLS を経由せずに自分の役割を読むため
-- ---------------------------------------------------------------------

-- ログイン中の利用者の役割（無効化されている場合は null）
create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active;
$$;

-- 部長または充（全件編集・マスタ管理ができる役割）か
create or replace function public.is_admin_role()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() in ('manager', 'admin'), false);
$$;

-- 有効な利用者か（無効化された人はデータを一切読めない）
create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = public as $$
  select public.current_user_role() is not null;
$$;

-- ---------------------------------------------------------------------
-- profiles の RLS
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- 有効な利用者は全員の名前・役割を見られる（担当者の選択肢に使うため）
create policy "profiles_select" on public.profiles
  for select using (public.is_active_user());

-- 変更できるのは部長・充のみ
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin_role()) with check (public.is_admin_role());

-- 本人は自分の表示名だけ変更できる（役割・有効状態は変えられない）
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and is_active = (select p.is_active from public.profiles p where p.id = auth.uid())
  );

-- 追加・削除は画面からは行わない（認証ユーザー作成時のトリガーのみ）
