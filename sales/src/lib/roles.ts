// 役割の定義と、画面側で使う権限の判定
// ※本当の権限制御はDB（RLS）側で行う。ここは「ボタンを出す/出さない」の表示用

export type UserRole = "manager" | "admin" | "sales" | "production";

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: "部長",
  admin: "運用管理者",
  sales: "営業",
  production: "制作",
};

export type Profile = {
  id: string;
  name: string;
  role: UserRole;
  is_active: boolean;
};

/** 部長・運用管理者（全件編集・マスタ管理ができる） */
export function isAdminRole(role: UserRole): boolean {
  return role === "manager" || role === "admin";
}

/** 顧客・案件を編集できるか（営業は自分の担当分のみ） */
export function canEditOwned(profile: Profile, ownerId: string | null): boolean {
  if (isAdminRole(profile.role)) return true;
  return profile.role === "sales" && ownerId === profile.id;
}

/** マスタ管理画面を使えるか */
export function canManageMasters(role: UserRole): boolean {
  return isAdminRole(role);
}
