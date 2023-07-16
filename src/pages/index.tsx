import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth(auth)
  return (
    <Layout>
      <div className="flex flex-col">
        <Link className="text-xl mb-2 link" href="/add">サークル/購入物追加</Link>
        <Link className="text-xl mb-2 link" href="/item/list">購入物一覧</Link>
        <Link className="text-xl mb-2 link" href={`/user/${user?.uid}`}>自分の購入物一覧</Link>
      </div>
    </Layout>
  )
}
