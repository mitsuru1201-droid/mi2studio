# 営業管理ツール

車両販売店向け「AI × SNS販売支援」サービスの営業管理ツール。
設計書：[docs/01-mvp-design.md](docs/01-mvp-design.md)

構成：Next.js 14 ＋ Supabase（認証・DB）＋ Tailwind CSS。金額はすべて税別。

---

## はじめての準備（1回だけ）

### 1. Supabase のプロジェクトを作る
1. https://supabase.com でアカウントを作り、「New project」を作成（無料プランで可・リージョンは Tokyo 推奨）
2. 左メニュー「SQL Editor」を開き、`supabase/migrations/` のSQLファイルを**番号順に**貼り付けて「Run」
3. 「Authentication → Sign In / Providers」で **「Allow new users to sign up」をオフ**にする（勝手な新規登録を防ぐ）

### 2. 接続設定
「Project Settings → API」の値を `.env.local` に書く（`.env.example` をコピーして編集）。

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. 利用者を追加する
1. Supabase の「Authentication → Users → Add user → Create new user」でメールアドレスとパスワードを入力
   （「Auto Confirm User」にチェック）
2. 追加した人は自動で**「営業」役割**になる
3. 最初の1人（部長）だけは SQL Editor で役割を変更する：

```sql
update public.profiles set role = 'manager', name = '表示名' where id =
  (select id from auth.users where email = 'メールアドレス');
```

役割の値：`manager`＝部長／`admin`＝運用管理者／`sales`＝営業／`production`＝制作
（2人目以降の役割変更は、今後追加する「マスタ管理」画面からできるようにする）

### 4. 起動
```
cd sales
npm install
npm run dev
```
ブラウザで http://localhost:3100 を開く。

---

## 権限のしくみ
権限はDB側（Supabase の RLS）で強制しているため、画面に不具合があっても他人のデータを書き換えられない。

| 役割 | 閲覧 | 編集 | マスタ・利用者管理 |
|---|---|---|---|
| 部長・運用管理者 | 全件 | 全件 | 可 |
| 営業 | 全件 | 自分の担当分のみ | 不可 |
| 制作 | 受注案件のみ | 不可（制作進捗は第2段階） | 不可 |

退職者は `profiles.is_active` を false にすると、ログインしても何も見られなくなる（データは残る）。
