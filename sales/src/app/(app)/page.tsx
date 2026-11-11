import { redirect } from "next/navigation";

// MVPのトップは案件ボード（ダッシュボード完成後に差し替える）
export default function Home() {
  redirect("/deals");
}
